"use client"

import * as React from "react"
import { Upload, X } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import posthog from "posthog-js"

export function FileUploader() {
  const [isDragging, setIsDragging] = React.useState(false)
  const [file, setFile] = React.useState<File | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile.type === "text/plain") {
        setFile(droppedFile)
        posthog.capture("file_uploaded", {
          method: "drag_and_drop",
          file_name: droppedFile.name,
          file_size: droppedFile.size,
        })
        // Dispatch event when file is dropped
        const event = new CustomEvent("fileSelected", {
          detail: { fileName: droppedFile.name }
        })
        window.dispatchEvent(event)
      } else {
        posthog.capture("file_upload_error", {
          error: "invalid_file_type",
          file_type: droppedFile.type,
        })
        toast({
          title: "Invalid file type",
          description: "Please upload a .txt file",
          variant: "destructive",
        })
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)
      posthog.capture("file_uploaded", {
        method: "file_input",
        file_name: selectedFile.name,
        file_size: selectedFile.size,
      })
      // Dispatch event when file is selected
      const event = new CustomEvent("fileSelected", {
        detail: { fileName: selectedFile.name }
      })
      window.dispatchEvent(event)
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveFile = () => {
    if (file) {
      posthog.capture("file_removed", {
        file_name: file.name,
        file_size: file.size,
      })
    }
    setFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    // Dispatch event when file is removed
    const event = new CustomEvent("fileSelected", {
      detail: { fileName: null }
    })
    window.dispatchEvent(event)
  }

  const handleProcessFile = async () => {
    if (!file) return

    setIsLoading(true)
    posthog.capture("file_processing_started", {
      file_name: file.name,
      file_size: file.size,
    })

    try {
      // Read the file content
      const text = await file.text()

      // Make the API request
      const response = await fetch("/api/extract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) {
        throw new Error("Failed to process file")
      }

      // Get the response as a stream
      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error("No reader available")
      }

      let result = ""
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        // Convert the Uint8Array to a string
        const chunk = new TextDecoder().decode(value)
        result += chunk

        try {
          // Try to parse the accumulated result as JSON
          const jsonData = JSON.parse(result)
          posthog.capture("file_processed_successfully", {
            file_name: file.name,
            file_size: file.size,
            data_size: JSON.stringify(jsonData).length,
          })
          // Dispatch event with the parsed data
          const event = new CustomEvent("fileProcessed", {
            detail: {
              data: jsonData,
              fileName: file.name,
              fileSize: file.size,
            },
          })
          window.dispatchEvent(event)
        } catch (e) {
          // If parsing fails, continue accumulating chunks
          continue
        }
      }

      toast({
        title: "File processed successfully",
        description: `Extracted data from ${file.name}`,
      })
    } catch (error) {
      console.error("Error processing file:", error)
      posthog.capture("file_processing_error", {
        file_name: file.name,
        file_size: file.size,
        error: error instanceof Error ? error.message : "Unknown error",
      })
      toast({
        title: "Error processing file",
        description: "There was an error processing your file. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="overflow-hidden border-green-100 shadow-md transition-all hover:shadow-lg">
        <CardHeader className="border-b bg-white">
          <CardTitle>Upload Text File</CardTitle>
          <CardDescription>Drag and drop a .txt file or click to browse</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <motion.div
            className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center transition-all ${
              isDragging
                ? "border-green-500 bg-green-50"
                : "border-gray-300 hover:border-green-400 hover:bg-green-50/50"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            {file ? (
              <motion.div
                className="flex w-full flex-col items-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <motion.div
                  className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100"
                  animate={{ rotate: [0, 10, 0] }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  <Upload className="h-6 w-6 text-green-600" />
                </motion.div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{file.name}</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleRemoveFile}>
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove file</span>
                  </Button>
                </div>
                <span className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</span>
              </motion.div>
            ) : (
              <>
                <motion.div
                  className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-white"
                  animate={{ y: [0, -5, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                    ease: "easeInOut",
                  }}
                >
                  <Upload className="h-6 w-6" />
                </motion.div>
                <p className="mb-2 text-sm font-medium">
                  <span className="font-semibold text-green-600">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">.txt files only</p>
              </>
            )}
            <input ref={fileInputRef} type="file" accept=".txt" className="hidden" onChange={handleFileChange} />
            {!file && (
              <Button
                variant="ghost"
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                onClick={handleButtonClick}
              >
                Upload
              </Button>
            )}
          </motion.div>
        </CardContent>
        <CardFooter className="flex justify-end border-t bg-white px-6 py-4">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleProcessFile}
              disabled={!file || isLoading}
              className="bg-green-600 text-white shadow-md transition-all hover:bg-green-700 hover:shadow-lg"
            >
              {isLoading ? (
                <>
                  <svg
                    className="mr-2 h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "Process File"
              )}
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
