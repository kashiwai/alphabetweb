# AlphabetWeb Deployment Guide

## Project Overview
AlphabetWeb is a professional company homepage built with Next.js, featuring:
- Modern responsive design
- Professional company sections (Hero, About, Services, Contact)
- Contact form functionality
- Optimized performance
- Mobile-friendly navigation

## Local Development

### Prerequisites
- Node.js (version 18 or higher)
- npm (comes with Node.js)

### Setup
1. Clone the repository or navigate to the project directory
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```
   The site will be available at `http://localhost:3445`

## Production Deployment

### Build for Production
1. Create optimized production build:
   ```bash
   npm run build
   ```

2. Start production server:
   ```bash
   npm start
   ```
   The site will be available at `http://localhost:3445`

### Deployment Options

#### Option 1: Traditional VPS/Server Deployment
1. Set up a Linux server with Node.js installed
2. Clone or upload the project files
3. Install dependencies: `npm install`
4. Build the project: `npm run build`
5. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start npm --name "alphabetweb" -- start
   ```
6. Set up a reverse proxy with Nginx or Apache
7. Configure SSL certificates

#### Option 2: Vercel Deployment (Recommended)
1. Install Vercel CLI: `npm install -g vercel`
2. Run: `vercel`
3. Follow the prompts to deploy
4. Automatic deployments on git push

#### Option 3: Netlify Deployment
1. Connect your git repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `.next`
4. Deploy

#### Option 4: Docker Deployment
1. Create a Dockerfile:
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   RUN npm run build
   EXPOSE 3000
   CMD ["npm", "start"]
   ```
2. Build and run the Docker container

## Environment Configuration

### Environment Variables
Create a `.env.local` file for environment-specific settings:
```
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_CONTACT_EMAIL=hello@alphabetweb.com
```

### Database Setup (if needed)
If you plan to store contact form submissions:
1. Set up a database (PostgreSQL, MongoDB, etc.)
2. Add database connection environment variables
3. Implement API routes for form handling

## Performance Optimization

The production build includes:
- Static site generation where possible
- Optimized images and assets
- Minified CSS and JavaScript
- Tree-shaking for smaller bundle sizes

## SSL and Security
- Always use HTTPS in production
- Configure security headers
- Set up Content Security Policy (CSP)
- Regular security updates

## Monitoring and Maintenance
- Set up monitoring with tools like Vercel Analytics or Google Analytics
- Monitor server performance and uptime
- Regular dependency updates
- Backup procedures

## Contact Form Integration
To make the contact form functional:
1. Set up an email service (SendGrid, Mailgun, etc.)
2. Create API routes in `src/app/api/contact/route.ts`
3. Add form submission handling
4. Configure email templates

## Domain Configuration
1. Purchase a domain name
2. Configure DNS settings to point to your server
3. Set up SSL certificates
4. Update all references to localhost with your domain

## Support
For technical support or questions about deployment, refer to:
- Next.js Documentation: https://nextjs.org/docs
- Deployment platform documentation
- Project repository issues