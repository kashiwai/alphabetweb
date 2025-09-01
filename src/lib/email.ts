import nodemailer from 'nodemailer'

// メール送信設定（Resendを使用する場合）
const createTransporter = () => {
  // Resend SMTP設定
  if (process.env.RESEND_API_KEY) {
    return nodemailer.createTransport({
      host: 'smtp.resend.com',
      port: 465,
      secure: true,
      auth: {
        user: 'resend',
        pass: process.env.RESEND_API_KEY,
      },
    })
  }

  // SendGrid SMTP設定（代替）
  if (process.env.SENDGRID_API_KEY) {
    return nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY,
      },
    })
  }

  // Gmail SMTP設定（開発用）
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    })
  }

  // フォールバック（コンソール出力のみ）
  return null
}

// メールテンプレート
export const emailTemplates = {
  // 請求書送付テンプレート
  invoice: (data: any) => ({
    subject: `【請求書】${data.invoiceNumber} - 株式会社ALPHABET`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; color: white;">
          <h1 style="margin: 0;">株式会社ALPHABET</h1>
          <p style="margin: 10px 0 0 0;">AIオーケストレーション開発・コンサルティング</p>
        </div>
        
        <div style="padding: 30px; background: #f7f7f7;">
          <h2 style="color: #333;">請求書のご送付</h2>
          
          <p style="color: #666; line-height: 1.6;">
            ${data.clientName} 様
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
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${data.invoiceNumber}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>発行日</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${data.issueDate}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>お支払期限</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${data.dueDate}</td>
              </tr>
              <tr>
                <td style="padding: 10px;"><strong>請求金額</strong></td>
                <td style="padding: 10px; font-size: 20px; color: #667eea;">
                  <strong>¥${data.total.toLocaleString()}</strong>
                </td>
              </tr>
            </table>
          </div>
          
          <p style="color: #666; line-height: 1.6;">
            PDFファイルを添付しておりますので、ご確認ください。
          </p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p style="color: #999; font-size: 12px;">
              株式会社ALPHABET<br>
              〒104-0061 東京都中央区銀座1丁目12番4号<br>
              Web: https://alphabet-ai.vercel.app
            </p>
          </div>
        </div>
      </div>
    `,
    text: `
      ${data.clientName} 様
      
      いつもお世話になっております。
      株式会社ALPHABETです。
      
      請求書をお送りいたします。
      ご確認のほどよろしくお願いいたします。
      
      請求書番号: ${data.invoiceNumber}
      発行日: ${data.issueDate}
      お支払期限: ${data.dueDate}
      請求金額: ¥${data.total.toLocaleString()}
      
      PDFファイルを添付しておりますので、ご確認ください。
      
      ---
      株式会社ALPHABET
      〒104-0061 東京都中央区銀座1丁目12番4号
      Web: https://alphabet-ai.vercel.app
    `
  }),

  // 見積書送付テンプレート
  estimate: (data: any) => ({
    subject: `【お見積書】${data.estimateNumber} - 株式会社ALPHABET`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; color: white;">
          <h1 style="margin: 0;">株式会社ALPHABET</h1>
          <p style="margin: 10px 0 0 0;">AIオーケストレーション開発・コンサルティング</p>
        </div>
        
        <div style="padding: 30px; background: #f7f7f7;">
          <h2 style="color: #333;">お見積書のご送付</h2>
          
          <p style="color: #666; line-height: 1.6;">
            ${data.clientName} 様
          </p>
          
          <p style="color: #666; line-height: 1.6;">
            お問い合わせいただきありがとうございます。<br>
            ご依頼いただきました件につきまして、お見積書をお送りいたします。
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>見積書番号</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${data.estimateNumber}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>発行日</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${data.issueDate}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>有効期限</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${data.validUntil}</td>
              </tr>
              <tr>
                <td style="padding: 10px;"><strong>お見積金額</strong></td>
                <td style="padding: 10px; font-size: 20px; color: #667eea;">
                  <strong>¥${data.total.toLocaleString()}</strong>
                </td>
              </tr>
            </table>
          </div>
          
          <p style="color: #666; line-height: 1.6;">
            詳細はPDFファイルをご確認ください。<br>
            ご不明な点がございましたら、お気軽にお問い合わせください。
          </p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p style="color: #999; font-size: 12px;">
              株式会社ALPHABET<br>
              〒104-0061 東京都中央区銀座1丁目12番4号<br>
              Web: https://alphabet-ai.vercel.app
            </p>
          </div>
        </div>
      </div>
    `,
    text: `
      ${data.clientName} 様
      
      お問い合わせいただきありがとうございます。
      ご依頼いただきました件につきまして、お見積書をお送りいたします。
      
      見積書番号: ${data.estimateNumber}
      発行日: ${data.issueDate}
      有効期限: ${data.validUntil}
      お見積金額: ¥${data.total.toLocaleString()}
      
      詳細はPDFファイルをご確認ください。
      ご不明な点がございましたら、お気軽にお問い合わせください。
      
      ---
      株式会社ALPHABET
      〒104-0061 東京都中央区銀座1丁目12番4号
      Web: https://alphabet-ai.vercel.app
    `
  }),

  // お問い合わせ自動返信テンプレート
  contactReply: (data: any) => ({
    subject: '【株式会社ALPHABET】お問い合わせを受け付けました',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; color: white;">
          <h1 style="margin: 0;">株式会社ALPHABET</h1>
          <p style="margin: 10px 0 0 0;">AIオーケストレーション開発・コンサルティング</p>
        </div>
        
        <div style="padding: 30px; background: #f7f7f7;">
          <h2 style="color: #333;">お問い合わせありがとうございます</h2>
          
          <p style="color: #666; line-height: 1.6;">
            ${data.name} 様
          </p>
          
          <p style="color: #666; line-height: 1.6;">
            この度は株式会社ALPHABETへお問い合わせいただき、誠にありがとうございます。<br>
            以下の内容でお問い合わせを受け付けました。
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">お問い合わせ内容</h3>
            <p style="color: #666; line-height: 1.6; white-space: pre-wrap;">
              ${data.message}
            </p>
          </div>
          
          <p style="color: #666; line-height: 1.6;">
            担当者より2営業日以内にご連絡させていただきます。<br>
            今しばらくお待ちください。
          </p>
          
          <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #856404; margin: 0;">
              <strong>ご注意</strong><br>
              このメールは自動送信されています。<br>
              このメールへの返信はできませんのでご了承ください。
            </p>
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
    `,
    text: `
      ${data.name} 様
      
      この度は株式会社ALPHABETへお問い合わせいただき、誠にありがとうございます。
      以下の内容でお問い合わせを受け付けました。
      
      【お問い合わせ内容】
      ${data.message}
      
      担当者より2営業日以内にご連絡させていただきます。
      今しばらくお待ちください。
      
      ※このメールは自動送信されています。
      このメールへの返信はできませんのでご了承ください。
      
      ---
      株式会社ALPHABET
      〒104-0061 東京都中央区銀座1丁目12番4号
      Web: https://alphabet-ai.vercel.app
    `
  })
}

// メール送信関数
export async function sendEmail({
  to,
  subject,
  html,
  text,
  attachments,
}: {
  to: string
  subject: string
  html: string
  text: string
  attachments?: any[]
}) {
  const transporter = createTransporter()
  
  if (!transporter) {
    console.log('メール設定がありません。コンソールに出力します：')
    console.log('To:', to)
    console.log('Subject:', subject)
    console.log('Text:', text)
    return { success: true, message: 'メール設定なし（コンソール出力）' }
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@alphabet.co.jp',
      to,
      subject,
      text,
      html,
      attachments,
    })

    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('メール送信エラー:', error)
    return { success: false, error: error }
  }
}