"use client"

import { Suspense, useEffect } from "react"
import { signIn, useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Chrome, Loader2 } from "lucide-react"

const AUTH_ERRORS: Record<string, string> = {
  Configuration: "Server configuration error. Check NEXTAUTH_URL and OAuth credentials.",
  AccessDenied: "Access denied. You may not have permission to sign in.",
  Verification: "The sign-in link has expired or was already used.",
  OAuthSignin: "Could not start Google sign-in. Try again.",
  OAuthCallback: "Google sign-in failed. Check database connection and OAuth redirect URIs.",
  OAuthCreateAccount: "Could not create your account. Check database connection.",
  EmailCreateAccount: "Could not create your account.",
  Callback: "Sign-in callback failed. Check server logs.",
  OAuthAccountNotLinked: "This email is already linked to another sign-in method.",
  SessionRequired: "Please sign in to continue.",
  Default: "Sign-in failed. Please try again.",
}

function LoginContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"
  const errorCode = searchParams.get("error")
  const errorMessage = errorCode
    ? AUTH_ERRORS[errorCode] ?? AUTH_ERRORS.Default
    : null

  useEffect(() => {
    if (session) {
      router.replace(callbackUrl)
    }
  }, [session, router, callbackUrl])

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-xl">
          D
        </div>
        <CardTitle className="mt-4 text-2xl">Welcome to DayFlow</CardTitle>
        <CardDescription>
          Sign in to start tracking your daily habits
        </CardDescription>
      </CardHeader>
      <CardContent>
        {errorMessage && (
          <p className="mb-4 rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-center text-sm text-destructive">
            {errorMessage}
          </p>
        )}
        <Button
          variant="outline"
          className="w-full gap-2"
          onClick={() => signIn("google", { callbackUrl })}
        >
          <Chrome className="h-4 w-4" />
          Continue with Google
        </Button>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </CardContent>
    </Card>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  )
}
