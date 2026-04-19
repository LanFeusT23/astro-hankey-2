import type { ImageRepository } from "./imageRepository";
import type { AstroImage } from "~/types/image";

const STUB_IMAGES: AstroImage[] = [
    {
        id: "1",
        title: "Andromeda Galaxy (M31)",
        subTitle:
            "The Andromeda Galaxy, our nearest spiral galaxy neighbor, captured over 4 hours of integration time.",
        location: "Rural Colorado",
        dateCreated: new Date("2024-09-15"),
        imageTakenDate: new Date("2024-09-15"),
        dontContainImage: false,
        thumbnail: "https://picsum.photos/seed/andromeda/600/400",
        images: [{ cloudLocation: "https://picsum.photos/seed/andromeda/1920/1280", isMain: true }],
    },
    {
        id: "2",
        title: "Orion Nebula (M42)",
        subTitle:
            "The Great Orion Nebula, a stellar nursery 1,344 light-years away. Reveals intricate dust lanes and the Trapezium cluster.",
        location: "Dark Sky Site, Arizona",
        dateCreated: new Date("2024-11-20"),
        imageTakenDate: new Date("2024-11-20"),
        dontContainImage: false,
        thumbnail: "https://picsum.photos/seed/orion/600/400",
        images: [{ cloudLocation: "https://picsum.photos/seed/orion/1920/1280", isMain: true }],
    },
    {
        id: "3",
        title: "Milky Way Core",
        subTitle: "The galactic center rising above the Sierra Nevada mountains. A 2-panel mosaic.",
        location: "Sierra Nevada, California",
        dateCreated: new Date("2024-07-04"),
        imageTakenDate: new Date("2024-07-04"),
        dontContainImage: false,
        thumbnail: "https://picsum.photos/seed/milkyway/600/400",
        images: [{ cloudLocation: "https://picsum.photos/seed/milkyway/1920/1280", isMain: true }],
    },
    {
        id: "4",
        title: "Crab Nebula (M1)",
        subTitle: "The remnant of a supernova explosion observed in 1054 AD, powered by a pulsar.",
        location: "Backyard Observatory",
        dateCreated: new Date("2024-12-03"),
        imageTakenDate: new Date("2024-12-03"),
        dontContainImage: false,
        thumbnail: "https://picsum.photos/seed/crab/600/400",
        images: [{ cloudLocation: "https://picsum.photos/seed/crab/1920/1280", isMain: true }],
    },
    {
        id: "5",
        title: "Pleiades Star Cluster (M45)",
        subTitle: "The Seven Sisters surrounded by wispy blue reflection nebulae.",
        location: "Rural Utah",
        dateCreated: new Date("2024-10-28"),
        imageTakenDate: new Date("2024-10-28"),
        dontContainImage: false,
        thumbnail: "https://picsum.photos/seed/pleiades/600/400",
        images: [{ cloudLocation: "https://picsum.photos/seed/pleiades/1920/1280", isMain: true }],
    },
    {
        id: "6",
        title: "Horsehead Nebula (IC 434)",
        subTitle: "The iconic Horsehead Nebula in Orion, captured in narrowband Hα.",
        location: "Dark Sky Site, New Mexico",
        dateCreated: new Date("2024-11-08"),
        imageTakenDate: new Date("2024-11-08"),
        dontContainImage: false,
        thumbnail: "https://picsum.photos/seed/horsehead/600/400",
        images: [{ cloudLocation: "https://picsum.photos/seed/horsehead/1920/1280", isMain: true }],
    },
];

let images = [...STUB_IMAGES];
let nextId = 7;

export class StubImageRepository implements ImageRepository {
    async getAll(): Promise<AstroImage[]> {
        return [...images];
    }

    async getById(id: string): Promise<AstroImage | null> {
        return images.find((img) => img.id === id) ?? null;
    }

    async create(image: Omit<AstroImage, "id">): Promise<AstroImage> {
        const newImage: AstroImage = { ...image, id: String(nextId++) };
        images.push(newImage);
        return newImage;
    }

    async update(id: string, updates: Partial<Omit<AstroImage, "id">>): Promise<AstroImage> {
        const idx = images.findIndex((img) => img.id === id);
        if (idx === -1) {
            throw new Error(`Image ${id} not found`);
        }
        images[idx] = { ...images[idx], ...updates };
        return images[idx];
    }

    async delete(id: string): Promise<void> {
        images = images.filter((img) => img.id !== id);
    }

    async uploadImage(
        _file: File,
        _imageTakenDate: Date,
        imageId?: string,
    ): Promise<{ cloudLocation: string; thumbnailUrl?: string }> {
        const seed = imageId ?? String(Math.random());
        return {
            cloudLocation: `https://picsum.photos/seed/${seed}/1920/1280`,
            thumbnailUrl: `https://picsum.photos/seed/${seed}/600/400`,
        };
    }
}
