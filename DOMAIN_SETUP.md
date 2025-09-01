# ドメイン設定ガイド - Resend + 独自ドメイン

## 現在の状況
- Resend APIキー: 設定済み ✅
- テストメール送信: 可能 ✅
- 独自ドメイン設定: 未設定 ⏳

## ドメイン設定手順

### Step 1: Resendでドメインを追加

1. [Resend Dashboard](https://resend.com/domains) にアクセス
2. 「Add Domain」をクリック
3. ドメイン名を入力（例: `alphabet.co.jp` または `mail.alphabet.co.jp`）

### Step 2: DNSレコードを設定

Resendが表示するDNSレコードをドメインプロバイダーで設定します。

#### 必要なDNSレコード:

1. **SPFレコード** (TXTレコード)
```
Type: TXT
Name: @ (またはサブドメイン)
Value: v=spf1 include:amazonses.com ~all
```

2. **DKIMレコード** (3つのCNAMEレコード)
```
Type: CNAME
Name: resend._domainkey
Value: resend._domainkey.alphabet.co.jp.dkim.amazonses.com

Type: CNAME  
Name: resend2._domainkey
Value: resend2._domainkey.alphabet.co.jp.dkim.amazonses.com

Type: CNAME
Name: resend3._domainkey
Value: resend3._domainkey.alphabet.co.jp.dkim.amazonses.com
```

3. **MXレコード** (オプション - 受信用)
```
Type: MX
Name: @
Priority: 10
Value: feedback-smtp.us-east-1.amazonses.com
```

### Step 3: ドメインプロバイダー別設定

#### お名前.com の場合:
1. ドメインNaviにログイン
2. 「DNS」→「DNSレコード設定」
3. 上記のレコードを追加

#### Cloudflare の場合:
1. ダッシュボードにログイン
2. 該当ドメインを選択
3. 「DNS」タブで上記レコードを追加
4. CNAMEレコードはプロキシを「DNSのみ」に設定

#### Route53 (AWS) の場合:
1. Route53コンソールにアクセス
2. ホストゾーンを選択
3. 「レコードを作成」で上記を追加

### Step 4: ドメイン検証

1. DNSレコード設定後、Resendダッシュボードに戻る
2. 「Verify DNS Records」をクリック
3. 全てのチェックマークが緑になるまで待つ（最大48時間）

### Step 5: 環境変数を更新

`.env.local`を更新:
```env
# 現在の設定
EMAIL_FROM=onboarding@resend.dev

# ドメイン検証後に変更
EMAIL_FROM=noreply@alphabet.co.jp
# または
EMAIL_FROM=info@alphabet.co.jp
```

## メールアドレス例

### 送信専用アドレス:
- `noreply@alphabet.co.jp` - 自動送信用
- `invoice@alphabet.co.jp` - 請求書送信用
- `support@alphabet.co.jp` - サポート用

### 受信可能アドレス（Google Workspace契約後）:
- `info@alphabet.co.jp` - 一般問い合わせ
- `sales@alphabet.co.jp` - 営業窓口
- `admin@alphabet.co.jp` - 管理者用

## テスト方法

1. **APIテスト:**
```bash
curl http://localhost:3010/api/email/send -X GET
```

2. **ブラウザでテスト:**
```
http://localhost:3010/api/email/send
```

3. **請求書メール送信テスト:**
```bash
curl http://localhost:3010/api/email/send \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "to": "ko.kashiwai@gmail.com",
    "type": "invoice",
    "clientName": "テスト株式会社",
    "invoiceNumber": "INV-2024-0001",
    "total": 100000
  }'
```

## トラブルシューティング

### DNS検証が失敗する場合:
- DNSの反映待ち（最大48時間）
- レコードの値を再確認
- サブドメインを使用してみる（mail.alphabet.co.jp）

### メールが届かない場合:
- SPAMフォルダを確認
- SPF/DKIMレコードを確認
- Resendダッシュボードでログを確認

## 次のステップ

1. ✅ Resend APIキー設定
2. ⏳ 独自ドメインのDNS設定
3. ⏳ メールテンプレートのカスタマイズ
4. ⏳ 請求書・見積書への添付機能
5. ⏳ メール送信ログの実装

## 参考リンク

- [Resend Documentation](https://resend.com/docs)
- [DNS設定ガイド](https://resend.com/docs/dashboard/domains/introduction)
- [日本語ドメインの設定](https://resend.com/docs/dashboard/domains/cloudflare)