const fetch = require('node-fetch');

const API_URL = 'http://localhost:3002/api';

async function testInvoiceSystem() {
  console.log('🔧 請求書システムのテスト開始...\n');

  try {
    // 1. 請求書作成テスト
    console.log('📝 請求書を作成中...');
    const createResponse = await fetch(`${API_URL}/invoice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clientName: 'テスト株式会社',
        clientAddress: '東京都渋谷区渋谷1-1-1',
        clientEmail: 'test@example.com',
        items: [
          {
            description: 'ウェブサイト制作',
            quantity: 1,
            unitPrice: 500000
          },
          {
            description: 'SEO対策',
            quantity: 3,
            unitPrice: 50000
          }
        ],
        notes: 'テスト請求書です'
      })
    });

    const createResult = await createResponse.json();
    
    if (createResult.success) {
      console.log('✅ 請求書作成成功！');
      console.log('  請求書番号:', createResult.invoice.invoiceNumber);
      console.log('  合計金額:', createResult.invoice.total.toLocaleString(), '円');
      console.log('  ID:', createResult.invoice.id);
    } else {
      console.log('❌ 請求書作成失敗:', createResult.error);
    }

    // 2. 請求書一覧取得テスト
    console.log('\n📋 請求書一覧を取得中...');
    const listResponse = await fetch(`${API_URL}/invoice`);
    const listResult = await listResponse.json();
    
    if (listResult.success) {
      console.log('✅ 請求書一覧取得成功！');
      console.log('  請求書数:', listResult.total);
      
      if (listResult.invoices.length > 0) {
        console.log('\n  最新の請求書:');
        const latest = listResult.invoices[0];
        console.log('    番号:', latest.invoice_number || latest.invoiceNumber);
        console.log('    顧客:', latest.client_name || latest.clientName);
        console.log('    金額:', (latest.total || 0).toLocaleString(), '円');
        console.log('    ステータス:', latest.status);
      }
    } else {
      console.log('❌ 請求書一覧取得失敗:', listResult.error);
    }

    // 3. ステータス更新テスト
    if (createResult.success && createResult.invoice) {
      console.log('\n🔄 請求書ステータスを更新中...');
      const updateResponse = await fetch(`${API_URL}/invoice`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: createResult.invoice.id,
          status: 'sent'
        })
      });

      const updateResult = await updateResponse.json();
      
      if (updateResult.success) {
        console.log('✅ ステータス更新成功！');
      } else {
        console.log('❌ ステータス更新失敗:', updateResult.error);
      }
    }

    console.log('\n✨ 請求書システムテスト完了！');

  } catch (error) {
    console.error('❌ テスト中にエラー発生:', error.message);
  }
}

async function testEstimateSystem() {
  console.log('\n\n🔧 見積書システムのテスト開始...\n');

  try {
    // 1. 見積書作成テスト
    console.log('📝 見積書を作成中...');
    const createResponse = await fetch(`${API_URL}/estimate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clientName: 'サンプル企業',
        clientAddress: '大阪府大阪市北区1-2-3',
        clientEmail: 'sample@example.com',
        items: [
          {
            description: 'コンサルティング',
            quantity: 10,
            unitPrice: 30000
          },
          {
            description: 'システム開発',
            quantity: 1,
            unitPrice: 800000
          }
        ],
        notes: 'テスト見積書です'
      })
    });

    const createResult = await createResponse.json();
    
    if (createResult.success) {
      console.log('✅ 見積書作成成功！');
      console.log('  見積書番号:', createResult.estimate.estimateNumber);
      console.log('  合計金額:', createResult.estimate.total.toLocaleString(), '円');
      console.log('  ID:', createResult.estimate.id);
    } else {
      console.log('❌ 見積書作成失敗:', createResult.error);
    }

    // 2. 見積書一覧取得テスト
    console.log('\n📋 見積書一覧を取得中...');
    const listResponse = await fetch(`${API_URL}/estimate`);
    const listResult = await listResponse.json();
    
    if (listResult.success) {
      console.log('✅ 見積書一覧取得成功！');
      console.log('  見積書数:', listResult.total);
      
      if (listResult.estimates.length > 0) {
        console.log('\n  最新の見積書:');
        const latest = listResult.estimates[0];
        console.log('    番号:', latest.estimate_number || latest.estimateNumber);
        console.log('    顧客:', latest.client_name || latest.clientName);
        console.log('    金額:', (latest.total || 0).toLocaleString(), '円');
        console.log('    ステータス:', latest.status);
      }
    } else {
      console.log('❌ 見積書一覧取得失敗:', listResult.error);
    }

    console.log('\n✨ 見積書システムテスト完了！');

  } catch (error) {
    console.error('❌ テスト中にエラー発生:', error.message);
  }
}

// テスト実行
async function runTests() {
  await testInvoiceSystem();
  await testEstimateSystem();
}

runTests();