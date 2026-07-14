import { NextResponse } from "next/server"
import { authenticatedAI } from "@/lib/api-middleware"
import { generateDailyCoaching } from "@/lib/ai/coaching"

export const GET = authenticatedAI(async (_req, { userId }) => {
  const message = await generateDailyCoaching(userId)
  return NextResponse.json({ data: { message } })
})
