import type { AstroImage } from "~/types/image";

export const useImages = () => {
    const images = useState<AstroImage[]>("images", () => []);
    const loading = ref(false);
    const error = ref<string | null>(null);
    const publicConfig = useRuntimeConfig().public;
    const repoType = publicConfig.imageRepository;

    const getRepo = async () => {
        const { getImageRepository } = await import("~/repositories/index");
        return getImageRepository(repoType, {
            appEnv: publicConfig.appEnv,
            firebase: publicConfig.firebase,
        });
    };

    const sortNewestFirst = (allImages: AstroImage[]) =>
        [...allImages].sort((a, b) => b.imageTakenDate.getTime() - a.imageTakenDate.getTime());

    const fetchImages = async () => {
        loading.value = true;
        error.value = null;
        try {
            const repo = await getRepo();
            images.value = sortNewestFirst(await repo.getAll());
        } catch (e) {
            error.value = e instanceof Error ? e.message : "Failed to load images";
        } finally {
            loading.value = false;
        }
    };
    const updateImage = async (id: string, updates: Partial<Omit<AstroImage, "id">>) => {
        const repo = await getRepo();
        const updated = await repo.update(id, updates);
        const idx = images.value.findIndex((img) => img.id === id);
        if (idx !== -1) {
            images.value[idx] = updated;
            images.value = sortNewestFirst(images.value);
        }
        return updated;
    };

    const createImage = async (image: Omit<AstroImage, "id">) => {
        const repo = await getRepo();
        const created = await repo.create(image);
        images.value = sortNewestFirst([...images.value, created]);
        return created;
    };

    const deleteImage = async (id: string) => {
        const repo = await getRepo();
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
