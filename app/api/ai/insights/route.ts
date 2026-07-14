import { NextResponse } from "next/server"
import { authenticatedAI } from "@/lib/api-middleware"
import { generateInsights } from "@/lib/ai/insights"

export const GET = authenticatedAI(async (_req, { userId }) => {
  const insights = await generateInsights(userId)
  return NextResponse.json({ data: insights })
})
