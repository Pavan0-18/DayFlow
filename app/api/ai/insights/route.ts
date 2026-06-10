import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { generateInsights } from "@/lib/ai/insights"
import { checkRateLimit } from "@/lib/rate-limit"

// GET /api/ai/insights - Get AI-generated insights
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

    const insights = await generateInsights(session.user.id)
    return NextResponse.json({ data: insights })
  } catch (error) {
    console.error("Error generating AI insights:", error)
    return NextResponse.json(
      { error: "Failed to generate insights" },
      { status: 500 }
    )
  }
}
