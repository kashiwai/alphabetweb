import { NextResponse } from 'next/server'

// 請求書データの型定義
export interface InvoiceData {
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

export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  amount: number
}

// メモリ内ストレージ（本番環境では適切なデータベースを使用）
let invoices: InvoiceData[] = []

// 請求書一覧取得
export async function GET(request: Request) {
  try {
    // 認証チェック
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.ADMIN_API_KEY || 'dev-api-key'}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      invoices: invoices,
      total: invoices.length
    })

  } catch (error) {
    console.error('Error fetching invoices:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}

// 請求書作成
export async function POST(request: Request) {
  try {
    // 認証チェック
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.ADMIN_API_KEY || 'dev-api-key'}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { clientName, clientAddress, clientEmail, items, dueDate, notes } = body

    // バリデーション
    if (!clientName || !items || items.length === 0) {
      return NextResponse.json(
        { error: '必須項目が入力されていません' },
        { status: 400 }
      )
    }

    // 小計、税額、合計を計算
    const subtotal = items.reduce((sum: number, item: InvoiceItem) => {
      return sum + (item.quantity * item.unitPrice)
    }, 0)
    const tax = Math.round(subtotal * 0.1) // 10%消費税
    const total = subtotal + tax

    // 請求書番号を生成
    const invoiceNumber = `INV-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(invoices.length + 1).padStart(4, '0')}`

    // 請求書データを作成
    const invoice: InvoiceData = {
      id: `invoice_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      invoiceNumber,
      issueDate: new Date().toISOString(),
      dueDate: dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // デフォルト30日後
      clientName,
      clientAddress,
      clientEmail,
      items: items.map((item: any) => ({
        id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        amount: item.quantity * item.unitPrice
      })),
      subtotal,
      tax,
      total,
      notes,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // 保存
    invoices.push(invoice)

    // Vercel環境の場合はログに記録
    if (process.env.VERCEL === '1') {
      console.log('New invoice created:', JSON.stringify(invoice, null, 2))
    }

    return NextResponse.json({
      success: true,
      message: '請求書を作成しました',
      invoice
    })

  } catch (error) {
    console.error('Invoice creation error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}

// 請求書更新（ステータス変更など）
export async function PUT(request: Request) {
  try {
    // 認証チェック
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.ADMIN_API_KEY || 'dev-api-key'}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { id, status } = body

    const invoiceIndex = invoices.findIndex(inv => inv.id === id)
    if (invoiceIndex === -1) {
      return NextResponse.json(
        { error: '請求書が見つかりません' },
        { status: 404 }
      )
    }

    // ステータス更新
    invoices[invoiceIndex] = {
      ...invoices[invoiceIndex],
      status: status || invoices[invoiceIndex].status,
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      message: '請求書を更新しました',
      invoice: invoices[invoiceIndex]
    })

  } catch (error) {
    console.error('Invoice update error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}