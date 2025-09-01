'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Contact {
  id: string
  name: string
  email: string
  company: string
  message: string
  timestamp: string
  ipAddress?: string
}

export default function AdminContacts() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const router = useRouter()

  // ナビゲーションメニュー
  const navigationMenu = (
    <div className="mb-6 flex gap-4">
      <button
        onClick={() => router.push('/admin/contacts')}
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
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
        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
      >
        見積書管理
      </button>
    </div>
  )

  // 簡易認証（本番環境では適切な認証システムを使用してください）
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // パスワード: admin123（本番環境では環境変数を使用）
    if (password === 'admin123') {
      setIsAuthenticated(true)
      fetchContacts()
    } else {
      setError('パスワードが間違っています')
    }
  }

  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/contact', {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_API_KEY || 'dev-api-key'}`
        }
      })

      if (!response.ok) {
        throw new Error('データの取得に失敗しました')
      }

      const data = await response.json()
      setContacts(data.contacts || [])
    } catch (err) {
      setError('お問い合わせデータの取得に失敗しました')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const exportToCSV = () => {
    if (contacts.length === 0) return

    const headers = ['ID', '日時', '名前', 'メールアドレス', '会社名', 'メッセージ']
    const csvContent = [
      headers.join(','),
      ...contacts.map(c => [
        c.id,
        formatDate(c.timestamp),
        `"${c.name}"`,
        c.email,
        `"${c.company}"`,
        `"${c.message.replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n')

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `contacts_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            管理者ログイン
          </h1>
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
              {error}
            </div>
          )}
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                パスワード
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="管理者パスワードを入力"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
            >
              ログイン
            </button>
          </form>
          <p className="mt-4 text-sm text-gray-600 text-center">
            パスワード: admin123（デモ用）
          </p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-indigo-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">データを読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {navigationMenu}
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">お問い合わせ管理</h1>
              <p className="text-gray-600 mt-2">合計 {contacts.length} 件のお問い合わせ</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={exportToCSV}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                disabled={contacts.length === 0}
              >
                CSVエクスポート
              </button>
              <button
                onClick={() => router.push('/')}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
              >
                ホームに戻る
              </button>
            </div>
          </div>
        </div>

        {/* Contacts List */}
        {contacts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-gray-600 text-lg">まだお問い合わせがありません</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      日時
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      名前
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      メールアドレス
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      会社名
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {contacts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map((contact) => (
                    <tr key={contact.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(contact.timestamp)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {contact.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <a href={`mailto:${contact.email}`} className="text-indigo-600 hover:text-indigo-900">
                          {contact.email}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {contact.company || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => setSelectedContact(contact)}
                          className="text-indigo-600 hover:text-indigo-900 font-medium"
                        >
                          詳細を見る
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Contact Detail Modal */}
        {selectedContact && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" onClick={() => setSelectedContact(null)}>
            <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white" onClick={(e) => e.stopPropagation()}>
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900">お問い合わせ詳細</h3>
                <p className="text-sm text-gray-500 mt-1">ID: {selectedContact.id}</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">日時</label>
                  <p className="mt-1 text-sm text-gray-900">{formatDate(selectedContact.timestamp)}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">お名前</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedContact.name}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">メールアドレス</label>
                  <p className="mt-1 text-sm text-gray-900">
                    <a href={`mailto:${selectedContact.email}`} className="text-indigo-600 hover:text-indigo-900">
                      {selectedContact.email}
                    </a>
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">会社名</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedContact.company || '未記入'}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">メッセージ</label>
                  <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">
                    {selectedContact.message}
                  </p>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end gap-3">
                <a
                  href={`mailto:${selectedContact.email}?subject=Re: お問い合わせありがとうございます&body=${encodeURIComponent(`${selectedContact.name} 様\n\nお問い合わせありがとうございます。\n株式会社ALPHABETです。\n\n`)}`}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                >
                  返信する
                </a>
                <button
                  onClick={() => setSelectedContact(null)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200"
                >
                  閉じる
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}