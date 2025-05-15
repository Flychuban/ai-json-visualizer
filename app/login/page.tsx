import type { Metadata } from "next"
import LoginPageClient from "./page-client"

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your JSONonify account to start extracting structured data from your text files. Secure login with email/password or GitHub OAuth.",
  robots: {
    index: false,
    follow: true
  },
  openGraph: {
    title: "Login | JSONonify",
    description: "Sign in to your JSONonify account to start extracting structured data from your text files. Secure login with email/password or GitHub OAuth.",
    images: [
      {
        url: "/login-og.png",
        width: 1200,
        height: 630,
        alt: "JSONonify Login"
      }
    ]
  }
}

export default function LoginPage() {
  return <LoginPageClient />
}
