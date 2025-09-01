# Return-Path (Custom Return-Path) 設定ガイド

## Return-Pathとは？
バウンスメール（送信失敗したメール）の返送先を指定する設定です。

## 設定方法

### Step 1: Resendダッシュボードでの設定

1. **Resend Domainsページ**にアクセス
   - https://resend.com/domains

2. **ドメインを追加**
   - 「Add Domain」をクリック
   - `alphabet-ai.me` を入力

3. **詳細設定画面**で以下を入力：
   - **Region**: `US East (N. Virginia)`を選択
   - **Custom Return-Path**: `bounces` と入力
     - 完全なアドレスは `bounces.alphabet-ai.me` になります
     - Resendが自動的にサブドメインを作成

### Step 2: 表示されるDNSレコード

Resendが以下のレコードを表示します：

#### 1. SPFレコード（✅ 設定済み）
```
Type: TXT
Name: @
Value: v=spf1 include:amazonses.com ~all
```

#### 2. DKIMレコード（3つ）
```
Type: CNAME
Name: resend._domainkey
Value: [Resendが生成する値].dkim.amazonses.com

Type: CNAME
Name: resend2._domainkey
Value: [Resendが生成する値].dkim.amazonses.com

Type: CNAME
Name: resend3._domainkey
Value: [Resendが生成する値].dkim.amazonses.com
```

#### 3. Custom Return-Path レコード
```
Type: CNAME
Name: bounces
Value: feedback-smtp.us-east-1.amazonses.com
```

### Step 3: Vercel DNSに追加

#### DKIMレコードを追加
```bash
# Resendから取得した実際の値で実行
npx vercel dns add alphabet-ai.me resend._domainkey CNAME [値1.dkim.amazonses.com]
npx vercel dns add alphabet-ai.me resend2._domainkey CNAME [値2.dkim.amazonses.com]
npx vercel dns add alphabet-ai.me resend3._domainkey CNAME [値3.dkim.amazonses.com]
```

#### Return-Pathレコードを追加
```bash
npx vercel dns add alphabet-ai.me bounces CNAME feedback-smtp.us-east-1.amazonses.com
```

### Step 4: 検証

1. **Resendダッシュボード**で「Verify DNS Records」をクリック
2. 全てのチェックマークが緑になるまで待つ（15分〜1時間）

## なぜReturn-Pathが必要？

1. **バウンス処理**: 送信失敗したメールの情報を受け取る
2. **評判管理**: メール配信の評判を維持
3. **SPF認証**: より信頼性の高いメール送信
4. **デバッグ**: 配信問題の特定が容易

## トラブルシューティング

### エラー: "must start with a letter..."
- サブドメイン名は英字で始まる必要があります
- 使用可能: `bounces`, `return`, `feedback`
- 使用不可: `1bounce`, `_bounce`, `bounce-`

### 検証が失敗する場合
1. DNSの反映を待つ（最大48時間）
2. レコードの値を再確認
3. リージョンが正しいか確認

## 現在の状態

- ✅ SPFレコード: 設定済み
- ⏳ DKIMレコード: Resendから取得待ち
- ⏳ Return-Path: Resendでドメイン追加後に自動設定

## 重要な注意点

**Resendダッシュボードでドメインを追加するまで、Return-PathのCNAMEレコードは追加しないでください。**

Resendが正確な値を提供してから、その値をVercel DNSに追加します。