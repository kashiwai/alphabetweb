const { createClient } = require('@libsql/client');
require('dotenv').config();

async function createTestEstimate() {
  console.log('📝 テスト見積書を直接データベースに作成...\n');
  
  try {
    const db = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
    
    const estimateId = `estimate_${Date.now()}`;
    const estimateNumber = `EST-2025-01-0001`;
    
    // 見積書本体を作成
    await db.execute({
      sql: `INSERT INTO estimates (
        id, estimate_number, issue_date, valid_until,
        client_name, client_address, client_email,
        subtotal, tax, total, notes, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        estimateId,
        estimateNumber,
        new Date().toISOString(),
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        'サンプル企業',
        '大阪府大阪市1-2-3',
        'sample@example.com',
        800000,
        80000,
        880000,
        'テスト見積書',
        'draft'
      ]
    });
    
    console.log('✅ 見積書作成成功！');
    console.log('  ID:', estimateId);
    console.log('  番号:', estimateNumber);
    
    // 明細を追加
    await db.execute({
      sql: `INSERT INTO estimate_items (
        id, estimate_id, description, quantity, unit_price, amount
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      args: [
        `item_${Date.now()}_1`,
        estimateId,
        'コンサルティング',
        10,
        30000,
        300000
      ]
    });
    
    await db.execute({
      sql: `INSERT INTO estimate_items (
        id, estimate_id, description, quantity, unit_price, amount
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      args: [
        `item_${Date.now()}_2`,
        estimateId,
        'システム開発',
        1,
        500000,
        500000
      ]
    });
    
    console.log('✅ 明細追加成功！');
    
    // 確認
    const estimates = await db.execute('SELECT * FROM estimates');
    console.log('\n📊 現在の見積書数:', estimates.rows.length);
    
    const items = await db.execute('SELECT * FROM estimate_items');
    console.log('📊 現在の明細数:', items.rows.length);
    
    // 最新の見積書を表示
    console.log('\n最新の見積書:');
    const latest = estimates.rows[estimates.rows.length - 1];
    console.log('  番号:', latest.estimate_number);
    console.log('  顧客:', latest.client_name);
    console.log('  合計:', Number(latest.total).toLocaleString(), '円');
    
  } catch (error) {
    console.error('❌ エラー:', error);
  }
}

createTestEstimate();