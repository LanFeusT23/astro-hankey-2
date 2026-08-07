import type { FirebaseApp } from "firebase/app";
import type { Firestore } from "firebase/firestore";
import type { FirebaseStorage } from "firebase/storage";
import type { ImageRepository } from "./imageRepository";
import { astroImageSchema } from "~/types/image";
import type { AstroImage } from "~/types/image";

type FirebasePublicConfig = {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
};

const GALLERY_COLLECTION_PROD = "images";
const GALLERY_STORAGE_PATH_PROD = "gallery";

const GALLERY_COLLECTION_TEST = "testImages";
const GALLERY_STORAGE_PATH_TEST = "testGallery";

function getPaths(appEnv: string): { collection: string; storagePath: string; thumbnailsPath: string } {
    const isStaging = appEnv === "staging";
    const storagePath = isStaging ? GALLERY_STORAGE_PATH_TEST : GALLERY_STORAGE_PATH_PROD;
    return {
        collection: isStaging ? GALLERY_COLLECTION_TEST : GALLERY_COLLECTION_PROD,
        storagePath,
        thumbnailsPath: `${storagePath}/thumbnails`,
    };
}

function normalizeFilename(filename: string, date: Date): string {
    const lastDot = filename.lastIndexOf(".");
    const ext = lastDot !== -1 ? filename.slice(lastDot).toLowerCase() : "";
    const name = lastDot !== -1 ? filename.slice(0, lastDot) : filename;
    const dateStr = date.toISOString().slice(0, 10);
    const normalized = name
        .toLowerCase()
        .replace(/\s+/g, "_")
        .replace(/[^a-z0-9_-]/g, "_");
    return `${normalized}-${dateStr}${ext}`;
}

function addSizeSuffix(filename: string, suffix: string): string {
    const lastDot = filename.lastIndexOf(".");
    if (lastDot === -1) {
        return `${filename}${suffix}`;
    }
    return `${filename.slice(0, lastDot)}${suffix}${filename.slice(lastDot)}`;
}

function removeUndefinedFields<T extends object>(data: T): Partial<T> {
    return Object.fromEntries(
        Object.entries(data).filter(([, value]) => value !== undefined),
    ) as Partial<T>;
}

export class FirebaseImageRepository implements ImageRepository {
    private app: FirebaseApp | null = null;
    private db: Firestore | null = null;
    private storage: FirebaseStorage | null = null;

    constructor(
        private readonly appEnv: string,
        private readonly firebase: FirebasePublicConfig,
    ) {}

    private async getFirebaseApp(): Promise<FirebaseApp | null> {
        if (this.app) {
            return this.app;
        }
        if (!this.firebase.apiKey) {
            return null;
        }
        const { initializeApp, getApps } = await import("firebase/app");
        this.app = getApps().length === 0 ? initializeApp(this.firebase) : getApps()[0];
        return this.app;
    }

    private async getDb(): Promise<Firestore> {
        if (this.db) {
            return this.db;
        }
        const app = await this.getFirebaseApp();
        if (!app) {
            throw new Error("Firebase is not configured");
        }
        const { getFirestore } = await import("firebase/firestore");
        this.db = getFirestore(app);
        return this.db;
    }

    private async getStorage(): Promise<FirebaseStorage> {
        if (this.storage) {
            return this.storage;
        }
        const app = await this.getFirebaseApp();
        if (!app) {
            throw new Error("Firebase is not configured");
        }
        const { getStorage: initStorage } = await import("firebase/storage");
        this.storage = initStorage(app);
        return this.storage;
    }

    async getAll(): Promise<AstroImage[]> {
        const db = await this.getDb();
        const paths = getPaths(this.appEnv);
        const { collection, query, orderBy, getDocs } = await import("firebase/firestore");

        const q = query(collection(db, paths.collection), orderBy("imageTakenDate", "desc"));
        const snap = await getDocs(q);

        return snap.docs.map((d) => {
            return astroImageSchema.parse({ id: d.id, ...d.data() });
        });
    }

    async getById(id: string): Promise<AstroImage | null> {
        const db = await this.getDb();
        const paths = getPaths(this.appEnv);
        const { doc, getDoc } = await import("firebase/firestore");
        const docSnapshot = await getDoc(doc(db, paths.collection, id));
        return docSnapshot.exists()
            ? astroImageSchema.parse({
                  id: docSnapshot.id,
                  ...docSnapshot.data(),
              })
            : null;
    }

    async create(image: Omit<AstroImage, "id">): Promise<AstroImage> {
        const db = await this.getDb();
        const paths = getPaths(this.appEnv);
        const { collection, addDoc } = await import("firebase/firestore");
        const imageData = removeUndefinedFields(image);
        const ref = await addDoc(collection(db, paths.collection), imageData);
        return astroImageSchema.parse({ id: ref.id, ...imageData });
    }

    async update(id: string, updates: Partial<Omit<AstroImage, "id">>): Promise<AstroImage> {
        const db = await this.getDb();
        const paths = getPaths(this.appEnv);
        const { doc, updateDoc } = await import("firebase/firestore");
        await updateDoc(doc(db, paths.collection, id), removeUndefinedFields(updates));
        const updated = await this.getById(id);
        if (!updated) {
            throw new Error(`Image ${id} not found after update`);
        }
        return updated;
    }

    async delete(id: string): Promise<void> {
        const image = await this.getById(id);

        if (image) {
            const storage = await this.getStorage();
            const { ref, deleteObject } = await import("firebase/storage");

            const deletePromises: Promise<void>[] = image.images.map((img) =>
                deleteObject(ref(storage, img.cloudLocation)),
            );
            if (image.thumbnail) {
                deletePromises.push(deleteObject(ref(storage, image.thumbnail)));
            }
            const results = await Promise.allSettled(deletePromises);
            results.forEach((result) => {
                if (result.status === "rejected") {
                    console.warn("Failed to delete storage file:", result.reason);
                }
            });
        }

        const db = await this.getDb();
        const paths = getPaths(this.appEnv);
        const { doc, deleteDoc } = await import("firebase/firestore");
        await deleteDoc(doc(db, paths.collection, id));
    }

    async uploadImage(
        file: File,
        imageTakenDate: Date,
        imageId?: string,
    ): Promise<{ cloudLocation: string; thumbnailUrl?: string }> {
        const storage = await this.getStorage();
        const { ref, uploadBytes } = await import("firebase/storage");

        const normalizedName = normalizeFilename(file.name, imageTakenDate);
        const filename = imageId ? `${imageId}_${normalizedName}` : normalizedName;
        const { storagePath, thumbnailsPath } = getPaths(this.appEnv);
        const cloudLocation = `${storagePath}/${filename}`;
        const fullRef = ref(storage, cloudLocation);
        await uploadBytes(fullRef, file);

        // Thumbnail is generated by the Firebase Resize Images extension at {thumbnailsPath}/{filename} with _500x500 suffix.
        const thumbnailUrl = `${thumbnailsPath}/${addSizeSuffix(filename, "_500x500")}`;

        return { cloudLocation, thumbnailUrl };
    }
}
