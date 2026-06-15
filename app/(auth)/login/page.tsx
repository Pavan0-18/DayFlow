"use client"

import { Suspense, useEffect, useState } from "react"
import { signIn, useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Chrome, Loader2, Shield } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { NySkyline } from "@/components/spider/ny-skyline"
import { SpiderLoader } from "@/components/spider/spider-loader"

const AUTH_ERRORS: Record<string, string> = {
  Configuration: "Suit calibration error. Check your hero credentials.",
  AccessDenied: "Access denied. You may not have the security clearance.",
  Verification: "Your hero token has expired or was already used.",
  OAuthSignin: "Could not establish secure connection. Try again.",
  OAuthCallback: "Hero verification failed. Check your authentication settings.",
  OAuthCreateAccount: "Could not register your hero profile.",
  EmailCreateAccount: "Could not create your hero profile.",
  Callback: "Hero authentication failed. Check command center logs.",
  OAuthAccountNotLinked: "This identity is already linked to another hero profile.",
  SessionRequired: "Please authenticate to access the command center.",
  Default: "Authentication failed. Please try again, hero.",
}

const rainDrops = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  delay: `${Math.random() * 3}s`,
  duration: `${1.5 + Math.random() * 1.5}s`,
}))

function LoginContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"
  const errorCode = searchParams.get("error")
  const errorMessage = errorCode
    ? AUTH_ERRORS[errorCode] ?? AUTH_ERRORS.Default
    : null

  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [showSwingTransition, setShowSwingTransition] = useState(false)

  useEffect(() => {
    if (session) {
      setShowSwingTransition(true)
      setTimeout(() => {
        router.replace(callbackUrl)
      }, 1500)
    }
  }, [session, router, callbackUrl])

  const handleSignIn = async () => {
    setIsAuthenticating(true)
    await signIn("google", { callbackUrl })
  }

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center">
        <SpiderLoader variant="web-spin" label="Accessing Spider-Verse..." />
      </div>
    )
  }

  if (showSwingTransition) {
    return (
      <div className="flex items-center justify-center">
        <SpiderLoader variant="swing" label="Swinging into action..." />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative w-full"
    >
      {/* Web corner decorations */}
      <svg className="pointer-events-none absolute -left-4 -top-4 h-24 w-24 opacity-20" viewBox="0 0 100 100">
        <path d="M0 0 L100 0 L100 20 L20 20 L20 100 L0 100 Z" fill="rgba(255,255,255,0.3)" />
        <path d="M10 10 L90 10 L90 15 L15 15 L15 90 L10 90 Z" fill="rgba(255,255,255,0.1)" />
      </svg>
      <svg className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rotate-90 opacity-20" viewBox="0 0 100 100">
        <path d="M0 0 L100 0 L100 20 L20 20 L20 100 L0 100 Z" fill="rgba(255,255,255,0.3)" />
        <path d="M10 10 L90 10 L90 15 L15 15 L15 90 L10 90 Z" fill="rgba(255,255,255,0.1)" />
      </svg>

      {/* Glass panel */}
      <div className="relative rounded-2xl border border-white/10 bg-[#0F172A]/80 backdrop-blur-xl p-8 shadow-[0_0_50px_rgba(225,29,72,0.1)]">
        {/* Spider logo */}
        <div className="mb-6 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#E11D48] to-[#1D4ED8] shadow-lg"
          >
            <Shield className="h-8 w-8 text-white" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-2xl font-bold text-white"
          >
            Spider-Verse OS
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-1 text-sm text-slate-400"
          >
            Authenticate to access the command center
          </motion.p>
        </div>

        {/* Error */}
        <AnimatePresence>
          {errorMessage && (
            <motion.p
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0 }}
              className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-center text-sm text-red-400"
            >
              {errorMessage}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Sign in button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            className="w-full gap-3 bg-gradient-to-r from-[#E11D48] to-[#1D4ED8] text-white hover:from-[#E11D48] hover:to-[#2563EB] shadow-[0_0_20px_rgba(225,29,72,0.3)] hover:shadow-[0_0_30px_rgba(225,29,72,0.5)] transition-all duration-300 h-12 text-base font-semibold"
            onClick={handleSignIn}
            disabled={isAuthenticating}
          >
            {isAuthenticating ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Chrome className="h-5 w-5" />
            )}
            {isAuthenticating ? "Authenticating..." : "Continue with Google"}
          </Button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-center text-xs text-slate-600"
        >
          By authenticating, you agree to the Hero&apos;s Code of Conduct.
        </motion.p>

        {/* Decorative web line */}
        <div className="mt-6 flex items-center justify-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <span className="text-xs text-slate-600">🕷️</span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
      </div>
    </motion.div>
  )
}

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#020617]">
      {/* NYC Skyline Background */}
      <div className="absolute inset-0">
        <NySkyline variant="night" />
      </div>

      {/* Rain effect */}
      <div className="pointer-events-none fixed inset-0 z-10">
        {rainDrops.map((drop) => (
          <div
            key={drop.id}
            className="rain-drop"
            style={{
              left: drop.left,
              animationDelay: drop.delay,
              animationDuration: drop.duration,
              opacity: 0.15,
            }}
          />
        ))}
      </div>

      {/* Spider-Man silhouette */}
      <div className="pointer-events-none absolute right-[15%] top-[15%] z-20 text-6xl opacity-30 select-none animate-float">
        🕷️
      </div>

      {/* Ambient glow */}
      <div className="pointer-events-none fixed left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E11D48]/5 blur-[100px]" />

      {/* Login form */}
      <div className="relative z-30 w-full max-w-md px-4">
        <Suspense
          fallback={
            <div className="flex items-center justify-center">
              <SpiderLoader variant="web-spin" label="Initializing..." />
            </div>
          }
        >
          <LoginContent />
        </Suspense>
      </div>

      {/* Footer */}
      <p className="relative z-30 mt-8 text-center text-[10px] text-slate-700">
        With great power comes great responsibility.
      </p>
    </div>
  )
}
