"use client"

import * as React from "react"
import { Copy, Download } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion, AnimatePresence } from "framer-motion"
import posthog from "posthog-js"

// Sample extracted data - in a real app, this would come from your API
const sampleData = {
  fullName: "Yavor Belakov",
  age: 25,
  jobTitle: "AI Engineer",
  company: "Team-GPT",
  location: "Berlin, Germany",
  hobbies: ["chess", "hiking", "photography"],
  education: {
    degree: "Master's in Computer Science",
    university: "Technical University of Berlin",
    graduationYear: 2022,
  },
  skills: ["Python", "Machine Learning", "Natural Language Processing", "React"],
  languages: ["English", "German", "Bulgarian"],
  contact: {
    email: "yavor@example.com",
    phone: "+49 123 456 7890",
  },
}

export function JsonViewer() {
  const [data, setData] = React.useState<any>(null)
  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    const handleFileProcessed = (event: CustomEvent) => {
      if (event.detail.data) {
        setData(event.detail.data)
      }
    }

    const handleFileSelected = (event: CustomEvent) => {
      // Reset data when a new file is selected or removed
      setData(null)
    }

    window.addEventListener("fileProcessed", handleFileProcessed as EventListener)
    window.addEventListener("fileSelected", handleFileSelected as EventListener)

    return () => {
      window.removeEventListener("fileProcessed", handleFileProcessed as EventListener)
      window.removeEventListener("fileSelected", handleFileSelected as EventListener)
    }
  }, [])

  const handleCopyJson = () => {
    if (!data) return

    navigator.clipboard.writeText(JSON.stringify(data, null, 2))
    posthog.capture("json_copied", {
      data_size: JSON.stringify(data).length,
    })
    toast({
      title: "Copied to clipboard",
      description: "JSON data has been copied to your clipboard",
    })
  }

  const handleDownloadJson = () => {
    if (!data) return

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "extracted-data.json"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    posthog.capture("json_downloaded", {
      data_size: JSON.stringify(data).length,
    })

    toast({
      title: "Downloaded JSON",
      description: "JSON file has been downloaded",
    })
  }

  // Custom component to render JSON with syntax highlighting
  const JsonDisplay = ({ data }: { data: any }) => {
    if (!data) return null

    const renderJson = (obj: any, level = 0): React.JSX.Element => {
      const indent = "  ".repeat(level)

      if (Array.isArray(obj)) {
        return (
          <div>
            <span className="text-yellow-600">[</span>
            <div className="pl-4">
              {obj.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {renderJson(item, level + 1)}
                  {index < obj.length - 1 && <span className="text-gray-500">,</span>}
                </motion.div>
              ))}
            </div>
            <span>{indent}</span>
            <span className="text-yellow-600">]</span>
          </div>
        )
      } else if (typeof obj === "object" && obj !== null) {
        return (
          <div>
            <span className="text-yellow-600">{"{"}</span>
            <div className="pl-4">
              {Object.entries(obj).map(([key, value], index, array) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <span className="text-green-600">"{key}"</span>
                  <span className="text-gray-500">: </span>
                  {value === null ? (
                    <span className="text-red-500 italic">None</span>
                  ) : (
                    renderJson(value, level + 1)
                  )}
                  {index < array.length - 1 && <span className="text-gray-500">,</span>}
                </motion.div>
              ))}
            </div>
            <span>{indent}</span>
            <span className="text-yellow-600">{"}"}</span>
          </div>
        )
      } else if (typeof obj === "string") {
        return <span className="text-red-600">"{obj}"</span>
      } else if (typeof obj === "number") {
        return <span className="text-blue-600">{obj}</span>
      } else if (typeof obj === "boolean") {
        return <span className="text-purple-600">{String(obj)}</span>
      } else {
        return <span>{String(obj)}</span>
      }
    }

    return <pre className="overflow-auto rounded-md bg-gray-50 p-4 text-sm">{renderJson(data)}</pre>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="mt-8 overflow-hidden border-green-100 shadow-md transition-all hover:shadow-lg">
        <CardHeader className="border-b bg-white">
          <CardTitle>
            <span className="text-green-700">Extracted Data</span>
          </CardTitle>
          <CardDescription>Structured data extracted from your text file</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex h-64 items-center justify-center"
              >
                <motion.div
                  className="h-16 w-16 rounded-full border-4 border-gray-300 border-t-green-600"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                ></motion.div>
              </motion.div>
            ) : data ? (
              <motion.div key="data" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Tabs defaultValue="pretty" className="w-full">
                  <TabsList className="mb-4 bg-gray-100">
                    <TabsTrigger value="pretty" className="data-[state=active]:bg-white">
                      Pretty
                    </TabsTrigger>
                    <TabsTrigger value="raw" className="data-[state=active]:bg-white">
                      Raw
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="pretty" className="mt-0">
                    <JsonDisplay data={data} />
                  </TabsContent>
                  <TabsContent value="raw" className="mt-0">
                    <pre className="overflow-auto rounded-md bg-gray-50 p-4 text-sm">
                      {JSON.stringify(data, null, 2)}
                    </pre>
                  </TabsContent>
                </Tabs>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex h-64 flex-col items-center justify-center text-center text-gray-500"
              >
                <motion.svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mb-4 h-12 w-12 text-green-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </motion.svg>
                <motion.p
                  className="text-lg font-medium"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  No data to display
                </motion.p>
                <motion.p
                  className="max-w-md text-sm"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Upload and process a text file to see the extracted structured data here
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
        {data && (
          <CardFooter className="flex justify-end space-x-2 border-t bg-white px-6 py-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                onClick={handleCopyJson}
                className="border-green-200 hover:bg-green-50 hover:text-green-700"
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy JSON
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button onClick={handleDownloadJson} className="bg-green-600 text-white hover:bg-green-700">
                <Download className="mr-2 h-4 w-4" />
                Download JSON
              </Button>
            </motion.div>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  )
}
