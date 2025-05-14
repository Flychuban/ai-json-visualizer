import { redirect } from "next/navigation"

export default function Home() {
  // In a real app, you'd check auth status here
  // For demo purposes, we'll redirect to login
  redirect("/login")
}
