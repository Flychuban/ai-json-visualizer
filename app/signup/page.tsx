import type { Metadata } from "next"
import SignupPageClient from "./page-client"

export const metadata: Metadata = {
  title: "Sign Up | JSONonify",
  description: "Create a JSONonify account",
}

export default function SignupPage() {
  return <SignupPageClient />
}
