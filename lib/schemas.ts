import { z } from "zod"

export const extractedDataSchema = z.object({
  fullName: z.string().nullable(),
  age: z.number().nullable(),
  jobTitle: z.string().nullable(),
  company: z.string().nullable(),
  location: z.string().nullable(),
  hobbies: z.array(z.string()).nullable(),
  favouriteColor: z.enum(['green', 'yellow', 'red', 'blue', 'purple', 'orange', 'pink', 'brown', 'gray', 'black', 'white']).nullable(),
  linkedin: z.string().url().nullable(),
  graduationYear: z.number().nullable(),
  favouriteLanguage: z.string().nullable(),
})

export type ExtractedData = z.infer<typeof extractedDataSchema>

export const textExtractionResponseSchema = z.object({
  data: extractedDataSchema,
  error: z.string().optional(),
})

export type TextExtractionResponse = z.infer<typeof textExtractionResponseSchema> 