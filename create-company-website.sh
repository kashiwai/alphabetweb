#!/bin/bash

# 会社HP作成自動化スクリプト
# Usage: ./create-company-website.sh

echo "========================================="
echo "   会社ホームページ作成システム v1.0"
echo "========================================="
echo ""

# 会社情報の入力
echo "【会社情報を入力してください】"
echo ""
read -p "会社名（例: 株式会社ABC）: " COMPANY_NAME
read -p "会社名（英語/ローマ字）: " COMPANY_NAME_EN
read -p "業種（例: ITコンサルティング）: " INDUSTRY
read -p "住所: " ADDRESS
read -p "ドメイン名（例: example.com）: " DOMAIN
read -p "管理者メールアドレス: " ADMIN_EMAIL

# プロジェクト名の生成
PROJECT_NAME=$(echo $COMPANY_NAME_EN | tr '[:upper:]' '[:lower:]' | tr ' ' '-')

echo ""
echo "プロジェクトを作成しています..."

# Next.jsプロジェクトの作成
npx create-next-app@latest $PROJECT_NAME \
  --typescript \
  --tailwind \
  --app \
  --no-src-dir \
  --import-alias "@/*"

cd $PROJECT_NAME

echo "必要なパッケージをインストールしています..."

# 必要なパッケージのインストール
npm install \
  @react-pdf/renderer \
  resend \
  @libsql/client \
  date-fns \
  @sendgrid/mail \
  nodemailer \
  jspdf \
  html2canvas \
  dotenv

# ディレクトリ構造の作成
mkdir -p src/components
mkdir -p src/app/api/contact
mkdir -p src/app/api/invoice
mkdir -p src/app/api/estimate
mkdir -p src/app/api/email
mkdir -p src/app/admin/contacts
mkdir -p src/app/admin/invoices
mkdir -p src/app/admin/estimates
mkdir -p src/lib
mkdir -p public/images

# 環境変数ファイルの作成
cat > .env.local << EOF
# Admin API Key
ADMIN_API_KEY=dev-api-key-$(openssl rand -hex 16)

# Next.js public variables
NEXT_PUBLIC_ADMIN_API_KEY=dev-api-key-$(openssl rand -hex 16)

# Company Information
NEXT_PUBLIC_COMPANY_NAME=$COMPANY_NAME
NEXT_PUBLIC_COMPANY_NAME_EN=$COMPANY_NAME_EN
NEXT_PUBLIC_COMPANY_ADDRESS=$ADDRESS
NEXT_PUBLIC_COMPANY_DOMAIN=$DOMAIN

# Turso Database (Optional)
TURSO_DATABASE_URL=
TURSO_AUTH_TOKEN=

# Resend Email
RESEND_API_KEY=
EMAIL_FROM=noreply@$DOMAIN

# Admin Settings
ADMIN_PASSWORD=admin123
ADMIN_EMAIL=$ADMIN_EMAIL
EOF

# .env.exampleの作成
cp .env.local .env.example

# カスタマイズ設定ファイル
cat > company.config.json << EOF
{
  "company": {
    "name": "$COMPANY_NAME",
    "nameEn": "$COMPANY_NAME_EN",
    "address": "$ADDRESS",
    "domain": "$DOMAIN",
    "industry": "$INDUSTRY"
  },
  "theme": {
    "primaryColor": "#4f46e5",
    "secondaryColor": "#764ba2",
    "accentColor": "#f59e0b"
  },
  "features": {
    "invoice": true,
    "estimate": true,
    "contact": true,
    "emailSystem": true,
    "adminPanel": true
  },
  "emails": [
    "info@$DOMAIN",
    "support@$DOMAIN",
    "admin@$DOMAIN"
  ]
}
EOF

# Gitignoreの更新
cat >> .gitignore << EOF

# Local data
/data
*.db
local.db

# Environment
.env.local
.env

# Company specific
company.config.json
EOF

echo ""
echo "基本構造を作成しています..."

# package.jsonのスクリプト更新
npm pkg set scripts.setup="node scripts/setup.js"
npm pkg set scripts.deploy="vercel --prod"

# READMEの作成
cat > README.md << EOF
# $COMPANY_NAME ウェブサイト

## 概要
$COMPANY_NAME の公式ウェブサイトです。

### 機能
- ✅ レスポンシブデザイン
- ✅ お問い合わせフォーム
- ✅ 請求書・見積書管理システム
- ✅ メール送受信システム
- ✅ 管理画面

## セットアップ

### 1. 環境変数の設定
\`.env.local\`ファイルを編集して必要な情報を入力してください。

### 2. データベースの初期化
\`\`\`bash
npm run setup
\`\`\`

### 3. 開発サーバーの起動
\`\`\`bash
npm run dev
\`\`\`

### 4. 本番環境へのデプロイ
\`\`\`bash
npm run deploy
\`\`\`

## 管理画面
- URL: /admin/*
- パスワード: admin123（変更推奨）

## サポート
- メール: $ADMIN_EMAIL
- ドメイン: $DOMAIN
EOF

# Git初期化
git init
git add -A
git commit -m "Initial setup for $COMPANY_NAME website"

echo ""
echo "========================================="
echo "✅ セットアップ完了！"
echo "========================================="
echo ""
echo "【次のステップ】"
echo ""
echo "1. 環境変数の設定:"
echo "   cd $PROJECT_NAME"
echo "   nano .env.local"
echo ""
echo "2. 必要なサービスの登録:"
echo "   - Turso: https://turso.tech (データベース)"
echo "   - Resend: https://resend.com (メール送信)"
echo "   - ImprovMX: https://improvmx.com (メール受信)"
echo ""
echo "3. 開発サーバーの起動:"
echo "   npm run dev"
echo ""
echo "4. Vercelへのデプロイ:"
echo "   vercel"
echo ""
echo "プロジェクトディレクトリ: $(pwd)"
echo ""