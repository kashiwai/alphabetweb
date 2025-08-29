import { NextResponse } from 'next/server'

// お問い合わせデータの型定義
interface ContactData {
  id: string
  name: string
  email: string
  company: string
  message: string
  timestamp: string
  ipAddress?: string
}

// Vercel環境では、実際のデータ保存は外部サービス（Vercel KV、Supabase等）を使用してください
// ここでは、デモ用にメモリ内配列を使用（サーバー再起動でリセットされます）
let contacts: ContactData[] = []

export async function POST(request: Request) {
  try {
    // リクエストボディを取得
    const body = await request.json()
    const { name, email, company, message } = body

    // バリデーション
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: '必須項目が入力されていません' },
        { status: 400 }
      )
    }

    // メールアドレスの簡単なバリデーション
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: '有効なメールアドレスを入力してください' },
        { status: 400 }
      )
    }

    // お問い合わせデータを作成
    const contactData: ContactData = {
      id: `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      email,
      company: company || '未記入',
      message,
      timestamp: new Date().toISOString(),
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown'
    }

    // Vercel環境かどうかを確認
    const isVercel = process.env.VERCEL === '1'
    
    if (isVercel) {
      // Vercel環境の場合
      // オプション1: コンソールログに記録（Vercelのログで確認可能）
      console.log('New contact submission:', JSON.stringify(contactData, null, 2))
      
      // オプション2: 外部サービスに送信（例：Discord Webhook、Slack、Email API等）
      // await sendToExternalService(contactData)
      
      // オプション3: Vercel KVやSupabaseなどのデータベースに保存
      // await saveToDatabase(contactData)
      
      // メモリに保存（一時的）
      contacts.push(contactData)
    } else {
      // ローカル開発環境の場合
      try {
        const { promises: fs } = await import('fs')
        const path = await import('path')
        
        const dataDir = path.join(process.cwd(), 'data')
        const filePath = path.join(dataDir, 'contacts.json')

        // data ディレクトリが存在しない場合は作成
        try {
          await fs.access(dataDir)
        } catch {
          await fs.mkdir(dataDir, { recursive: true })
        }

        // 既存のデータを読み込む
        let localContacts: ContactData[] = []
        try {
          const fileContent = await fs.readFile(filePath, 'utf-8')
          localContacts = JSON.parse(fileContent)
        } catch {
          localContacts = []
        }

        // 新しいお問い合わせを追加
        localContacts.push(contactData)

        // ファイルに保存
        await fs.writeFile(filePath, JSON.stringify(localContacts, null, 2))
        contacts = localContacts
      } catch (error) {
        console.error('Failed to save to file:', error)
        // ファイル保存に失敗してもメモリには保存
        contacts.push(contactData)
      }
    }

    // 成功レスポンスを返す
    return NextResponse.json({
      success: true,
      message: 'お問い合わせを受け付けました。担当者より2営業日以内にご連絡いたします。',
      contactId: contactData.id
    })

  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました。しばらくしてから再度お試しください。' },
      { status: 500 }
    )
  }
}

// お問い合わせ一覧を取得するエンドポイント（管理用）
export async function GET(request: Request) {
  try {
    // 認証チェック（本番環境では適切な認証を実装してください）
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.ADMIN_API_KEY || 'dev-api-key'}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Vercel環境かどうかを確認
    const isVercel = process.env.VERCEL === '1'
    
    if (isVercel) {
      // Vercel環境の場合はメモリから返す
      return NextResponse.json({
        success: true,
        contacts: contacts,
        total: contacts.length,
        note: 'Data is stored temporarily in memory. For production, use a database service.'
      })
    } else {
      // ローカル環境の場合はファイルから読み込む
      try {
        const { promises: fs } = await import('fs')
        const path = await import('path')
        const filePath = path.join(process.cwd(), 'data', 'contacts.json')
        
        const fileContent = await fs.readFile(filePath, 'utf-8')
        const localContacts = JSON.parse(fileContent)
        
        return NextResponse.json({
          success: true,
          contacts: localContacts,
          total: localContacts.length
        })
      } catch {
        return NextResponse.json({
          success: true,
          contacts: [],
          total: 0
        })
      }
    }

  } catch (error) {
    console.error('Error fetching contacts:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}

// Discord Webhookに送信する例（オプション）
async function sendToDiscordWebhook(data: ContactData) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL
  if (!webhookUrl) return

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        embeds: [{
          title: '新しいお問い合わせ',
          color: 0x0099ff,
          fields: [
            { name: 'お名前', value: data.name, inline: true },
            { name: 'メール', value: data.email, inline: true },
            { name: '会社名', value: data.company, inline: true },
            { name: 'メッセージ', value: data.message },
            { name: '送信日時', value: new Date(data.timestamp).toLocaleString('ja-JP') }
          ]
        }]
      })
    })
  } catch (error) {
    console.error('Discord webhook error:', error)
  }
}