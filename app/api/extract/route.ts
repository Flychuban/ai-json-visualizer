import { NextResponse } from "next/server"
import { streamObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"
import { extractedDataSchema } from "@/lib/schemas"

// This is important! It marks this function as a Serverless Function
export const runtime = "edge"

export async function POST(req: Request) {
  try {
    const { text } = await req.json()

    if (!text) {
      return NextResponse.json(
        { error: "No text provided" },
        { status: 400 }
      )
    }

    // Create a prompt that will help extract structured data
    const prompt = `Extract the following information from the text and return it as a JSON object. If any field is not found in the text, set it to null:
    - fullName (string)
    - age (number)
    - jobTitle (string)
    - company (string)
    - location (string)
    - hobbies (array of strings)
    - favouriteColor (must be one of: 'green', 'yellow', 'red')
    - linkedin (URL)
    - graduationYear (number)
    - favouriteLanguage (string)

    Text to analyze:
    ${text}

    Return ONLY the JSON object, nothing else. Make sure to set any missing fields to null.`

    // Use streamObject to get structured data
    const result = streamObject({
      model: openai("gpt-4"),
      schema: extractedDataSchema,
      prompt,
      onError: (error) => {
        console.error("Error in streamObject:", error)
      },
    })

    // Return the stream
    return result.toTextStreamResponse()
  } catch (error) {
    console.error("Error processing text:", error)
    return NextResponse.json(
      { error: "Error processing text" },
      { status: 500 }
    )
  }
} 