import { NextResponse } from "next/server"
import { authenticatedAI } from "@/lib/api-middleware"
import { generateTaskSuggestions } from "@/lib/ai/suggestions"

export const POST = authenticatedAI(async (_req, { userId }) => {
  const suggestions = await generateTaskSuggestions(userId)
  return NextResponse.json({ data: suggestions })
})
