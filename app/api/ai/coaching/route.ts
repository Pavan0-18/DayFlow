import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { generateDailyCoaching } from "@/lib/ai/coaching"
import { checkRateLimit } from "@/lib/rate-limit"

// GET /api/ai/coaching - Get daily coaching message
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Use AI-specific rate limit (60 per day)
    const rateLimit = await checkRateLimit(session.user.id, "ai")
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "AI rate limit exceeded. Try again tomorrow." },
        { status: 429 }
      )
    }

    const message = await generateDailyCoaching(session.user.id)
    return NextResponse.json({ data: { message } })
  } catch (error) {
    console.error("Error generating coaching:", error)
    return NextResponse.json(
      { error: "Failed to generate coaching" },
      { status: 500 }
    )
  }
}
