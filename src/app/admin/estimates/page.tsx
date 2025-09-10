'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { generateEstimatePDF } from '@/lib/pdfGenerator'

interface EstimateItem {
  description: string
  quantity: number
  unitPrice: number
  amount?: number
}

interface Estimate {
  id: string
  estimateNumber: string
  issueDate: string
  validUntil: string
  clientName: string
  clientAddress: string
  clientEmail?: string
  items: EstimateItem[]
  subtotal: number
  tax: number
  total: number
  notes?: string
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired'
  createdAt: string
  updatedAt: string
}

export default function EstimatesAdmin() {
  const router = useRouter()
  const [estimates, setEstimates] = useState<Estimate[]>([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showNewEstimateForm, setShowNewEstimateForm] = useState(false)
  
  // ナビゲーションメニュー
  const navigationMenu = (
    <div className="mb-6 flex gap-4">
      <button
        onClick={() => router.push('/admin/contacts')}
        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
      >
        お問い合わせ管理
      </button>
      <button
        onClick={() => router.push('/admin/invoices')}
        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
      >
        請求書管理
      </button>
      <button
        onClick={() => router.push('/admin/estimates')}
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
      >
        見積書管理
      </button>
    </div>
  )

  // 新規見積書フォームの状態
  const [newEstimate, setNewEstimate] = useState({
    clientName: '',
    clientAddress: '',
    clientEmail: '',
    validUntil: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    items: [{ description: '', quantity: 1, unitPrice: 0 }],
    notes: ''
  })

  // 認証チェック
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === 'admin123') {
      setIsAuthenticated(true)
      fetchEstimates()
    } else {
      alert('パスワードが正しくありません')
    }
  }

  // 見積書一覧を取得
  const fetchEstimates = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/estimate', {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_API_KEY || 'dev-api-key'}`
        }
      })
      const data = await response.json()
      if (data.success) {
        setEstimates(data.estimates)
      }
    } catch (error) {
      console.error('Failed to fetch estimates:', error)
    } finally {
      setLoading(false)
    }
  }

  // 見積書項目を追加
  const addEstimateItem = () => {
    setNewEstimate({
      ...newEstimate,
      items: [...newEstimate.items, { description: '', quantity: 1, unitPrice: 0 }]
    })
  }

  // 見積書項目を削除
  const removeEstimateItem = (index: number) => {
    setNewEstimate({
      ...newEstimate,
      items: newEstimate.items.filter((_, i) => i !== index)
    })
  }

  // 見積書項目を更新
  const updateEstimateItem = (index: number, field: string, value: any) => {
    const updatedItems = [...newEstimate.items]
    updatedItems[index] = { ...updatedItems[index], [field]: value }
    setNewEstimate({ ...newEstimate, items: updatedItems })
  }

  // 見積書を作成
  const createEstimate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch('/api/estimate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_API_KEY || 'dev-api-key'}`
        },
        body: JSON.stringify(newEstimate)
      })
      const data = await response.json()
      if (data.success) {
        alert('見積書を作成しました')
        setShowNewEstimateForm(false)
        fetchEstimates()
        // フォームをリセット
        setNewEstimate({
          clientName: '',
          clientAddress: '',
          clientEmail: '',
          validUntil: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
          items: [{ description: '', quantity: 1, unitPrice: 0 }],
          notes: ''
        })
      }
    } catch (error) {
      console.error('Failed to create estimate:', error)
      alert('見積書の作成に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  // ステータスを更新
  const updateEstimateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch('/api/estimate', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_API_KEY || 'dev-api-key'}`
        },
        body: JSON.stringify({ id, status })
      })
      const data = await response.json()
      if (data.success) {
        fetchEstimates()
      }
    } catch (error) {
      console.error('Failed to update estimate:', error)
    }
  }

  // 請求書に変換
  const convertToInvoice = async (estimate: Estimate) => {
    if (confirm('この見積書を請求書に変換しますか？')) {
      try {
        const response = await fetch('/api/invoice', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_API_KEY || 'dev-api-key'}`
          },
          body: JSON.stringify({
            clientName: estimate.clientName,
            clientAddress: estimate.clientAddress,
            clientEmail: estimate.clientEmail,
            items: estimate.items,
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            notes: `見積書番号 ${estimate.estimateNumber} から作成`
          })
        })
        const data = await response.json()
        if (data.success) {
          alert('請求書を作成しました')
          router.push('/admin/invoices')
        }
      } catch (error) {
        console.error('Failed to convert to invoice:', error)
        alert('請求書への変換に失敗しました')
      }
    }
  }

  // 小計を計算
  const calculateSubtotal = () => {
    return newEstimate.items.reduce((sum, item) => {
      return sum + (item.quantity * item.unitPrice)
    }, 0)
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">見積書管理画面</h1>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="パスワードを入力"
              className="w-full p-3 border border-gray-300 rounded-md mb-4"
              required
            />
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition"
            >
              ログイン
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {navigationMenu}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">見積書管理</h1>
            <button
              onClick={() => setShowNewEstimateForm(!showNewEstimateForm)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
            >
              新規見積書作成
            </button>
          </div>

          {/* 新規見積書フォーム */}
          {showNewEstimateForm && (
            <div className="mb-8 p-6 bg-gray-50 rounded-lg">
              <h2 className="text-xl font-bold mb-4">新規見積書</h2>
              <form onSubmit={createEstimate}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      顧客名 *
                    </label>
                    <input
                      type="text"
                      value={newEstimate.clientName}
                      onChange={(e) => setNewEstimate({...newEstimate, clientName: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      メールアドレス
                    </label>
                    <input
                      type="email"
                      value={newEstimate.clientEmail}
                      onChange={(e) => setNewEstimate({...newEstimate, clientEmail: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    住所 *
                  </label>
                  <input
                    type="text"
                    value={newEstimate.clientAddress}
                    onChange={(e) => setNewEstimate({...newEstimate, clientAddress: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    有効期限
                  </label>
                  <input
                    type="date"
                    value={newEstimate.validUntil}
                    onChange={(e) => setNewEstimate({...newEstimate, validUntil: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>

                {/* 明細項目 */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    明細項目
                  </label>
                  {newEstimate.items.map((item, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="項目名"
                        value={item.description}
                        onChange={(e) => updateEstimateItem(index, 'description', e.target.value)}
                        className="flex-1 p-2 border border-gray-300 rounded-md"
                        required
                      />
                      <input
                        type="number"
                        placeholder="数量"
                        value={item.quantity}
                        onChange={(e) => updateEstimateItem(index, 'quantity', parseInt(e.target.value))}
                        className="w-20 p-2 border border-gray-300 rounded-md"
                        min="1"
                        required
                      />
                      <input
                        type="number"
                        placeholder="単価"
                        value={item.unitPrice}
                        onChange={(e) => updateEstimateItem(index, 'unitPrice', parseInt(e.target.value))}
                        className="w-32 p-2 border border-gray-300 rounded-md"
                        min="0"
                        required
                      />
                      {newEstimate.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeEstimateItem(index)}
                          className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                        >
                          削除
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addEstimateItem}
                    className="mt-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                  >
                    項目を追加
                  </button>
                </div>

                {/* 小計表示 */}
                <div className="mb-4 p-4 bg-white rounded border">
                  <div className="flex justify-between mb-2">
                    <span>小計:</span>
                    <span>¥{calculateSubtotal().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>消費税 (10%):</span>
                    <span>¥{Math.round(calculateSubtotal() * 0.1).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>合計:</span>
                    <span>¥{(calculateSubtotal() + Math.round(calculateSubtotal() * 0.1)).toLocaleString()}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    備考
                  </label>
                  <textarea
                    value={newEstimate.notes}
                    onChange={(e) => setNewEstimate({...newEstimate, notes: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    rows={3}
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition disabled:opacity-50"
                  >
                    {loading ? '作成中...' : '見積書を作成'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewEstimateForm(false)}
                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition"
                  >
                    キャンセル
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 見積書一覧 */}
          {loading && !showNewEstimateForm ? (
            <div className="text-center py-8 text-gray-500">読み込み中...</div>
          ) : estimates.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              見積書がありません
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      見積番号
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      顧客名
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      発行日
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      有効期限
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      金額
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      ステータス
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      アクション
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {estimates.map((estimate) => (
                    <tr key={estimate.id}>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {estimate.estimateNumber}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                        {estimate.clientName}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                        {estimate.issueDate ? format(new Date(estimate.issueDate), 'yyyy/MM/dd', { locale: ja }) : '-'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                        {estimate.validUntil ? format(new Date(estimate.validUntil), 'yyyy/MM/dd', { locale: ja }) : '-'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                        ¥{estimate.total.toLocaleString()}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <select
                          value={estimate.status}
                          onChange={(e) => updateEstimateStatus(estimate.id, e.target.value)}
                          className={`text-sm rounded-full px-3 py-1 ${
                            estimate.status === 'accepted' ? 'bg-green-100 text-green-800' :
                            estimate.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                            estimate.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            estimate.status === 'expired' ? 'bg-gray-100 text-gray-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          <option value="draft">下書き</option>
                          <option value="sent">送信済み</option>
                          <option value="accepted">承認済み</option>
                          <option value="rejected">却下</option>
                          <option value="expired">期限切れ</option>
                        </select>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => generateEstimatePDF(estimate)}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          PDF出力
                        </button>
                        <button
                          onClick={() => convertToInvoice(estimate)}
                          className="text-green-600 hover:text-green-900"
                        >
                          請求書へ
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}