import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 DayFlow database seed')
  console.log('ℹ️  New user onboarding is handled at runtime by the onboarding service.')
  console.log('   It creates starter tasks and default settings for each new user.')
  console.log('✅ Seed complete.')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
