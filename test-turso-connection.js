const { createClient } = require('@libsql/client');
require('dotenv').config();

async function testConnection() {
  console.log('🔍 Turso接続テスト開始...\n');
  
  console.log('環境変数チェック:');
  console.log('DATABASE_URL:', process.env.TURSO_DATABASE_URL ? '✅ 設定済み' : '❌ 未設定');
  console.log('AUTH_TOKEN:', process.env.TURSO_AUTH_TOKEN ? `✅ 設定済み (長さ: ${process.env.TURSO_AUTH_TOKEN.length})` : '❌ 未設定');
  
  if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
    console.log('\n❌ 環境変数が設定されていません！');
    return;
  }
  
  try {
    console.log('\n📡 データベースに接続中...');
    const db = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
    
    // テーブル一覧を取得
    const tables = await db.execute(`
      SELECT name FROM sqlite_master 
      WHERE type='table' 
      ORDER BY name
    `);
    
    console.log('✅ 接続成功！\n');
    console.log('📊 テーブル一覧:');
    tables.rows.forEach(table => {
      console.log(`  - ${table.name}`);
    });
    
    // 各テーブルのレコード数を確認
    console.log('\n📈 データ件数:');
    for (const table of tables.rows) {
      const count = await db.execute(`SELECT COUNT(*) as count FROM ${table.name}`);
      console.log(`  ${table.name}: ${count.rows[0].count} 件`);
    }
    
  } catch (error) {
    console.error('\n❌ エラー:', error.message);
    if (error.message.includes('401')) {
      console.log('\n⚠️  認証エラーです。以下を確認してください:');
      console.log('  1. Tursoダッシュボードで新しいトークンを生成');
      console.log('  2. .envファイルのTURSO_AUTH_TOKENを更新');
      console.log('  3. データベースURLが正しいか確認');
    }
  }
}

testConnection();