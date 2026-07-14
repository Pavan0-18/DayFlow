import { NextResponse } from "next/server"
import { withAuth, withRateLimit, withValidation } from "@/lib/api-middleware"
import { settingsRepository } from "@/lib/repositories"
import { updateSettingsSchema } from "@/lib/validations/settings.schema"

export const GET = withAuth(withRateLimit(async (_req, { userId }) => {
  const settings = await settingsRepository.findOrCreate(userId)
  return NextResponse.json({ data: settings })
}))

export const PATCH = withAuth(withRateLimit(withValidation(updateSettingsSchema, async (req, { userId, body }) => {
  const settings = await settingsRepository.update(userId, body)
  return NextResponse.json({ data: settings })
})))
