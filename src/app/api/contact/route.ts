import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

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

    // データ保存先のパスを設定（プロジェクトルートの data フォルダ）
    const dataDir = path.join(process.cwd(), 'data')
    const filePath = path.join(dataDir, 'contacts.json')

    // data ディレクトリが存在しない場合は作成
    try {
      await fs.access(dataDir)
    } catch {
      await fs.mkdir(dataDir, { recursive: true })
    }

    // 既存のデータを読み込む
    let contacts: ContactData[] = []
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8')
      contacts = JSON.parse(fileContent)
    } catch {
      // ファイルが存在しない場合は空の配列から開始
      contacts = []
    }

    // 新しいお問い合わせを追加
    contacts.push(contactData)

    // ファイルに保存
    await fs.writeFile(filePath, JSON.stringify(contacts, null, 2))

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

    const filePath = path.join(process.cwd(), 'data', 'contacts.json')
    
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8')
      const contacts = JSON.parse(fileContent)
      
      return NextResponse.json({
        success: true,
        contacts,
        total: contacts.length
      })
    } catch {
      return NextResponse.json({
        success: true,
        contacts: [],
        total: 0
      })
    }

  } catch (error) {
    console.error('Error fetching contacts:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}