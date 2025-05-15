import { z } from "zod"

export const extractedDataSchema = z.object({
  fullName: z.string(),
  age: z.number(),
  jobTitle: z.string(),
  company: z.string(),
  location: z.string(),
  hobbies: z.array(z.string()),
})

export type ExtractedData = z.infer<typeof extractedDataSchema>

export const textExtractionResponseSchema = z.object({
  data: extractedDataSchema,
  error: z.string().optional(),
})

export type TextExtractionResponse = z.infer<typeof textExtractionResponseSchema> 