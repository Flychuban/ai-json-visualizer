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
    const prompt = `Extract and normalize the following information from the text and return it as a JSON object. If any field is not found in the text, set it to null. Handle any typos or variations in the text:

    - fullName (string): Extract the person's full name, correcting any spelling mistakes
    - age (number): Extract the age as a number, handling any typos in the number
    - jobTitle (string): Extract the job title, normalizing common variations and fixing typos
    - company (string): Extract the company name, correcting any spelling mistakes
    - location (string): Extract the location, normalizing city and country names
    - hobbies (array of strings): Extract hobbies as an array, normalizing common variations
    - favouriteColor (must be one of: 'green', 'yellow', 'red'): Extract and normalize to one of these colors, handling variations like 'favorite', 'fav', etc.
    - linkedin (URL): Extract the LinkedIn URL, ensuring it's a valid URL format
    - graduationYear (number): Extract the graduation year as a number, handling any typos
    - favouriteLanguage (string): Extract the programming language, normalizing common variations

    Text to analyze:
    ${text}

    Return ONLY the JSON object, nothing else. Make sure to:
    1. Set any missing fields to null
    2. Correct any typos in the extracted data
    3. Normalize the data to match the expected format
    4. Handle variations in how the information is presented`

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