import type { ImageRepository } from './imageRepository'
import type { AstroImage } from '~/types/image'

// TODO: Implement Firebase Firestore + Storage backend
// Required packages: firebase
// Required env vars:
//   NUXT_PUBLIC_FIREBASE_API_KEY
//   NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN
//   NUXT_PUBLIC_FIREBASE_PROJECT_ID
//   NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET
//   NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
//   NUXT_PUBLIC_FIREBASE_APP_ID
//
// Implementation outline:
//   - Use Firestore collection 'images' for metadata
//   - Use Firebase Storage bucket 'images/' for files
//   - Upload creates a Firestore doc + uploads to Storage
//   - getAll() reads from Firestore with ordering by dateTaken desc

export class FirebaseImageRepository implements ImageRepository {
  async getAll(): Promise<AstroImage[]> {
    // TODO: const q = query(collection(db, 'images'), orderBy('dateTaken', 'desc'))
    // TODO: const snap = await getDocs(q)
    // TODO: return snap.docs.map(d => ({ id: d.id, ...d.data() } as AstroImage))
    throw new Error('FirebaseImageRepository not yet implemented')
  }

  async getById(id: string): Promise<AstroImage | null> {
    // TODO: const doc = await getDoc(doc(db, 'images', id))
    // TODO: return doc.exists() ? { id: doc.id, ...doc.data() } as AstroImage : null
    throw new Error('FirebaseImageRepository not yet implemented')
  }

  async create(image: Omit<AstroImage, 'id'>): Promise<AstroImage> {
    // TODO: const ref = await addDoc(collection(db, 'images'), image)
    // TODO: return { id: ref.id, ...image }
    throw new Error('FirebaseImageRepository not yet implemented')
  }

  async update(id: string, updates: Partial<Omit<AstroImage, 'id'>>): Promise<AstroImage> {
    // TODO: await updateDoc(doc(db, 'images', id), updates)
    // TODO: return { id, ...(await this.getById(id))! }
    throw new Error('FirebaseImageRepository not yet implemented')
  }

  async delete(id: string): Promise<void> {
    // TODO: await deleteDoc(doc(db, 'images', id))
    throw new Error('FirebaseImageRepository not yet implemented')
  }

  async uploadImage(file: File, imageId?: string): Promise<{ thumbnailUrl: string; fullUrl: string }> {
    // TODO: const path = `images/${imageId ?? Date.now()}_${file.name}`
    // TODO: const storageRef = ref(storage, path)
    // TODO: await uploadBytes(storageRef, file)
    // TODO: const url = await getDownloadURL(storageRef)
    // TODO: return { thumbnailUrl: url, fullUrl: url }
    throw new Error('FirebaseImageRepository not yet implemented')
  }
}
