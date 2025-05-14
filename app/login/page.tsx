import type { Metadata } from "next"
import LoginPageClient from "./page-client"

export const metadata: Metadata = {
  title: "Login | JSONonify",
  description: "Login to your JSONonify account",
}

export default function LoginPage() {
  return <LoginPageClient />
}
