import type { AstroImage } from "~/types/image";

export const useGallerySelection = (images: Ref<AstroImage[]>) => {
    const router = useRouter();

    const resolveBySlug = (slug: string): AstroImage | undefined =>
        findImageBySlug(images.value, slug);

    const indexOfSlug = (slug: string) =>
        images.value.findIndex((img) => getImageSlug(img) === slug);

    const navigatePrev = (currentSlug: string) => {
        const idx = indexOfSlug(currentSlug);
        if (idx > 0) {
            const prev = images.value[idx - 1];
            if (prev) {
                router.push(`/gallery/${getImageSlug(prev)}`);
            }
        }
    };

    const navigateNext = (currentSlug: string) => {
        const idx = indexOfSlug(currentSlug);
        if (idx !== -1 && idx < images.value.length - 1) {
            const next = images.value[idx + 1];
            if (next) {
                router.push(`/gallery/${getImageSlug(next)}`);
            }
        }
    };

    const hasPrev = (slug: string) => indexOfSlug(slug) > 0;
    const hasNext = (slug: string) => {
        const idx = indexOfSlug(slug);
        return idx !== -1 && idx < images.value.length - 1;
    };

    return { resolveBySlug, navigatePrev, navigateNext, hasPrev, hasNext };
};
