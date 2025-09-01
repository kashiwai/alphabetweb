# メールエイリアス設定ガイド

## 必要なメールアドレス
- `info@alphabet-ai.me` - 一般問い合わせ
- `ceo@alphabet-ai.me` - CEO用
- `kousuke@alphabet-ai.me` - Kousuke様用

## 設定方法（2つの選択肢）

### オプション1: ImprovMX（無料・推奨）

**メール転送サービス**で、独自ドメインのメールを既存のGmailなどに転送します。

#### 設定手順:

1. **ImprovMXにアクセス**
   - https://improvmx.com
   - 無料アカウント作成

2. **ドメインを追加**
   - `alphabet-ai.me`を入力
   - 転送先メールアドレスを設定

3. **MXレコードを追加**（Vercel DNS）
   ```bash
   # 既存のMXレコードを削除（bounces用）
   # 新しいMXレコードを追加
   npx vercel dns add alphabet-ai.me @ MX "mx1.improvmx.com" 10
   npx vercel dns add alphabet-ai.me @ MX "mx2.improvmx.com" 20
   ```

4. **エイリアス設定**
   - `info@alphabet-ai.me` → `ko.kashiwai@gmail.com`
   - `ceo@alphabet-ai.me` → `ko.kashiwai@gmail.com`
   - `kousuke@alphabet-ai.me` → `[Kousuke様のメール]`

### オプション2: Google Workspace（有料・完全機能）

**月額680円/ユーザー**で、完全なメール機能が使えます。

#### メリット:
- 送受信両方可能
- Googleカレンダー、ドライブ付き
- プロフェッショナル

#### 設定:
1. Google Workspace申込み
2. ドメイン所有権確認
3. MXレコード設定
4. ユーザー作成

## Resend + ImprovMX併用設定

### 現在の状態:
- **送信**: Resend（設定済み✅）
- **受信**: ImprovMX（要設定）

### 設定後の動作:
1. **送信時**: 
   - Resend APIを使用
   - `noreply@alphabet-ai.me`から送信

2. **受信時**:
   - `info@alphabet-ai.me`に届く
   - 自動的に`ko.kashiwai@gmail.com`に転送

## 環境変数設定

`.env.local`に追加:
```env
# メールエイリアス設定
EMAIL_INFO=info@alphabet-ai.me
EMAIL_CEO=ceo@alphabet-ai.me
EMAIL_KOUSUKE=kousuke@alphabet-ai.me

# 転送先（内部用）
FORWARD_TO_INFO=ko.kashiwai@gmail.com
FORWARD_TO_CEO=ko.kashiwai@gmail.com
FORWARD_TO_KOUSUKE=[Kousuke様のメール]
```

## APIエンドポイント更新

`/src/lib/email-config.ts`:
```typescript
export const emailAliases = {
  info: {
    from: 'info@alphabet-ai.me',
    name: '株式会社ALPHABET',
    replyTo: 'info@alphabet-ai.me'
  },
  ceo: {
    from: 'ceo@alphabet-ai.me', 
    name: 'CEO - 株式会社ALPHABET',
    replyTo: 'ceo@alphabet-ai.me'
  },
  kousuke: {
    from: 'kousuke@alphabet-ai.me',
    name: 'Kousuke - 株式会社ALPHABET',
    replyTo: 'kousuke@alphabet-ai.me'
  },
  noreply: {
    from: 'noreply@alphabet-ai.me',
    name: '株式会社ALPHABET（自動送信）',
    replyTo: 'info@alphabet-ai.me'
  }
}
```

## 送信テスト

```bash
# info@から送信
curl -X POST http://localhost:3010/api/email/send \
  -H "Content-Type: application/json" \
  -d '{
    "from": "info@alphabet-ai.me",
    "to": "ko.kashiwai@gmail.com",
    "subject": "info@からのテスト",
    "text": "info@alphabet-ai.meから送信"
  }'

# ceo@から送信
curl -X POST http://localhost:3010/api/email/send \
  -H "Content-Type: application/json" \
  -d '{
    "from": "ceo@alphabet-ai.me",
    "to": "ko.kashiwai@gmail.com",
    "subject": "CEO@からのテスト",
    "text": "ceo@alphabet-ai.meから送信"
  }'
```

## 推奨設定

1. **即座に使いたい場合**: ImprovMX（無料）
2. **完全な機能が必要**: Google Workspace（有料）
3. **現在の設定で十分**: Resendのみ（送信専用）

## 注意事項

- ImprovMXは転送のみ（返信は転送先から）
- Google Workspaceは完全な送受信可能
- Resendの送信制限: 月3,000通（無料枠）