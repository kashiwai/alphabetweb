import { NextResponse } from 'next/server'
import { db, saveInvoice, getInvoices, updateInvoiceStatus } from '@/lib/db'

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

// 請求書一覧取得
export async function GET(request: Request) {
  try {
    const invoices = await getInvoices()
    
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

    // 現在の請求書数を取得して番号を生成
    const existingInvoices = await getInvoices()
    const invoiceCount = existingInvoices.length + 1
    const invoiceNumber = `INV-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(invoiceCount).padStart(4, '0')}`

    // 請求書データを作成
    const invoice: InvoiceData = {
      id: `invoice_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      invoiceNumber,
      issueDate: new Date().toISOString(),
      dueDate: dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
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
    await saveInvoice(invoice)

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

// 請求書更新
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

    await updateInvoiceStatus(id, status)

    return NextResponse.json({
      success: true,
      message: '請求書のステータスを更新しました'
    })

  } catch (error) {
    console.error('Invoice update error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}