const { createClient } = require('@libsql/client');
require('dotenv').config();

async function testDatabase() {
  console.log('Tursoデータベース接続テスト開始...\n');
  
  try {
    // Turso接続
    const db = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });

    console.log('✅ データベース接続成功');
    console.log('データベースURL:', process.env.TURSO_DATABASE_URL);
    
    // テーブル作成
    console.log('\n📋 テーブル作成中...');
    
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
    `);
    console.log('✅ contactsテーブル作成完了');

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
    `);
    console.log('✅ invoicesテーブル作成完了');

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
    `);
    console.log('✅ invoice_itemsテーブル作成完了');

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
    `);
    console.log('✅ estimatesテーブル作成完了');

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
    `);
    console.log('✅ estimate_itemsテーブル作成完了');
    
    // テーブル一覧確認
    console.log('\n📊 作成されたテーブル一覧:');
    const tables = await db.execute(`
      SELECT name FROM sqlite_master 
      WHERE type='table' 
      ORDER BY name
    `);
    
    tables.rows.forEach(table => {
      console.log(`  - ${table.name}`);
    });
    
    console.log('\n✨ データベース初期化完了！');
    
  } catch (error) {
    console.error('❌ エラー:', error);
  }
}

testDatabase();