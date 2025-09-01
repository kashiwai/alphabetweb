import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { to, subject, html, text, type } = body

    // メールテンプレートを作成
    let emailContent = {
      from: process.env.EMAIL_FROM || 'noreply@alphabet-ai.me',
      to: to || 'ko.kashiwai@gmail.com',
      subject: subject || 'テストメール - 株式会社ALPHABET',
      html: html || '<p>テストメールです</p>',
      text: text || 'テストメールです'
    }

    // タイプに応じてテンプレートを選択
    if (type === 'invoice') {
      emailContent = {
        ...emailContent,
        subject: `【請求書】${body.invoiceNumber} - 株式会社ALPHABET`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; color: white;">
              <h1 style="margin: 0;">株式会社ALPHABET</h1>
              <p style="margin: 10px 0 0 0;">AIオーケストレーション開発・コンサルティング</p>
            </div>
            
            <div style="padding: 30px; background: #f7f7f7;">
              <h2 style="color: #333;">請求書のご送付</h2>
              
              <p style="color: #666; line-height: 1.6;">
                ${body.clientName} 様
              </p>
              
              <p style="color: #666; line-height: 1.6;">
                いつもお世話になっております。<br>
                株式会社ALPHABETです。
              </p>
              
              <p style="color: #666; line-height: 1.6;">
                請求書をお送りいたします。<br>
                ご確認のほどよろしくお願いいたします。
              </p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>請求書番号</strong></td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">${body.invoiceNumber}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px;"><strong>請求金額</strong></td>
                    <td style="padding: 10px; font-size: 20px; color: #667eea;">
                      <strong>¥${body.total?.toLocaleString() || '0'}</strong>
                    </td>
                  </tr>
                </table>
              </div>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
                <p style="color: #999; font-size: 12px;">
                  株式会社ALPHABET<br>
                  〒104-0061 東京都中央区銀座1丁目12番4号<br>
                  Web: https://alphabet-ai.vercel.app
                </p>
              </div>
            </div>
          </div>
        `
      }
    }

    // Resendでメール送信
    const data = await resend.emails.send(emailContent)

    return NextResponse.json({ 
      success: true, 
      data,
      message: 'メールを送信しました' 
    })

  } catch (error) {
    console.error('Email send error:', error)
    return NextResponse.json(
      { error: 'メール送信に失敗しました', details: error },
      { status: 500 }
    )
  }
}

// テスト用のGETエンドポイント
export async function GET() {
  try {
    // テストメール送信
    const data = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'noreply@alphabet-ai.me',
      to: 'ko.kashiwai@gmail.com',
      subject: '【株式会社ALPHABET】メールシステム稼働確認',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; color: white; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0;">株式会社ALPHABET</h1>
            <p style="margin: 10px 0 0 0;">AIオーケストレーション開発・コンサルティング</p>
          </div>
          <div style="padding: 30px; background: #f7f7f7;">
            <h2 style="color: #333;">✅ メールシステム稼働確認</h2>
            <p style="color: #666; line-height: 1.6;">
              独自ドメイン（alphabet-ai.me）からのメール送信が正常に動作しています。
            </p>
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #667eea; margin-top: 0;">設定完了項目</h3>
              <ul style="color: #666;">
                <li>✅ 独自ドメイン設定（alphabet-ai.me）</li>
                <li>✅ SPFレコード設定</li>
                <li>✅ DKIMレコード設定</li>
                <li>✅ DMARCレコード設定</li>
                <li>✅ Return-Path設定</li>
              </ul>
            </div>
            <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; border-left: 4px solid #4caf50;">
              <p style="color: #2e7d32; margin: 0;">
                <strong>送信元:</strong> noreply@alphabet-ai.me<br>
                <strong>ステータス:</strong> 正常稼働中
              </p>
            </div>
          </div>
          <div style="padding: 20px; background: #333; color: #999; text-align: center; border-radius: 0 0 10px 10px;">
            <p style="margin: 0; font-size: 12px;">
              株式会社ALPHABET<br>
              〒104-0061 東京都中央区銀座1丁目12番4号<br>
              Web: https://alphabet-ai.me
            </p>
          </div>
        </div>
      `
    })

    return NextResponse.json({ 
      success: true, 
      message: 'テストメールを送信しました',
      data 
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'テストメール送信失敗', details: error },
      { status: 500 }
    )
  }
}