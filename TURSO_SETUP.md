# Turso (SQLite Cloud) セットアップガイド

Tursoは、SQLiteをクラウドで使えるサービスです。Vercelでも動作します。

## 1. Tursoアカウント作成

1. [https://turso.tech](https://turso.tech) にアクセス
2. GitHubアカウントでサインアップ（無料）

## 2. データベース作成

```bash
# Turso CLIをインストール（任意）
curl -sSfL https://get.tur.so/install.sh | bash

# ブラウザでも作成可能
# https://app.turso.tech でデータベースを作成
```

## 3. 接続情報取得

Tursoダッシュボードから：
- Database URL: `libsql://xxx.turso.io`
- Auth Token: `eyJxxx...`

## 4. Vercel環境変数設定

Vercelダッシュボードで以下を設定：

```env
TURSO_DATABASE_URL=libsql://your-database.turso.io
TURSO_AUTH_TOKEN=your-auth-token
```

## 5. ローカル開発

`.env.local`ファイルに追加：

```env
# Turso設定（オプション - ローカルではSQLiteファイルを使用）
TURSO_DATABASE_URL=libsql://your-database.turso.io
TURSO_AUTH_TOKEN=your-auth-token
```

## 6. データベース初期化

デプロイ後、以下のURLにアクセスしてDBを初期化：

```
https://your-app.vercel.app/api/db-init
```

## 無料枠

- 9GB のストレージ
- 500 のデータベース
- 1億行の読み取り/月
- 2500万行の書き込み/月

## メリット

1. **SQLite互換** - 慣れ親しんだSQLite構文
2. **エッジ対応** - 世界中で低レイテンシ
3. **自動バックアップ** - データ保護
4. **無料枠が大きい** - 小規模アプリに最適

## 代替案

予算や要件に応じて：

### Vercel Postgres
- Vercel統合が簡単
- PostgreSQL使用
- 無料枠: 60時間/月

### Supabase
- PostgreSQL
- リアルタイム機能
- 無料枠: 500MB

### PlanetScale
- MySQL互換
- スケーラブル
- 無料枠あり