'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'

interface InvoiceItem {
  id?: string
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
  status: string
}

interface Props {
  invoice: Invoice
  onClose: () => void
  onSave: (invoice: Invoice) => void
}

export default function InvoiceEditModal({ invoice, onClose, onSave }: Props) {
  const [editedInvoice, setEditedInvoice] = useState<Invoice>(invoice)
  const [loading, setLoading] = useState(false)

  // 項目を追加
  const addItem = () => {
    setEditedInvoice({
      ...editedInvoice,
      items: [...editedInvoice.items, { description: '', quantity: 1, unitPrice: 0 }]
    })
  }

  // 項目を削除
  const removeItem = (index: number) => {
    if (editedInvoice.items.length > 1) {
      setEditedInvoice({
        ...editedInvoice,
        items: editedInvoice.items.filter((_, i) => i !== index)
      })
    }
  }

  // 項目を更新
  const updateItem = (index: number, field: string, value: any) => {
    const updatedItems = [...editedInvoice.items]
    updatedItems[index] = { ...updatedItems[index], [field]: value }
    
    // 金額を自動計算
    if (field === 'quantity' || field === 'unitPrice') {
      updatedItems[index].amount = updatedItems[index].quantity * updatedItems[index].unitPrice
    }
    
    // 小計、税、合計を再計算
    const subtotal = updatedItems.reduce((sum, item) => {
      return sum + (item.quantity * item.unitPrice)
    }, 0)
    const tax = Math.round(subtotal * 0.1)
    const total = subtotal + tax
    
    setEditedInvoice({
      ...editedInvoice,
      items: updatedItems,
      subtotal,
      tax,
      total
    })
  }

  // 保存処理
  const handleSave = async () => {
    setLoading(true)
    try {
      // APIを呼び出して更新
      const response = await fetch('/api/invoice', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_API_KEY || 'dev-api-key'}`
        },
        body: JSON.stringify(editedInvoice)
      })

      if (response.ok) {
        onSave(editedInvoice)
        onClose()
      } else {
        alert('更新に失敗しました')
      }
    } catch (error) {
      console.error('Update error:', error)
      alert('エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 my-8 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              請求書編集: {editedInvoice.invoiceNumber}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 基本情報 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                顧客名
              </label>
              <input
                type="text"
                value={editedInvoice.clientName}
                onChange={(e) => setEditedInvoice({...editedInvoice, clientName: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                メールアドレス
              </label>
              <input
                type="email"
                value={editedInvoice.clientEmail || ''}
                onChange={(e) => setEditedInvoice({...editedInvoice, clientEmail: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                住所
              </label>
              <input
                type="text"
                value={editedInvoice.clientAddress}
                onChange={(e) => setEditedInvoice({...editedInvoice, clientAddress: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                支払期限
              </label>
              <input
                type="date"
                value={format(new Date(editedInvoice.dueDate), 'yyyy-MM-dd')}
                onChange={(e) => setEditedInvoice({...editedInvoice, dueDate: new Date(e.target.value).toISOString()})}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* 明細項目 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              明細項目
            </label>
            <div className="space-y-2">
              {editedInvoice.items.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="項目名"
                    value={item.description}
                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="number"
                    placeholder="数量"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                    className="w-20 p-2 border border-gray-300 rounded-md"
                    min="1"
                  />
                  <input
                    type="number"
                    placeholder="単価"
                    value={item.unitPrice}
                    onChange={(e) => updateItem(index, 'unitPrice', parseInt(e.target.value) || 0)}
                    className="w-28 p-2 border border-gray-300 rounded-md"
                    min="0"
                  />
                  <div className="w-28 p-2 bg-gray-100 rounded-md text-right">
                    ¥{((item.quantity || 0) * (item.unitPrice || 0)).toLocaleString()}
                  </div>
                  {editedInvoice.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      削除
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addItem}
              className="mt-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              項目を追加
            </button>
          </div>

          {/* 合計 */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-end space-x-8">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">小計:</span>
                  <span className="ml-8">¥{editedInvoice.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">消費税 (10%):</span>
                  <span className="ml-8">¥{editedInvoice.tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>合計:</span>
                  <span className="ml-8">¥{editedInvoice.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 備考 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              備考
            </label>
            <textarea
              value={editedInvoice.notes || ''}
              onChange={(e) => setEditedInvoice({...editedInvoice, notes: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={3}
            />
          </div>

          {/* ステータス */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ステータス
            </label>
            <select
              value={editedInvoice.status}
              onChange={(e) => setEditedInvoice({...editedInvoice, status: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="draft">下書き</option>
              <option value="sent">送信済み</option>
              <option value="paid">支払済み</option>
              <option value="overdue">期限超過</option>
            </select>
          </div>

          {/* アクションボタン */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              キャンセル
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? '保存中...' : '保存'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}