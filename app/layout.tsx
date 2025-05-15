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
  metadataBase: new URL("https://ai-json-visualizer.vercel.app"),
  title: {
    default: "JSONonify - AI-Powered Text to JSON Converter",
    template: "%s | JSONonify"
  },
  description: "Transform unstructured text into structured JSON data using advanced AI technology. Extract information like names, ages, job titles, and more with high accuracy.",
  keywords: ["AI text extraction", "JSON converter", "text to JSON", "data extraction", "AI data processing", "structured data", "text analysis"],
  authors: [{ name: "JSONonify Team" }],
  creator: "JSONonify",
  publisher: "JSONonify",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://jsononify.com",
    title: "JSONonify - AI-Powered Text to JSON Converter",
    description: "Transform unstructured text into structured JSON data using advanced AI technology. Extract information like names, ages, job titles, and more with high accuracy.",
    siteName: "JSONonify",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "JSONonify - AI-Powered Text to JSON Converter"
      }
    ]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "your-google-site-verification",
  },
  alternates: {
    canonical: "https://jsononify.com",
  }
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