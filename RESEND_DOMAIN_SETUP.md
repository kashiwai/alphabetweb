# Resend + Vercel DNS設定手順

## ✅ 完了項目
1. SPFレコード追加済み
   - `v=spf1 include:amazonses.com ~all`
2. Return-Path（バウンス処理）追加済み
   - `bounces.alphabet-ai.me → feedback-smtp.us-east-1.amazonses.com`

## 📋 次の手順

### 1. Resendダッシュボードでドメイン追加

1. [Resend Domains](https://resend.com/domains) にアクセス
2. 「Add Domain」をクリック
3. `alphabet-ai.me` を入力
4. **Region（地域）を選択**:
   - `US East (N. Virginia)` - 推奨（設定済み）
   - `EU West (Ireland)` - EU向け
   - `South America (São Paulo)` - 南米向け
5. 「Add」をクリック

### 2. 表示されるDNSレコードをコピー

Resendが以下のような3つのCNAMEレコードを表示します：

```
resend._domainkey → xxx.dkim.amazonses.com
resend2._domainkey → xxx.dkim.amazonses.com  
resend3._domainkey → xxx.dkim.amazonses.com
```

### 3. Vercel CLIでDNSレコード追加

Resendから取得した値を使って、以下のコマンドを実行：

```bash
# DKIMレコード（例：実際の値はResendダッシュボードから取得）
npx vercel dns add alphabet-ai.me resend._domainkey CNAME [Resendから取得した値1]
npx vercel dns add alphabet-ai.me resend2._domainkey CNAME [Resendから取得した値2]
npx vercel dns add alphabet-ai.me resend3._domainkey CNAME [Resendから取得した値3]

# Return-Path設定（リージョン別）
# US East (既に設定済み)
# npx vercel dns add alphabet-ai.me bounces CNAME feedback-smtp.us-east-1.amazonses.com

# EU Westを使う場合
# npx vercel dns add alphabet-ai.me bounces CNAME feedback-smtp.eu-west-1.amazonses.com

# South Americaを使う場合
# npx vercel dns add alphabet-ai.me bounces CNAME feedback-smtp.sa-east-1.amazonses.com
```

### 4. Resendでドメイン検証

1. Resendダッシュボードに戻る
2. 「Verify DNS Records」をクリック
3. 全てのチェックが緑になるまで待つ（通常15分〜1時間）

### 5. 環境変数を更新

`.env.local`を編集：
```env
# 変更前
EMAIL_FROM=onboarding@resend.dev

# 変更後
EMAIL_FROM=noreply@alphabet-ai.me
```

### 6. Vercelに環境変数を設定

```bash
# Vercel環境変数設定
npx vercel env add RESEND_API_KEY
npx vercel env add EMAIL_FROM
```

または Vercelダッシュボード:
1. Settings → Environment Variables
2. 以下を追加：
   - `RESEND_API_KEY`: re_AwevCnLt_Nx5K13cWfKWupVDBL1ctXJJK
   - `EMAIL_FROM`: noreply@alphabet-ai.me

## 🔍 確認方法

### DNS確認
```bash
# SPFレコード確認
dig TXT alphabet-ai.me

# Return-Path確認
dig CNAME bounces.alphabet-ai.me

# DKIMレコード確認（設定後）
dig CNAME resend._domainkey.alphabet-ai.me
dig CNAME resend2._domainkey.alphabet-ai.me
dig CNAME resend3._domainkey.alphabet-ai.me
```

### 現在のDNSレコード確認
```bash
npx vercel dns ls alphabet-ai.me
```

### テストメール送信
```bash
# ローカルでテスト
curl http://localhost:3010/api/email/send -X GET

# 本番環境でテスト（デプロイ後）
curl https://alphabet-ai.me/api/email/send -X GET
```

## 📧 使用可能なメールアドレス

ドメイン検証後、以下のアドレスから送信可能：

- `noreply@alphabet-ai.me` - 自動返信用
- `info@alphabet-ai.me` - 一般連絡用
- `invoice@alphabet-ai.me` - 請求書送信用
- `support@alphabet-ai.me` - サポート用
- `admin@alphabet-ai.me` - 管理者用

## ⚠️ 重要な注意事項

1. **APIキー制限**: 現在のAPIキーはメール送信専用です。ドメイン管理にはダッシュボードを使用してください。

2. **DNS反映時間**: 通常15分〜1時間ですが、最大48時間かかる場合があります。

3. **送信制限**: 無料プランでは月3,000通まで。

## 🚀 デプロイ手順

DNS設定完了後：

```bash
# コミット
git add -A
git commit -m "Configure email domain alphabet-ai.me"
git push origin main

# Vercelに再デプロイ
npx vercel --prod
```

## サポート

問題が発生した場合：
1. [Resend Support](https://resend.com/docs)
2. [Vercel DNS Docs](https://vercel.com/docs/projects/domains)