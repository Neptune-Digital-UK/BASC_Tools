# Deployment Guide

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Start production server:**
   ```bash
   npm run start
   ```

## Deployment Options

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect Next.js and configure the build settings
3. The `vercel.json` file is already configured for optimal deployment

### Netlify

1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `.next`
4. Set Node.js version: 18.x

### Docker

Create a `Dockerfile`:

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

### Manual Server Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Copy the `.next` folder and `package.json` to your server

3. Install production dependencies:
   ```bash
   npm ci --only=production
   ```

4. Start the server:
   ```bash
   npm start
   ```

## Environment Variables

Create a `.env.local` file for local development:

```env
NEXT_PUBLIC_APP_NAME="BASC Tools"
NEXT_PUBLIC_APP_VERSION="1.0.0"
```

## Performance Optimization

The application is already optimized with:
- Static generation where possible
- Optimized bundle size (94.5 kB first load)
- Responsive images and fonts
- Efficient CSS with Tailwind

## Monitoring

Consider adding:
- Analytics (Google Analytics, Mixpanel)
- Error tracking (Sentry)
- Performance monitoring (Vercel Analytics)

## Security

- All user inputs are validated client-side
- No sensitive data is stored or transmitted
- HTTPS is recommended for production
