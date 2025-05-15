import type { Metadata } from "next"
import SignupPageClient from "./page-client"

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your JSONonify account to start transforming text into structured JSON data. Free signup with email/password or GitHub OAuth integration.",
  robots: {
    index: false,
    follow: true
  },
  openGraph: {
    title: "Sign Up | JSONonify",
    description: "Create your JSONonify account to start transforming text into structured JSON data. Free signup with email/password or GitHub OAuth integration.",
    images: [
      {
        url: "/signup-og.png",
        width: 1200,
        height: 630,
        alt: "JSONonify Sign Up"
      }
    ]
  }
}

export default function SignupPage() {
  return <SignupPageClient />
}
