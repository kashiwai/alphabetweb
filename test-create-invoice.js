const { createClient } = require('@libsql/client');
require('dotenv').config();

async function createTestInvoice() {
  console.log('📝 テスト請求書を直接データベースに作成...\n');
  
  try {
    const db = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
    
    const invoiceId = `invoice_${Date.now()}`;
    const invoiceNumber = `INV-2025-01-0001`;
    
    // 請求書本体を作成
    await db.execute({
      sql: `INSERT INTO invoices (
        id, invoice_number, issue_date, due_date, 
        client_name, client_address, client_email,
        subtotal, tax, total, notes, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        invoiceId,
        invoiceNumber,
        new Date().toISOString(),
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        'テスト株式会社',
        '東京都渋谷区1-1-1',
        'test@example.com',
        500000,
        50000,
        550000,
        'テスト請求書',
        'draft'
      ]
    });
    
    console.log('✅ 請求書作成成功！');
    console.log('  ID:', invoiceId);
    console.log('  番号:', invoiceNumber);
    
    // 明細を追加
    await db.execute({
      sql: `INSERT INTO invoice_items (
        id, invoice_id, description, quantity, unit_price, amount
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      args: [
        `item_${Date.now()}`,
        invoiceId,
        'ウェブサイト制作',
        1,
        500000,
        500000
      ]
    });
    
    console.log('✅ 明細追加成功！');
    
    // 確認
    const invoices = await db.execute('SELECT * FROM invoices');
    console.log('\n📊 現在の請求書数:', invoices.rows.length);
    
    const items = await db.execute('SELECT * FROM invoice_items');
    console.log('📊 現在の明細数:', items.rows.length);
    
  } catch (error) {
    console.error('❌ エラー:', error);
  }
}

createTestInvoice();