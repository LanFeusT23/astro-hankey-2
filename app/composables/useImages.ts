import type { AstroImage } from "~/types/image";

export const useImages = () => {
    const images = useState<AstroImage[]>("images", () => []);
    const loading = ref(false);
    const error = ref<string | null>(null);

    const fetchImages = async () => {
        loading.value = true;
        error.value = null;
        try {
            const { getImageRepository } = await import("~/repositories/index");
            const repo = getImageRepository();
            images.value = await repo.getAll();
        } catch (e) {
            error.value = e instanceof Error ? e.message : "Failed to load images";
        } finally {
            loading.value = false;
        }
    };

    const updateImage = async (id: string, updates: Partial<Omit<AstroImage, "id">>) => {
        const { getImageRepository } = await import("~/repositories/index");
        const repo = getImageRepository();
        const updated = await repo.update(id, updates);
        const idx = images.value.findIndex((img) => img.id === id);
        if (idx !== -1) {
            images.value[idx] = updated;
        }
        return updated;
    };

    const createImage = async (image: Omit<AstroImage, "id">) => {
        const { getImageRepository } = await import("~/repositories/index");
        const repo = getImageRepository();
        const created = await repo.create(image);
        images.value.push(created);
        return created;
    };

    const deleteImage = async (id: string) => {
        const { getImageRepository } = await import("~/repositories/index");
        const repo = getImageRepository();
        await repo.delete(id);
        images.value = images.value.filter((img) => img.id !== id);
    };

    return {
        images,
        loading,
        error,
        fetchImages,
        updateImage,
        createImage,
        deleteImage,
    };
};
