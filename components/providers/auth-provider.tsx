"use client"

import { SessionProvider } from "next-auth/react"
import { useSession } from "next-auth/react"
import posthog from "posthog-js"
import { useEffect } from "react"

function PostHogIdentify() {
  const { data: session } = useSession()

  useEffect(() => {
    if (session?.user) {
      posthog.identify(session.user.id, {
        email: session.user.email,
        name: session.user.name,
        image: session.user.image,
      })
    }
  }, [session])

  return null
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <PostHogIdentify />
      {children}
    </SessionProvider>
  )
} 