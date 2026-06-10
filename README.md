




## Quick Start

### Prerequisites

- Node.js 20+
- npm or yarn
- PostgreSQL database (Supabase recommended)

### 1. Clone and Install

```bash
git clone https://github.com/YOUR_USERNAME/dayflow.git
cd dayflow
npm install
```

### 2. Environment Setup

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

Required environment variables:

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret

# Database (Supabase)
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...

# AI (OpenRouter)
OPENROUTER_API_KEY=your-api-key

# Rate Limiting (Upstash)
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=your-token
```

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database (optional)
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Account Setup Guide

### GitHub (5 minutes)

1. Go to [github.com](https://github.com) → "Sign up" → "Continue with Google"
2. Pick a username → Select **Free** plan
3. Click **"New repository"** → Name: `dayflow` → Public → ✅ Add a README → **Create repository**

### Supabase — Database (5 minutes)

1. Go to [supabase.com](https://supabase.com) → "Start your project" → "Continue with GitHub"
2. Click **"New project"** → Name: `dayflow` → Generate + save a strong password → Choose nearest region → **Create project**
3. Go to **Settings → Database → Connection string → URI** → copy as `DATABASE_URL`
4. Change `?pgbouncer=true` version to `DIRECT_URL` (without pgbouncer param)

### Google OAuth (5 minutes)

1. Go to [console.cloud.google.com](https://console.cloud.google.com) → Create project: `DayFlow`
2. **APIs & Services → OAuth consent screen** → External → Fill: App name `DayFlow`, your email → Save
3. **Credentials → Create Credentials → OAuth 2.0 Client ID** → Web application
4. Authorized redirect URIs → Add:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://YOUR-APP.vercel.app/api/auth/callback/google`
5. Copy **Client ID** and **Client Secret**

### Upstash Redis — Rate Limiting (3 minutes)

1. Go to [upstash.com](https://upstash.com) → "Sign up" → "Continue with Google"
2. **Create Database** → Name: `dayflow` → Region: nearest → **Create**
3. Copy **UPSTASH_REDIS_REST_URL** and **UPSTASH_REDIS_REST_TOKEN**

### OpenRouter — AI Features (3 minutes)

1. Go to [openrouter.ai/keys](https://openrouter.ai/keys) → Sign up
2. Create an API key
3. Copy **OPENROUTER_API_KEY**

### Vercel — Deployment (5 minutes)

1. Go to [vercel.com](https://vercel.com) → "Sign up" → "Continue with GitHub"
2. **"Add New Project"** → Import your `dayflow` repository
3. Add all environment variables from `.env.local`
4. Click **Deploy**
5. After deploy succeeds → copy your app URL → update Google OAuth redirect URI

## Project Structure

```
dayflow/
├── app/                    # Next.js App Router
│   ├── (marketing)/        # Landing page
│   ├── (auth)/             # Auth pages (login)
│   ├── (app)/              # Main app pages (dashboard, tasks, etc.)
│   └── api/                # API routes
├── components/             # React components
│   ├── ui/                 # shadcn/ui components
│   ├── layout/             # Layout components
│   ├── atoms/              # Atomic components
│   ├── molecules/          # Molecular components
│   └── organisms/          # Organism components
├── lib/                    # Utility functions
│   ├── repositories/       # Database repositories
│   ├── services/           # Business logic services
│   ├── ai/                 # AI integration
│   └── validations/        # Zod schemas
├── hooks/                  # Custom React hooks
├── types/                  # TypeScript types
└── prisma/                 # Database schema
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript check
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/tasks` | GET, POST | List/create tasks |
| `/api/tasks/[id]` | GET, PATCH, DELETE | Task operations |
| `/api/logs` | GET | Get daily log |
| `/api/logs/toggle` | POST | Toggle task completion |
| `/api/schedule` | GET, POST | Get/create schedule |
| `/api/schedule/auto` | POST | Auto-generate schedule |
| `/api/reports/daily` | GET | Daily report |
| `/api/reports/weekly` | GET | Weekly report |
| `/api/reports/monthly` | GET | Monthly report |
| `/api/reports/streaks` | GET | Streak data |
| `/api/reports/achievements` | GET | User achievements |
| `/api/ai/insights` | GET | AI insights |
| `/api/ai/suggest-tasks` | POST | AI task suggestions |
| `/api/ai/coaching` | GET | AI daily coaching |

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

If you have any questions or issues, please open an issue on GitHub.

---

Built with ❤️ by the DayFlow team.
