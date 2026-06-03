import type { AstroImage } from "~/types/image";

export function getImageSlug(image: AstroImage): string {
    const titleSlug = image.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "");
    const dateSlug = image.imageTakenDate.toISOString().slice(0, 10);
    return `${titleSlug}-${dateSlug}`;
}

export function findImageBySlug(images: AstroImage[], slug: string): AstroImage | undefined {
    return images.find((img) => getImageSlug(img) === slug);
}
