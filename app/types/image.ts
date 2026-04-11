import { z } from 'zod'

export const AstroImageSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  dateTaken: z.string(),
  thumbnailUrl: z.string().url(),
  fullUrl: z.string().url(),
})

export type AstroImage = z.infer<typeof AstroImageSchema>
