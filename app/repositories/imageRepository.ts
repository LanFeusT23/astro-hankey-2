import type { AstroImage } from "~/types/image";

export interface ImageRepository {
    getAll(): Promise<AstroImage[]>;
    getById(id: string): Promise<AstroImage | null>;
    create(image: Omit<AstroImage, "id">): Promise<AstroImage>;
    update(id: string, updates: Partial<Omit<AstroImage, "id">>): Promise<AstroImage>;
    delete(id: string): Promise<void>;
    uploadImage(
        file: File,
        imageTakenDate: Date,
        imageId?: string,
    ): Promise<{ cloudLocation: string; thumbnailUrl: string }>;
}
