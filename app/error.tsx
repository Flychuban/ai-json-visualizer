'use client'

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-dots">
      <div className="text-center space-y-6 p-8 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg max-w-md mx-4">
        <h1 className="text-4xl font-bold text-gray-900">Something went wrong!</h1>
        <p className="text-gray-600">
          We apologize for the inconvenience. Please try again or return to the home page.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button
            onClick={() => reset()}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
          >
            Try again
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-gray-300 hover:bg-gray-100"
          >
            <Link href="/">
              Return Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
} 