import { z } from "zod";

export const firebaseTimestampSchema = z
    .union([
        z.date(),
        z.object({
            nanoseconds: z.number(),
            seconds: z.number(),
        }),
    ])
    .transform((ts) =>
        ts instanceof Date ? ts : new Date(ts.seconds * 1000 + ts.nanoseconds / 1e6),
    );

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
    status: z.enum(["draft", "published"]).default("published"),
    subTitle: z.string().optional(),
    thumbnail: z.string(),
    title: z.string(),
});

export type AstroImage = z.infer<typeof astroImageSchema>;
