import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-dots">
      <div className="text-center space-y-6 p-8 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg max-w-md mx-4">
        <h1 className="text-6xl font-bold text-gray-900">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700">Page Not Found</h2>
        <p className="text-gray-600">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="pt-4">
          <Button
            asChild
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
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