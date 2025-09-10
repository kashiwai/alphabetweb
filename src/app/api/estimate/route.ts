import { NextResponse } from 'next/server'
import { db, saveEstimate, getEstimates, updateEstimateStatus } from '@/lib/db'

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

// 見積書一覧取得
export async function GET(request: Request) {
  try {
    const estimates = await getEstimates()
    
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

    // 現在の見積書数を取得して番号を生成
    const existingEstimates = await getEstimates()
    const estimateCount = existingEstimates.length + 1
    const estimateNumber = `EST-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(estimateCount).padStart(4, '0')}`

    // 見積書データを作成
    const estimate: EstimateData = {
      id: `estimate_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      estimateNumber,
      issueDate: new Date().toISOString(),
      validUntil: validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
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

    // データベースに保存
    await saveEstimate(estimate)

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

// 見積書更新
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, status } = body

    if (!id || !status) {
      return NextResponse.json(
        { error: '必須パラメータが不足しています' },
        { status: 400 }
      )
    }

    await updateEstimateStatus(id, status)

    return NextResponse.json({
      success: true,
      message: '見積書のステータスを更新しました'
    })

  } catch (error) {
    console.error('Estimate update error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}