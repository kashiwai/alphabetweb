import { createClient } from '@libsql/client'

// Turso接続設定
// ローカル開発用とVercel本番用の設定
const getDatabase = () => {
  // Vercel環境の場合
  if (process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN) {
    return createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    })
  }
  
  // ローカル開発の場合（ファイルベースのSQLite）
  return createClient({
    url: 'file:local.db',
  })
}

export const db = getDatabase()

// データベース初期化
export async function initializeDatabase() {
  try {
    // お問い合わせテーブル
    await db.execute(`
      CREATE TABLE IF NOT EXISTS contacts (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        company TEXT,
        message TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        ip_address TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // 請求書テーブル
    await db.execute(`
      CREATE TABLE IF NOT EXISTS invoices (
        id TEXT PRIMARY KEY,
        invoice_number TEXT UNIQUE NOT NULL,
        issue_date TEXT NOT NULL,
        due_date TEXT NOT NULL,
        client_name TEXT NOT NULL,
        client_address TEXT NOT NULL,
        client_email TEXT,
        subtotal INTEGER NOT NULL,
        tax INTEGER NOT NULL,
        total INTEGER NOT NULL,
        notes TEXT,
        status TEXT DEFAULT 'draft',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // 請求書明細テーブル
    await db.execute(`
      CREATE TABLE IF NOT EXISTS invoice_items (
        id TEXT PRIMARY KEY,
        invoice_id TEXT NOT NULL,
        description TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        unit_price INTEGER NOT NULL,
        amount INTEGER NOT NULL,
        FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
      )
    `)

    // 見積書テーブル
    await db.execute(`
      CREATE TABLE IF NOT EXISTS estimates (
        id TEXT PRIMARY KEY,
        estimate_number TEXT UNIQUE NOT NULL,
        issue_date TEXT NOT NULL,
        valid_until TEXT NOT NULL,
        client_name TEXT NOT NULL,
        client_address TEXT NOT NULL,
        client_email TEXT,
        subtotal INTEGER NOT NULL,
        tax INTEGER NOT NULL,
        total INTEGER NOT NULL,
        notes TEXT,
        status TEXT DEFAULT 'draft',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // 見積書明細テーブル
    await db.execute(`
      CREATE TABLE IF NOT EXISTS estimate_items (
        id TEXT PRIMARY KEY,
        estimate_id TEXT NOT NULL,
        description TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        unit_price INTEGER NOT NULL,
        amount INTEGER NOT NULL,
        FOREIGN KEY (estimate_id) REFERENCES estimates(id) ON DELETE CASCADE
      )
    `)

    console.log('Database initialized successfully')
  } catch (error) {
    console.error('Database initialization failed:', error)
  }
}

// Helper functions for contacts
export async function saveContact(data: any) {
  const id = `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  await db.execute({
    sql: `INSERT INTO contacts (id, name, email, company, message, timestamp, ip_address) 
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: [
      id,
      data.name,
      data.email,
      data.company || '未記入',
      data.message,
      data.timestamp,
      data.ipAddress || 'unknown'
    ]
  })
  
  return id
}

export async function getContacts() {
  const result = await db.execute('SELECT * FROM contacts ORDER BY created_at DESC')
  return result.rows
}

// Helper functions for invoices
export async function saveInvoice(invoice: any) {
  // トランザクション開始
  const tx = await db.transaction('write')
  
  try {
    // 請求書本体を保存
    await tx.execute({
      sql: `INSERT INTO invoices (
        id, invoice_number, issue_date, due_date, 
        client_name, client_address, client_email,
        subtotal, tax, total, notes, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        invoice.id,
        invoice.invoiceNumber,
        invoice.issueDate,
        invoice.dueDate,
        invoice.clientName,
        invoice.clientAddress,
        invoice.clientEmail || null,
        invoice.subtotal,
        invoice.tax,
        invoice.total,
        invoice.notes || null,
        invoice.status
      ]
    })
    
    // 明細を保存
    for (const item of invoice.items) {
      await tx.execute({
        sql: `INSERT INTO invoice_items (
          id, invoice_id, description, quantity, unit_price, amount
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        args: [
          item.id,
          invoice.id,
          item.description,
          item.quantity,
          item.unitPrice,
          item.amount
        ]
      })
    }
    
    await tx.commit()
    return invoice.id
  } catch (error) {
    await tx.rollback()
    throw error
  }
}

export async function getInvoices() {
  const invoices = await db.execute(`
    SELECT * FROM invoices 
    ORDER BY created_at DESC
  `)
  
  // 各請求書の明細を取得
  const invoicesWithItems = []
  for (const invoice of invoices.rows) {
    const items = await db.execute({
      sql: 'SELECT * FROM invoice_items WHERE invoice_id = ?',
      args: [invoice.id as string]
    })
    
    // カラム名をキャメルケースに変換
    invoicesWithItems.push({
      id: invoice.id,
      invoiceNumber: invoice.invoice_number,
      issueDate: invoice.issue_date,
      dueDate: invoice.due_date,
      clientName: invoice.client_name,
      clientAddress: invoice.client_address,
      clientEmail: invoice.client_email,
      subtotal: invoice.subtotal,
      tax: invoice.tax,
      total: invoice.total,
      notes: invoice.notes,
      status: invoice.status,
      createdAt: invoice.created_at,
      updatedAt: invoice.updated_at,
      items: items.rows
    })
  }
  
  return invoicesWithItems
}

export async function updateInvoiceStatus(id: string, status: string) {
  await db.execute({
    sql: 'UPDATE invoices SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    args: [status, id]
  })
}

// Helper functions for estimates
export async function saveEstimate(estimate: any) {
  const tx = await db.transaction('write')
  
  try {
    // 見積書本体を保存
    await tx.execute({
      sql: `INSERT INTO estimates (
        id, estimate_number, issue_date, valid_until,
        client_name, client_address, client_email,
        subtotal, tax, total, notes, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        estimate.id,
        estimate.estimateNumber,
        estimate.issueDate,
        estimate.validUntil,
        estimate.clientName,
        estimate.clientAddress,
        estimate.clientEmail || null,
        estimate.subtotal,
        estimate.tax,
        estimate.total,
        estimate.notes || null,
        estimate.status
      ]
    })
    
    // 明細を保存
    for (const item of estimate.items) {
      await tx.execute({
        sql: `INSERT INTO estimate_items (
          id, estimate_id, description, quantity, unit_price, amount
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        args: [
          item.id,
          estimate.id,
          item.description,
          item.quantity,
          item.unitPrice,
          item.amount
        ]
      })
    }
    
    await tx.commit()
    return estimate.id
  } catch (error) {
    await tx.rollback()
    throw error
  }
}

export async function getEstimates() {
  const estimates = await db.execute(`
    SELECT * FROM estimates 
    ORDER BY created_at DESC
  `)
  
  // 各見積書の明細を取得
  const estimatesWithItems = []
  for (const estimate of estimates.rows) {
    const items = await db.execute({
      sql: 'SELECT * FROM estimate_items WHERE estimate_id = ?',
      args: [estimate.id as string]
    })
    
    // カラム名をキャメルケースに変換
    estimatesWithItems.push({
      id: estimate.id,
      estimateNumber: estimate.estimate_number,
      issueDate: estimate.issue_date,
      validUntil: estimate.valid_until,
      clientName: estimate.client_name,
      clientAddress: estimate.client_address,
      clientEmail: estimate.client_email,
      subtotal: estimate.subtotal,
      tax: estimate.tax,
      total: estimate.total,
      notes: estimate.notes,
      status: estimate.status,
      createdAt: estimate.created_at,
      updatedAt: estimate.updated_at,
      items: items.rows
    })
  }
  
  return estimatesWithItems
}

export async function updateEstimateStatus(id: string, status: string) {
  await db.execute({
    sql: 'UPDATE estimates SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    args: [status, id]
  })
}