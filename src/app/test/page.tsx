export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">システムテストページ</h1>
      
      <div className="space-y-4">
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">環境変数テスト</h2>
          <a href="/api/test-env" className="text-blue-400 hover:underline" target="_blank">
            /api/test-env を確認
          </a>
        </div>
        
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">データベース接続テスト</h2>
          <a href="/api/test-db" className="text-blue-400 hover:underline" target="_blank">
            /api/test-db を確認
          </a>
        </div>
        
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">管理画面</h2>
          <div className="space-y-2">
            <div>
              <a href="/admin/invoices" className="text-blue-400 hover:underline">
                請求書管理
              </a>
            </div>
            <div>
              <a href="/admin/estimates" className="text-blue-400 hover:underline">
                見積書管理
              </a>
            </div>
            <div>
              <a href="/admin/contacts" className="text-blue-400 hover:underline">
                お問い合わせ管理
              </a>
            </div>
          </div>
          <p className="text-sm text-gray-400 mt-2">パスワード: admin123</p>
        </div>
      </div>
    </div>
  )
}