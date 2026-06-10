import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { generateTaskSuggestions } from "@/lib/ai/suggestions"
import { checkRateLimit } from "@/lib/rate-limit"

// POST /api/ai/suggest-tasks - Get AI task suggestions
export async function POST() {
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

    const suggestions = await generateTaskSuggestions(session.user.id)
    return NextResponse.json({ data: suggestions })
  } catch (error) {
    console.error("Error generating task suggestions:", error)
    return NextResponse.json(
      { error: "Failed to generate suggestions" },
      { status: 500 }
    )
  }
}
