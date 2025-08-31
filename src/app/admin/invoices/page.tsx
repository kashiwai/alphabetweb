'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import jsPDF from 'jspdf'

interface InvoiceItem {
  description: string
  quantity: number
  unitPrice: number
  amount?: number
}

interface Invoice {
  id: string
  invoiceNumber: string
  issueDate: string
  dueDate: string
  clientName: string
  clientAddress: string
  clientEmail?: string
  items: InvoiceItem[]
  subtotal: number
  tax: number
  total: number
  notes?: string
  status: 'draft' | 'sent' | 'paid' | 'overdue'
  createdAt: string
  updatedAt: string
}

export default function InvoicesAdmin() {
  const router = useRouter()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showNewInvoiceForm, setShowNewInvoiceForm] = useState(false)
  
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
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
      >
        請求書管理
      </button>
    </div>
  )

  // 新規請求書フォームの状態
  const [newInvoice, setNewInvoice] = useState({
    clientName: '',
    clientAddress: '',
    clientEmail: '',
    dueDate: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    items: [{ description: '', quantity: 1, unitPrice: 0 }],
    notes: ''
  })

  // 認証チェック
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === 'admin123') {
      setIsAuthenticated(true)
      fetchInvoices()
    } else {
      alert('パスワードが正しくありません')
    }
  }

  // 請求書一覧を取得
  const fetchInvoices = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/invoice', {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_API_KEY || 'dev-api-key'}`
        }
      })
      const data = await response.json()
      if (data.success) {
        setInvoices(data.invoices)
      }
    } catch (error) {
      console.error('Failed to fetch invoices:', error)
    } finally {
      setLoading(false)
    }
  }

  // 請求書項目を追加
  const addInvoiceItem = () => {
    setNewInvoice({
      ...newInvoice,
      items: [...newInvoice.items, { description: '', quantity: 1, unitPrice: 0 }]
    })
  }

  // 請求書項目を削除
  const removeInvoiceItem = (index: number) => {
    setNewInvoice({
      ...newInvoice,
      items: newInvoice.items.filter((_, i) => i !== index)
    })
  }

  // 請求書項目を更新
  const updateInvoiceItem = (index: number, field: string, value: any) => {
    const updatedItems = [...newInvoice.items]
    updatedItems[index] = { ...updatedItems[index], [field]: value }
    setNewInvoice({ ...newInvoice, items: updatedItems })
  }

  // 請求書を作成
  const createInvoice = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch('/api/invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_API_KEY || 'dev-api-key'}`
        },
        body: JSON.stringify(newInvoice)
      })
      const data = await response.json()
      if (data.success) {
        alert('請求書を作成しました')
        setShowNewInvoiceForm(false)
        fetchInvoices()
        // フォームをリセット
        setNewInvoice({
          clientName: '',
          clientAddress: '',
          clientEmail: '',
          dueDate: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
          items: [{ description: '', quantity: 1, unitPrice: 0 }],
          notes: ''
        })
      }
    } catch (error) {
      console.error('Failed to create invoice:', error)
      alert('請求書の作成に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  // ステータスを更新
  const updateInvoiceStatus = async (id: string, status: string) => {
    try {
      const response = await fetch('/api/invoice', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_API_KEY || 'dev-api-key'}`
        },
        body: JSON.stringify({ id, status })
      })
      const data = await response.json()
      if (data.success) {
        fetchInvoices()
      }
    } catch (error) {
      console.error('Failed to update invoice:', error)
    }
  }

  // PDFを生成
  const generatePDF = (invoice: Invoice) => {
    const doc = new jsPDF()
    
    // フォント設定（日本語対応は別途フォント追加が必要）
    doc.setFontSize(20)
    doc.text('請求書', 105, 20, { align: 'center' })
    
    // 請求書番号と日付
    doc.setFontSize(10)
    doc.text(`Invoice No: ${invoice.invoiceNumber}`, 20, 40)
    doc.text(`Issue Date: ${format(new Date(invoice.issueDate), 'yyyy/MM/dd')}`, 20, 45)
    doc.text(`Due Date: ${format(new Date(invoice.dueDate), 'yyyy/MM/dd')}`, 20, 50)
    
    // 会社情報
    doc.setFontSize(12)
    doc.text('ALPHABET Inc.', 20, 65)
    doc.setFontSize(10)
    doc.text('Tokyo, Chuo-ku, Ginza 1-12-4', 20, 70)
    
    // 顧客情報
    doc.setFontSize(12)
    doc.text('Bill To:', 20, 85)
    doc.setFontSize(10)
    doc.text(invoice.clientName, 20, 90)
    doc.text(invoice.clientAddress, 20, 95)
    if (invoice.clientEmail) {
      doc.text(invoice.clientEmail, 20, 100)
    }
    
    // 明細
    let yPos = 115
    doc.setFontSize(10)
    doc.text('Description', 20, yPos)
    doc.text('Qty', 120, yPos)
    doc.text('Unit Price', 140, yPos)
    doc.text('Amount', 170, yPos)
    
    yPos += 5
    doc.line(20, yPos, 190, yPos)
    yPos += 5
    
    invoice.items.forEach(item => {
      doc.text(item.description, 20, yPos)
      doc.text(item.quantity.toString(), 120, yPos)
      doc.text(`¥${item.unitPrice.toLocaleString()}`, 140, yPos)
      doc.text(`¥${(item.quantity * item.unitPrice).toLocaleString()}`, 170, yPos)
      yPos += 7
    })
    
    // 合計
    yPos += 10
    doc.line(120, yPos, 190, yPos)
    yPos += 7
    doc.text('Subtotal:', 140, yPos)
    doc.text(`¥${invoice.subtotal.toLocaleString()}`, 170, yPos)
    yPos += 7
    doc.text('Tax (10%):', 140, yPos)
    doc.text(`¥${invoice.tax.toLocaleString()}`, 170, yPos)
    yPos += 7
    doc.setFontSize(12)
    doc.text('Total:', 140, yPos)
    doc.text(`¥${invoice.total.toLocaleString()}`, 170, yPos)
    
    // 備考
    if (invoice.notes) {
      yPos += 20
      doc.setFontSize(10)
      doc.text('Notes:', 20, yPos)
      yPos += 5
      doc.text(invoice.notes, 20, yPos)
    }
    
    // PDFを保存
    doc.save(`invoice_${invoice.invoiceNumber}.pdf`)
  }

  // 小計を計算
  const calculateSubtotal = () => {
    return newInvoice.items.reduce((sum, item) => {
      return sum + (item.quantity * item.unitPrice)
    }, 0)
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">請求書管理画面</h1>
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
            <h1 className="text-3xl font-bold text-gray-900">請求書管理</h1>
            <button
              onClick={() => setShowNewInvoiceForm(!showNewInvoiceForm)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
            >
              新規請求書作成
            </button>
          </div>

          {/* 新規請求書フォーム */}
          {showNewInvoiceForm && (
            <div className="mb-8 p-6 bg-gray-50 rounded-lg">
              <h2 className="text-xl font-bold mb-4">新規請求書</h2>
              <form onSubmit={createInvoice}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      顧客名 *
                    </label>
                    <input
                      type="text"
                      value={newInvoice.clientName}
                      onChange={(e) => setNewInvoice({...newInvoice, clientName: e.target.value})}
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
                      value={newInvoice.clientEmail}
                      onChange={(e) => setNewInvoice({...newInvoice, clientEmail: e.target.value})}
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
                    value={newInvoice.clientAddress}
                    onChange={(e) => setNewInvoice({...newInvoice, clientAddress: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    支払期限
                  </label>
                  <input
                    type="date"
                    value={newInvoice.dueDate}
                    onChange={(e) => setNewInvoice({...newInvoice, dueDate: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>

                {/* 明細項目 */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    明細項目
                  </label>
                  {newInvoice.items.map((item, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="項目名"
                        value={item.description}
                        onChange={(e) => updateInvoiceItem(index, 'description', e.target.value)}
                        className="flex-1 p-2 border border-gray-300 rounded-md"
                        required
                      />
                      <input
                        type="number"
                        placeholder="数量"
                        value={item.quantity}
                        onChange={(e) => updateInvoiceItem(index, 'quantity', parseInt(e.target.value))}
                        className="w-20 p-2 border border-gray-300 rounded-md"
                        min="1"
                        required
                      />
                      <input
                        type="number"
                        placeholder="単価"
                        value={item.unitPrice}
                        onChange={(e) => updateInvoiceItem(index, 'unitPrice', parseInt(e.target.value))}
                        className="w-32 p-2 border border-gray-300 rounded-md"
                        min="0"
                        required
                      />
                      {newInvoice.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeInvoiceItem(index)}
                          className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                        >
                          削除
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addInvoiceItem}
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
                    value={newInvoice.notes}
                    onChange={(e) => setNewInvoice({...newInvoice, notes: e.target.value})}
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
                    {loading ? '作成中...' : '請求書を作成'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewInvoiceForm(false)}
                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition"
                  >
                    キャンセル
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 請求書一覧 */}
          {loading && !showNewInvoiceForm ? (
            <div className="text-center py-8 text-gray-500">読み込み中...</div>
          ) : invoices.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              請求書がありません
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      請求書番号
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      顧客名
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      発行日
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      支払期限
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
                  {invoices.map((invoice) => (
                    <tr key={invoice.id}>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {invoice.invoiceNumber}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                        {invoice.clientName}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                        {format(new Date(invoice.issueDate), 'yyyy/MM/dd', { locale: ja })}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                        {format(new Date(invoice.dueDate), 'yyyy/MM/dd', { locale: ja })}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                        ¥{invoice.total.toLocaleString()}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <select
                          value={invoice.status}
                          onChange={(e) => updateInvoiceStatus(invoice.id, e.target.value)}
                          className={`text-sm rounded-full px-3 py-1 ${
                            invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                            invoice.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                            invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <option value="draft">下書き</option>
                          <option value="sent">送信済み</option>
                          <option value="paid">支払済み</option>
                          <option value="overdue">期限超過</option>
                        </select>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => generatePDF(invoice)}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          PDF出力
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