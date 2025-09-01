// メールエイリアス設定
export const emailAliases = {
  info: {
    from: 'info@alphabet-ai.me',
    name: '株式会社ALPHABET',
    replyTo: 'info@alphabet-ai.me',
    description: '一般問い合わせ用'
  },
  ceo: {
    from: 'ceo@alphabet-ai.me', 
    name: 'CEO - 株式会社ALPHABET',
    replyTo: 'ceo@alphabet-ai.me',
    description: 'CEO直通'
  },
  kousuke: {
    from: 'kousuke@alphabet-ai.me',
    name: 'Kousuke - 株式会社ALPHABET',
    replyTo: 'kousuke@alphabet-ai.me',
    description: 'Kousuke様専用'
  },
  invoice: {
    from: 'invoice@alphabet-ai.me',
    name: '株式会社ALPHABET 経理部',
    replyTo: 'info@alphabet-ai.me',
    description: '請求書送信用'
  },
  support: {
    from: 'support@alphabet-ai.me',
    name: '株式会社ALPHABET サポート',
    replyTo: 'support@alphabet-ai.me',
    description: 'サポート用'
  },
  noreply: {
    from: 'noreply@alphabet-ai.me',
    name: '株式会社ALPHABET（自動送信）',
    replyTo: 'info@alphabet-ai.me',
    description: '自動送信専用（返信不可）'
  }
}

// メールアドレスの取得
export function getEmailAlias(type: keyof typeof emailAliases) {
  return emailAliases[type] || emailAliases.noreply
}

// 利用可能なメールアドレス一覧
export function getAvailableEmails() {
  return Object.entries(emailAliases).map(([key, value]) => ({
    key,
    email: value.from,
    name: value.name,
    description: value.description
  }))
}