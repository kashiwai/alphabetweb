import { NextResponse } from 'next/server'

// 見積書データの型定義
export interface EstimateData {
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

export interface EstimateItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  amount: number
}

// メモリ内ストレージ（本番環境では適切なデータベースを使用）
let estimates: EstimateData[] = []

// 見積書一覧取得
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
      estimates: estimates,
      total: estimates.length
    })

  } catch (error) {
    console.error('Error fetching estimates:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}

// 見積書作成
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
    const { clientName, clientAddress, clientEmail, items, validUntil, notes } = body

    // バリデーション
    if (!clientName || !items || items.length === 0) {
      return NextResponse.json(
        { error: '必須項目が入力されていません' },
        { status: 400 }
      )
    }

    // 小計、税額、合計を計算
    const subtotal = items.reduce((sum: number, item: EstimateItem) => {
      return sum + (item.quantity * item.unitPrice)
    }, 0)
    const tax = Math.round(subtotal * 0.1) // 10%消費税
    const total = subtotal + tax

    // 見積書番号を生成
    const estimateNumber = `EST-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(estimates.length + 1).padStart(4, '0')}`

    // 見積書データを作成
    const estimate: EstimateData = {
      id: `estimate_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      estimateNumber,
      issueDate: new Date().toISOString(),
      validUntil: validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // デフォルト30日後
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
    estimates.push(estimate)

    // Vercel環境の場合はログに記録
    if (process.env.VERCEL === '1') {
      console.log('New estimate created:', JSON.stringify(estimate, null, 2))
    }

    return NextResponse.json({
      success: true,
      message: '見積書を作成しました',
      estimate
    })

  } catch (error) {
    console.error('Estimate creation error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}

// 見積書更新（ステータス変更など）
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

    const estimateIndex = estimates.findIndex(est => est.id === id)
    if (estimateIndex === -1) {
      return NextResponse.json(
        { error: '見積書が見つかりません' },
        { status: 404 }
      )
    }

    // ステータス更新
    estimates[estimateIndex] = {
      ...estimates[estimateIndex],
      status: status || estimates[estimateIndex].status,
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      message: '見積書を更新しました',
      estimate: estimates[estimateIndex]
    })

  } catch (error) {
    console.error('Estimate update error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}

// 見積書から請求書へ変換
export async function POST_CONVERT(request: Request) {
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
    const { estimateId } = body

    const estimate = estimates.find(est => est.id === estimateId)
    if (!estimate) {
      return NextResponse.json(
        { error: '見積書が見つかりません' },
        { status: 404 }
      )
    }

    // 請求書データに変換（APIエンドポイントを呼び出す形で実装）
    const invoiceData = {
      clientName: estimate.clientName,
      clientAddress: estimate.clientAddress,
      clientEmail: estimate.clientEmail,
      items: estimate.items,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      notes: `見積書番号 ${estimate.estimateNumber} から作成`
    }

    return NextResponse.json({
      success: true,
      message: '請求書データを準備しました',
      invoiceData
    })

  } catch (error) {
    console.error('Convert estimate to invoice error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}