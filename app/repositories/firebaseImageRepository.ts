import type { FirebaseApp } from "firebase/app";
import type { Firestore } from "firebase/firestore";
import type { FirebaseStorage } from "firebase/storage";
import type { ImageRepository } from "./imageRepository";
import { astroImageSchema } from "~/types/image";
import type { AstroImage } from "~/types/image";

const GALLERY_COLLECTION_PROD = "images";
const GALLERY_STORAGE_PATH_PROD = "gallery";

const GALLERY_COLLECTION_TEST = "testImages";
const GALLERY_STORAGE_PATH_TEST = "testGallery";

function getPaths(): { collection: string; storagePath: string; thumbnailsPath: string } {
    const config = useRuntimeConfig();
    const isStaging = config.public.appEnv === "staging";
    const storagePath = isStaging ? GALLERY_STORAGE_PATH_TEST : GALLERY_STORAGE_PATH_PROD;
    return {
        collection: isStaging ? GALLERY_COLLECTION_TEST : GALLERY_COLLECTION_PROD,
        storagePath,
        thumbnailsPath: `${storagePath}/thumbnails`,
    };
}

let _app: FirebaseApp | null = null;
let _db: Firestore | null = null;
let _storage: FirebaseStorage | null = null;

async function getFirebaseApp(): Promise<FirebaseApp | null> {
    if (_app) {
        return _app;
    }

    const config = useRuntimeConfig();
    const firebase = config.public.firebase as Record<string, string>;

    if (!firebase.apiKey) {
        return null;
    }

    const { initializeApp, getApps } = await import("firebase/app");
    _app = getApps().length === 0 ? initializeApp(firebase) : getApps()[0];
    return _app;
}

async function getDb(): Promise<Firestore> {
    if (_db) {
        return _db;
    }
    const app = await getFirebaseApp();
    if (!app) {
        throw new Error("Firebase is not configured");
    }
    const { getFirestore } = await import("firebase/firestore");
    _db = getFirestore(app);
    return _db;
}

async function getStorage(): Promise<FirebaseStorage> {
    if (_storage) {
        return _storage;
    }
    const app = await getFirebaseApp();
    if (!app) {
        throw new Error("Firebase is not configured");
    }
    const { getStorage: initStorage } = await import("firebase/storage");
    _storage = initStorage(app);
    return _storage;
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

export class FirebaseImageRepository implements ImageRepository {
    async getAll(): Promise<AstroImage[]> {
        const db = await getDb();
        const { collection, query, orderBy, getDocs } = await import("firebase/firestore");

        const q = query(collection(db, getPaths().collection), orderBy("imageTakenDate", "desc"));
        const snap = await getDocs(q);

        return snap.docs.map((d) => {
            return astroImageSchema.parse({ id: d.id, ...d.data() });
        });
    }

    async getById(id: string): Promise<AstroImage | null> {
        const db = await getDb();
        const { doc, getDoc } = await import("firebase/firestore");
        const docSnapshot = await getDoc(doc(db, getPaths().collection, id));
        return docSnapshot.exists()
            ? astroImageSchema.parse({
                  id: docSnapshot.id,
                  ...docSnapshot.data(),
              })
            : null;
    }

    async create(image: Omit<AstroImage, "id">): Promise<AstroImage> {
        const db = await getDb();
        const { collection, addDoc } = await import("firebase/firestore");
        const ref = await addDoc(collection(db, getPaths().collection), image);
        return { id: ref.id, ...image };
    }

    async update(id: string, updates: Partial<Omit<AstroImage, "id">>): Promise<AstroImage> {
        const db = await getDb();
        const { doc, updateDoc } = await import("firebase/firestore");
        await updateDoc(doc(db, getPaths().collection, id), updates);
        const updated = await this.getById(id);
        if (!updated) {
            throw new Error(`Image ${id} not found after update`);
        }
        return updated;
    }

    async delete(id: string): Promise<void> {
        const image = await this.getById(id);

        if (image) {
            const storage = await getStorage();
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

        const db = await getDb();
        const { doc, deleteDoc } = await import("firebase/firestore");
        await deleteDoc(doc(db, getPaths().collection, id));
    }

    async uploadImage(
        file: File,
        imageTakenDate: Date,
        imageId?: string,
    ): Promise<{ cloudLocation: string; thumbnailUrl?: string }> {
        const storage = await getStorage();
        const { ref, uploadBytes } = await import("firebase/storage");

        const normalizedName = normalizeFilename(file.name, imageTakenDate);
        const filename = imageId ? `${imageId}_${normalizedName}` : normalizedName;
        const { storagePath, thumbnailsPath } = getPaths();
        const cloudLocation = `${storagePath}/${filename}`;
        const fullRef = ref(storage, cloudLocation);
        await uploadBytes(fullRef, file);

        // Thumbnail is generated by a Cloud Function at {thumbnailsPath}/{filename} with _200x200 suffix.
        const thumbnailUrl = `${thumbnailsPath}/${addSizeSuffix(filename, "_200x200")}`;

        return { cloudLocation, thumbnailUrl };
    }
}
