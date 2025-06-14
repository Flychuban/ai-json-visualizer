import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard-header"
import { FileUploader } from "@/components/file-uploader"
import { JsonViewer } from "@/components/json-viewer"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Upload your text files and extract structured data using our AI-powered JSON converter. View, copy, and download your extracted data in real-time.",
  openGraph: {
    title: "Dashboard | JSONonify",
    description: "Upload your text files and extract structured data using our AI-powered JSON converter. View, copy, and download your extracted data in real-time.",
    images: [
      {
        url: "/dashboard-og.png",
        width: 1200,
        height: 630,
        alt: "JSONonify Dashboard - AI Text Extraction"
      }
    ]
  }
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Text <span className="text-green-700">Extractor</span>
          </h1>
          <p className="text-muted-foreground">Upload a text file to extract structured data</p>
        </div>

        <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-1">
          <FileUploader />
          <JsonViewer />
        </div>
      </main>
    </div>
  )
}
