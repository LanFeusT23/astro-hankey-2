import { z } from "zod";

export const firebaseTimestampSchema = z
  .object({
    nanoseconds: z.number(),
    seconds: z.number(),
  })
  .transform((ts) => new Date(ts.seconds * 1000 + ts.nanoseconds / 1e6));

export const astroImageSchema = z.object({
  id: z.string(),
  dateCreated: firebaseTimestampSchema,
  dontContainImage: z.boolean().default(false),
  imageTakenDate: firebaseTimestampSchema,
  images: z.array(
    z.object({
      cloudLocation: z.string(),
      isMain: z.boolean(),
    }),
  ),
  location: z.string(),
  subtitle: z.string().optional(),
  thumbnailUrl: z.string().optional(),
  title: z.string(),
});

export type AstroImage = z.infer<typeof astroImageSchema>;
