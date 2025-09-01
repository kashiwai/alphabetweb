# Vercel DNS設定ガイド - alphabet-ai.me

## 現在の状況
- ドメイン: `alphabet-ai.me` (Vercelで管理)
- ネームサーバー: Vercel
- 有効期限: 2026年8月29日

## DNS設定コマンド

### 1. SPFレコード追加
```bash
npx vercel dns add alphabet-ai.me @ TXT "v=spf1 include:amazonses.com ~all"
```

### 2. DKIMレコード追加（Resendから取得後）
```bash
# Resendダッシュボードで alphabet-ai.me を追加すると、3つのCNAMEレコードが表示されます
# 例：
npx vercel dns add alphabet-ai.me resend._domainkey CNAME resend._domainkey.alphabet-ai.me.dkim.amazonses.com
npx vercel dns add alphabet-ai.me resend2._domainkey CNAME resend2._domainkey.alphabet-ai.me.dkim.amazonses.com  
npx vercel dns add alphabet-ai.me resend3._domainkey CNAME resend3._domainkey.alphabet-ai.me.dkim.amazonses.com
```

### 3. MXレコード追加（オプション - メール受信用）
```bash
npx vercel dns add alphabet-ai.me @ MX "10 feedback-smtp.us-east-1.amazonses.com"
```

## 手動設定（Vercelダッシュボード）

1. [Vercel Dashboard](https://vercel.com/dashboard) にアクセス
2. プロジェクトを選択
3. Settings → Domains
4. `alphabet-ai.me` の横の「Manage」をクリック
5. 「DNS Records」タブ
6. 以下のレコードを追加：

### TXTレコード（SPF）
- Name: `@`
- Type: `TXT`
- Value: `v=spf1 include:amazonses.com ~all`

### CNAMEレコード（DKIM）
Resendダッシュボードから取得した値を設定

## Resend側の設定

1. [Resend Domains](https://resend.com/domains) にアクセス
2. 「Add Domain」をクリック
3. `alphabet-ai.me` を入力
4. 表示されるDNSレコードをコピー

## 設定手順

### Step 1: Resendでドメイン追加
```bash
curl -X POST https://api.resend.com/domains \
  -H "Authorization: Bearer re_AwevCnLt_Nx5K13cWfKWupVDBL1ctXJJK" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "alphabet-ai.me"
  }'
```

### Step 2: DNSレコード取得
Resendから返されるレスポンスに含まれるDNSレコードを確認

### Step 3: Vercel CLIで設定
取得したレコードをVercel CLIで追加

### Step 4: 検証
```bash
# DNSレコードの確認
npx vercel dns ls alphabet-ai.me

# Resendで検証
curl -X POST https://api.resend.com/domains/alphabet-ai.me/verify \
  -H "Authorization: Bearer re_AwevCnLt_Nx5K13cWfKWupVDBL1ctXJJK"
```

## メールアドレス設定

検証完了後、以下のメールアドレスが使用可能：

- `noreply@alphabet-ai.me` - 自動送信用
- `info@alphabet-ai.me` - 一般連絡用
- `invoice@alphabet-ai.me` - 請求書送信用
- `support@alphabet-ai.me` - サポート用

## 環境変数更新

`.env.local`:
```env
# 現在
EMAIL_FROM=onboarding@resend.dev

# 検証後
EMAIL_FROM=noreply@alphabet-ai.me
```

## トラブルシューティング

### DNS反映待ち
- 通常15分〜1時間
- 最大48時間かかる場合あり

### 検証失敗時
1. DNSレコードの値を再確認
2. TTLを短く設定（300秒）
3. しばらく待ってから再検証

## 確認コマンド

```bash
# DNSレコード確認
dig TXT alphabet-ai.me
dig CNAME resend._domainkey.alphabet-ai.me

# nslookup
nslookup -type=TXT alphabet-ai.me
```