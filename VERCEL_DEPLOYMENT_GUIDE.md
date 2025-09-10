# Vercelデプロイメント設定ガイド

## 必要な環境変数

Vercelダッシュボードで以下の環境変数を設定してください：

### 1. Tursoデータベース設定
```
TURSO_DATABASE_URL=libsql://alphabet-kashiwai.aws-us-east-1.turso.io
TURSO_AUTH_TOKEN=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NTc0NzA2NTQsImlkIjoiNTNhMDQ5Y2MtNWJhZS00ODQ5LTliYzYtZTIyMDEzNjdmZjVmIiwicmlkIjoiY2U2ZmVlOTEtY2UyZi00YTk1LTgxZWYtODQwYWM4OTQ3M2JiIn0.tB55ALJuE1c8fjv31KC3t335zerpwAVcKO22RmDGXEMTzbwwJ6L2wlf7dTxSiuK0EB1395_INT4vmfAkuoWjDw
```

### 2. 管理画面用APIキー（任意に変更可能）
```
ADMIN_API_KEY=your-secure-api-key-here
NEXT_PUBLIC_ADMIN_API_KEY=your-secure-api-key-here
```

### 3. メール設定（既存）
```
RESEND_API_KEY=（既存の値）
SENDMAIL_TO_EMAIL=（既存の値）
SENDMAIL_FROM_EMAIL=（既存の値）
```

## デプロイ手順

1. **Vercel環境変数設定**
   - https://vercel.com/dashboard でプロジェクトを選択
   - Settings → Environment Variables
   - 上記の環境変数を追加

2. **データベース初期化**
   - デプロイ完了後、以下のURLにアクセス：
   ```
   https://your-domain.vercel.app/api/db-init
   ```

3. **動作確認**
   - 管理画面: `/admin/invoices` で請求書管理
   - 管理画面: `/admin/estimates` で見積書管理

## 機能

### 実装済み機能
- ✅ Tursoデータベース接続
- ✅ 請求書の作成・一覧表示・ステータス更新
- ✅ 見積書の作成・一覧表示・ステータス更新
- ✅ PDF生成機能
- ✅ メール送信機能

### データベーステーブル
- `contacts` - お問い合わせ管理
- `invoices` - 請求書
- `invoice_items` - 請求書明細
- `estimates` - 見積書
- `estimate_items` - 見積書明細

## トラブルシューティング

### 401エラーが出る場合
- Tursoの認証トークンが期限切れの可能性
- https://app.turso.tech で新しいトークンを生成
- Vercel環境変数を更新

### データベース初期化エラー
- `/api/db-init` を再度アクセス
- Tursoダッシュボードでデータベース状態を確認

## API エンドポイント

### 請求書
- `GET /api/invoice` - 一覧取得
- `POST /api/invoice` - 新規作成
- `PUT /api/invoice` - ステータス更新

### 見積書
- `GET /api/estimate` - 一覧取得
- `POST /api/estimate` - 新規作成
- `PUT /api/estimate` - ステータス更新