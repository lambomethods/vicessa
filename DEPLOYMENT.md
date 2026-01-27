# Vicessa - Ready for Vercel Deployment

A Next.js 16 application with authentication, database, and payment integration.

## Tech Stack
- **Framework**: Next.js 16 with TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: Prisma ORM with SQLite (development)
- **Authentication**: NextAuth v5
- **Payments**: Stripe integration
- **UI Components**: Lucide React icons
- **Form Validation**: Zod
- **Email**: Resend

## Getting Started

### Local Development
```bash
npm install
npm run dev
```

### Build & Deploy
```bash
npm run build
npm start
```

## Environment Variables

Create a `.env.local` file with:
```
DATABASE_URL=file:./dev.db
NEXTAUTH_SECRET=<generate-a-secret>
NEXTAUTH_URL=http://localhost:3000
```

For Vercel deployment, add these environment variables in the Vercel dashboard:
- `DATABASE_URL` - Your production database connection
- `NEXTAUTH_SECRET` - Generate with `openssl rand -base64 32`
- `NEXTAUTH_URL` - Your production domain
- Any additional API keys (Stripe, Resend, etc.)

## Vercel Deployment

The project is configured for Vercel deployment:

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel Dashboard
4. Deploy!

## Project Structure
```
├── src/
│   ├── app/           # Next.js app directory
│   ├── components/    # React components
│   ├── lib/          # Utilities and helpers
│   └── server/       # Server-side logic
├── prisma/           # Database schema
├── public/           # Static assets
└── scripts/          # Build and utility scripts
```

## Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Database Migration

For production database changes:
```bash
npx prisma migrate deploy
```

## License
MIT
