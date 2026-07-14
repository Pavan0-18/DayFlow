import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { checkRateLimit } from "@/lib/rate-limit"
import { ZodSchema, ZodError } from "zod"

type HandlerContext = {
  userId: string
  params: Record<string, string>
}

type Handler<T = unknown> = (
  req: Request,
  context: HandlerContext
) => Promise<NextResponse>

type HandlerWithBody<T = unknown> = (
  req: Request,
  context: HandlerContext & { body: T }
) => Promise<NextResponse>

export function withAuth(handler: Handler): Handler {
  return async (req, { params }) => {
    try {
      const session = await getServerSession(authOptions)
      if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
      return handler(req, { userId: session.user.id, params: params ?? {} })
    } catch (error) {
      console.error("API Error:", error)
      return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
  }
}

export function withRateLimit(
  handler: Handler,
  type: "regular" | "ai" = "regular"
): Handler {
  return async (req, context) => {
    const rateLimit = await checkRateLimit(context.userId, type)
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: type === "ai" ? "AI rate limit exceeded. Try again tomorrow." : "Too many requests" },
        { status: 429 }
      )
    }
    return handler(req, context)
  }
}

export function withValidation<TInput, TOutput = TInput>(
  schema: ZodSchema<TInput>,
  handler: HandlerWithBody<TOutput>
): Handler {
  return async (req, context) => {
    try {
      const body = await req.json()
      const parsed = schema.safeParse(body)
      if (!parsed.success) {
        return NextResponse.json(
          { error: "Invalid input", details: parsed.error.flatten() },
          { status: 400 }
        )
      }
      return handler(req, { ...context, body: parsed.data as unknown as TOutput })
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
    }
  }
}

export function compose<T = unknown>(
  ...middleware: Array<(handler: Handler) => Handler>
): (handler: Handler) => Handler {
  return (handler: Handler) =>
    middleware.reduceRight((acc, mw) => mw(acc), handler)
}

export const authenticated = compose(withAuth, withRateLimit)
export const authenticatedAI = compose(withAuth, (h) => withRateLimit(h, "ai"))
