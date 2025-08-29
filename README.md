# AlphabetWeb - Professional Company Homepage

A modern, responsive company homepage built with Next.js 15, featuring professional design and optimized performance.

## 🌟 Features

- **Modern Design**: Clean, professional layout with smooth animations
- **Responsive**: Perfect display on desktop, tablet, and mobile devices
- **Performance Optimized**: Fast loading with Next.js optimizations
- **Interactive Contact Form**: Professional contact form with validation
- **SEO Ready**: Optimized for search engines
- **Accessible**: Built with accessibility best practices

## 🏗️ Built With

- **Next.js 15** - React framework for production
- **TypeScript** - Type-safe JavaScript
- **Styled Components** - CSS-in-JS styling
- **React Hooks** - Modern React patterns

## 📱 Sections

1. **Header Navigation** - Smooth scrolling navigation with mobile menu
2. **Hero Section** - Eye-catching banner with call-to-action buttons
3. **About Section** - Company overview with mission, values, and statistics
4. **Services Section** - Comprehensive service offerings with feature cards
5. **Contact Section** - Contact form and company information
6. **Footer** - Additional links and social media

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd alphabetweb
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 📜 Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 🌐 Deployment

### Development Preview
The development server runs on `http://localhost:3000` with hot reload enabled.

### Production Preview
The production server runs on `http://localhost:3001` (configured to avoid port conflicts).

### Deployment Options

1. **Vercel** (Recommended)
   - Connect your repository to Vercel
   - Automatic deployments on git push
   - Built-in CDN and optimizations

2. **Netlify**
   - Connect repository
   - Build command: `npm run build`
   - Publish directory: `.next`

3. **Traditional Server**
   - VPS or dedicated server
   - Use PM2 for process management
   - Nginx for reverse proxy

See `DEPLOYMENT.md` for detailed deployment instructions.

## 🎨 Customization

### Content Updates
- Update company information in each component
- Modify text, images, and contact details
- Customize color scheme in global CSS

### Adding New Sections
1. Create new component in `src/components/`
2. Import and add to `src/app/page.tsx`
3. Update navigation in `Header.tsx`

### Styling
- Global styles: `src/app/globals.css`
- Component styles: Inline styles or styled-components
- Responsive design: CSS Grid and Flexbox

## 📁 Project Structure

```
src/
├── app/
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Homepage
├── components/
│   ├── Header.tsx       # Navigation header
│   ├── Hero.tsx         # Hero section
│   ├── About.tsx        # About section
│   ├── Services.tsx     # Services section
│   ├── Contact.tsx      # Contact section
│   └── Footer.tsx       # Footer
├── next.config.js       # Next.js configuration
├── package.json         # Dependencies and scripts
└── tsconfig.json        # TypeScript configuration
```

## 🔧 Configuration

### Environment Variables
Create `.env.local` for environment-specific settings:
```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_CONTACT_EMAIL=hello@alphabetweb.com
```

### Next.js Configuration
The project uses standard Next.js configuration with App Router enabled.

## 📧 Contact Form

The contact form includes:
- Client-side validation
- Responsive design
- Success/error messaging
- Form reset after submission

To make it fully functional:
1. Set up email service (SendGrid, Mailgun, etc.)
2. Create API route for form handling
3. Add server-side validation

## 🎯 Performance

Production build includes:
- Static site generation
- Image optimization
- Code splitting
- Minification
- Tree shaking

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support or questions:
- Create an issue in the repository
- Contact: hello@alphabetweb.com
- Documentation: See DEPLOYMENT.md for detailed guides

## 🙏 Acknowledgments

- Built with Next.js and React
- Icons and design inspiration from modern web standards
- Responsive design principles from CSS Grid and Flexbox best practices