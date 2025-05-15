import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/providers/auth-provider"
import { PostHogProvider } from "@/components/providers/posthog-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "JSONonify",
  description: "Extract structured data from free-form text using AI",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-dots`}>
        <AuthProvider>
          <PostHogProvider>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
              {children}
              <Toaster />
            </ThemeProvider>
          </PostHogProvider>
        </AuthProvider>
      </body>
    </html>
  )
}