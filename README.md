# 株式会社ALPHABET - AI Orchestra Consulting Website

AIオーケストレーション開発とコンサルティングを提供する株式会社ALPHABETの公式ウェブサイト

## 🚀 Features

- **AIオーケストラ開発サービス** - 複数のAIモデルを統合した革新的なソリューション
- **コスト削減事例** - 従来の開発費用を最大80%削減
- **24時間AIアバター相談** - いつでも無料で相談可能
- **Web完結型お問い合わせフォーム** - メールアプリ不要で送信可能
- **管理画面** - お問い合わせ内容を一元管理

## 🛠 Tech Stack

- **Framework:** Next.js 15.5.0
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **Deployment:** Vercel

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/kashiwai/alphabetweb.git

# Install dependencies
npm install

# Run development server
npm run dev
```

## 🔧 Environment Variables

Create a `.env.local` file:

```env
ADMIN_API_KEY=your-secure-api-key-here
NEXT_PUBLIC_ADMIN_API_KEY=your-secure-api-key-here
```

## 📝 Admin Panel

Access the admin panel to view contact form submissions:

- URL: `/admin/contacts`
- Default Password: `admin123` (change in production)

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project on Vercel
3. Set environment variables
4. Deploy

### Manual Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
src/
├── app/
│   ├── admin/
│   │   └── contacts/     # Admin panel
│   ├── api/
│   │   └── contact/      # Contact form API
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/
│   ├── About.tsx         # About section
│   ├── Contact.tsx       # Contact form
│   ├── Footer.tsx        # Footer
│   ├── Header.tsx        # Navigation
│   ├── Hero.tsx          # Hero section
│   └── Services.tsx      # Services section
```

## 🔒 Security

- Contact form data is stored locally in JSON format
- Admin panel is password protected
- All form submissions are validated
- Data files are excluded from version control

## 📄 License

© 2024 株式会社ALPHABET. All rights reserved.

## 📞 Contact

- **Company:** 株式会社ALPHABET
- **Address:** 〒104-0061 東京都中央区銀座1丁目12番4号
- **Website:** https://alphabet-ai.vercel.app