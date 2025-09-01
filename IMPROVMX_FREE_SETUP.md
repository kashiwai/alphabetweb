# ImprovMX 無料プラン設定ガイド

## 無料プランの制限と機能

### ✅ 無料で使える機能：
- **メール転送**: 無制限
- **エイリアス数**: 無制限
- **ドメイン数**: 1個
- **転送先**: 複数設定可能

### ❌ 有料機能（使わない）：
- SMTP送信（Resendで代替済み）
- カスタムドメイン送信
- 優先サポート

## 設定手順

### Step 1: ImprovMXでドメイン追加

1. https://app.improvmx.com にログイン済み
2. `alphabet-ai.me` を入力して「Add Domain」

### Step 2: DNSレコード設定

ImprovMXが要求する設定：

```bash
# ルートドメイン用MXレコード（メール受信用）
npx vercel dns add alphabet-ai.me @ MX "mx1.improvmx.com" 10
npx vercel dns add alphabet-ai.me @ MX "mx2.improvmx.com" 20

# SPFレコード更新（ImprovMXを追加）
# 既存のSPFレコードを削除して新しいものを追加
npx vercel dns rm rec_64c8605fdfdcf257e198a1ea
npx vercel dns add alphabet-ai.me @ TXT "v=spf1 include:amazonses.com include:spf.improvmx.com ~all"
```

### Step 3: エイリアス設定（ImprovMXダッシュボード）

無料プランで設定可能：

| エイリアス | 転送先 |
|-----------|--------|
| info@ | ko.kashiwai@gmail.com |
| ceo@ | ko.kashiwai@gmail.com |
| kousuke@ | ko.kashiwai@gmail.com |
| * (キャッチオール) | ko.kashiwai@gmail.com |

### Step 4: 現在の構成

```
送信: Resend（設定済み✅）
  └── noreply@alphabet-ai.me
  └── info@alphabet-ai.me
  └── ceo@alphabet-ai.me
  └── kousuke@alphabet-ai.me

受信: ImprovMX（設定中）
  └── info@ → Gmail転送
  └── ceo@ → Gmail転送
  └── kousuke@ → Gmail転送
  └── その他 → Gmail転送

バウンス処理: Amazon SES（設定済み✅）
  └── bounces.alphabet-ai.me
```

## 動作確認

### 1. DNS設定確認
```bash
# MXレコード確認
dig MX alphabet-ai.me

# SPFレコード確認
dig TXT alphabet-ai.me
```

### 2. メール転送テスト
別のメールアドレスから以下に送信：
- info@alphabet-ai.me
- ceo@alphabet-ai.me
- kousuke@alphabet-ai.me

### 3. 送信テスト（Resend経由）
```bash
curl -X POST http://localhost:3010/api/email/send \
  -H "Content-Type: application/json" \
  -d '{
    "from": "info@alphabet-ai.me",
    "to": "test@example.com",
    "subject": "送信テスト",
    "text": "ImprovMX転送とResend送信の組み合わせテスト"
  }'
```

## トラブルシューティング

### MXレコードの競合
- `bounces`サブドメイン: Amazon SES用（そのまま）
- ルートドメイン: ImprovMX用（新規追加）

### SPFレコードの統合
両方のサービスを含める：
```
v=spf1 include:amazonses.com include:spf.improvmx.com ~all
```

### 転送が動かない場合
1. DNS反映待ち（15分〜1時間）
2. ImprovMXダッシュボードで「Verify」
3. エイリアス設定を確認

## 費用
- **ImprovMX**: 無料（転送のみ）
- **Resend**: 無料（月3,000通まで）
- **合計**: 0円/月

## 制限事項
- 送信時の「From」はResend経由
- 返信は転送先（Gmail）から
- SMTPログインは有料プラン必要（不要）