#!/bin/bash
set -e

echo "🚀 Setting up DayFlow..."
echo ""

# Check prerequisites
command -v node >/dev/null 2>&1 || { echo "❌ Node.js is required. Install from nodejs.org"; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "❌ npm is required"; exit 1; }

echo "✅ Node.js $(node -v) detected"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Setup environment
if [ ! -f .env.local ]; then
  echo "📝 Creating .env.local from .env.example..."
  cp .env.example .env.local
  echo ""
  echo "⚠️  Please fill in your .env.local file before continuing."
  echo "   Open .env.local and add your credentials from:"
  echo "   - Supabase (DATABASE_URL, DIRECT_URL)"
  echo "   - Google Cloud Console (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET)"
  echo "   - Upstash (UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN)"
  echo "   - OpenRouter (OPENROUTER_API_KEY)"
  echo ""
  echo "   Then run: npm run setup:db"
  echo ""
else
  echo "✅ .env.local already exists"
fi

echo "✅ Setup complete! Next steps:"
echo "   1. Fill in .env.local"
echo "   2. Run: npx prisma migrate dev"
echo "   3. Run: npm run db:seed"
echo "   4. Run: npm run dev"
echo "   5. Open: http://localhost:3000"
