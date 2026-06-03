import type { AstroImage } from "~/types/image";

export const useGallerySelection = (images: Ref<AstroImage[]>) => {
    const router = useRouter();

    const resolveById = (id: string): AstroImage | undefined =>
        images.value.find((img) => img.id === id);

    const indexOfId = (id: string) => images.value.findIndex((img) => img.id === id);

    const navigatePrev = (currentId: string) => {
        const idx = indexOfId(currentId);
        if (idx > 0) {
            const prev = images.value[idx - 1];
            if (prev) {
                router.push(`/gallery/${prev.id}`);
            }
        }
    };

    const navigateNext = (currentId: string) => {
        const idx = indexOfId(currentId);
        if (idx !== -1 && idx < images.value.length - 1) {
            const next = images.value[idx + 1];
            if (next) {
                router.push(`/gallery/${next.id}`);
            }
        }
    };

    const hasPrev = (id: string) => indexOfId(id) > 0;
    const hasNext = (id: string) => {
        const idx = indexOfId(id);
        return idx !== -1 && idx < images.value.length - 1;
    };

    return { resolveById, navigatePrev, navigateNext, hasPrev, hasNext };
};
