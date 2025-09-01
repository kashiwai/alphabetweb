# メールシステム設定ガイド

独自ドメインでメールを送受信するための無料・低コストの選択肢：

## 1. Resend (推奨 - 最も簡単)
**無料枠**: 月3,000通まで無料
**設定時間**: 10分

### セットアップ手順:
1. [https://resend.com](https://resend.com) でアカウント作成
2. ドメインを追加（例: alphabet.co.jp）
3. DNSレコードを設定:
   - TXTレコード: `resend._domainkey`
   - MXレコード: `feedback-smtp.resend.com`
4. APIキーを取得

### 環境変数:
```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
EMAIL_FROM=info@alphabet.co.jp
```

## 2. SendGrid
**無料枠**: 月100通まで無料
**設定時間**: 30分

### セットアップ手順:
1. [https://sendgrid.com](https://sendgrid.com) でアカウント作成
2. Sender Authenticationでドメイン認証
3. DNSレコード設定
4. APIキー生成

### 環境変数:
```env
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
EMAIL_FROM=info@alphabet.co.jp
```

## 3. Gmail + 独自ドメイン (Google Workspace)
**料金**: 月680円〜/ユーザー
**メリット**: 受信も可能、プロフェッショナル

### 無料の代替案:
- **Zoho Mail**: 5ユーザーまで無料
- **ImprovMX**: メール転送のみ無料

## 4. SMTP2GO
**無料枠**: 月1,000通まで無料
**設定時間**: 15分

## 実装済みのメール機能

### 1. 請求書送信
```typescript
// /api/email/invoice
POST {
  invoiceId: string,
  to: string,
  subject?: string
}
```

### 2. 見積書送信
```typescript
// /api/email/estimate
POST {
  estimateId: string,
  to: string,
  subject?: string
}
```

### 3. お問い合わせ自動返信
```typescript
// /api/email/contact-reply
POST {
  to: string,
  name: string,
  message: string
}
```

## DNS設定例（Resendの場合）

ドメインプロバイダーの管理画面で以下を設定：

### SPFレコード
```
TXT @ "v=spf1 include:amazonses.com ~all"
```

### DKIMレコード
```
TXT resend._domainkey "p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNA..."
```

### DMARCレコード（オプション）
```
TXT _dmarc "v=DMARC1; p=none; rua=mailto:dmarc@alphabet.co.jp"
```

## 推奨設定

1. **Resend**を使用（最も簡単で無料枠が大きい）
2. **受信用**: ImprovMXで既存メールに転送
3. **将来的に**: Google Workspaceへ移行

## セキュリティベストプラクティス

1. APIキーは環境変数で管理
2. レート制限を実装
3. メール送信ログを記録
4. SPF/DKIM/DMARCを適切に設定
5. バウンス処理を実装