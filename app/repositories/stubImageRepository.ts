import type { ImageRepository } from './imageRepository'
import type { AstroImage } from '~/types/image'

const STUB_IMAGES: AstroImage[] = [
  {
    id: '1',
    title: 'Andromeda Galaxy (M31)',
    description: 'The Andromeda Galaxy, our nearest spiral galaxy neighbor, captured over 4 hours of integration time. Shot from dark skies in rural Colorado.',
    dateTaken: '2024-09-15',
    thumbnailUrl: 'https://picsum.photos/seed/andromeda/600/400',
    fullUrl: 'https://picsum.photos/seed/andromeda/1920/1280',
  },
  {
    id: '2',
    title: 'Orion Nebula (M42)',
    description: 'The Great Orion Nebula, a stellar nursery 1,344 light-years away. This image reveals intricate dust lanes and the Trapezium cluster at its core.',
    dateTaken: '2024-11-20',
    thumbnailUrl: 'https://picsum.photos/seed/orion/600/400',
    fullUrl: 'https://picsum.photos/seed/orion/1920/1280',
  },
  {
    id: '3',
    title: 'Milky Way Core',
    description: 'The galactic center of our Milky Way, rising above the Sierra Nevada mountains. A 2-panel mosaic captured during new moon in July.',
    dateTaken: '2024-07-04',
    thumbnailUrl: 'https://picsum.photos/seed/milkyway/600/400',
    fullUrl: 'https://picsum.photos/seed/milkyway/1920/1280',
  },
  {
    id: '4',
    title: 'Crab Nebula (M1)',
    description: 'The remnant of a supernova explosion observed in 1054 AD. This cosmic wreckage is powered by a pulsar spinning 30 times per second.',
    dateTaken: '2024-12-03',
    thumbnailUrl: 'https://picsum.photos/seed/crab/600/400',
    fullUrl: 'https://picsum.photos/seed/crab/1920/1280',
  },
  {
    id: '5',
    title: 'Pleiades Star Cluster (M45)',
    description: 'The Seven Sisters, an open star cluster surrounded by wispy blue reflection nebulae. One of the most recognizable objects in the winter sky.',
    dateTaken: '2024-10-28',
    thumbnailUrl: 'https://picsum.photos/seed/pleiades/600/400',
    fullUrl: 'https://picsum.photos/seed/pleiades/1920/1280',
  },
  {
    id: '6',
    title: 'Horsehead Nebula (IC 434)',
    description: 'The iconic Horsehead Nebula in Orion, a dark nebula silhouetted against the glowing emission nebula IC 434. Captured in narrowband Halpha.',
    dateTaken: '2024-11-08',
    thumbnailUrl: 'https://picsum.photos/seed/horsehead/600/400',
    fullUrl: 'https://picsum.photos/seed/horsehead/1920/1280',
  },
]

let images = [...STUB_IMAGES]
let nextId = 7

export class StubImageRepository implements ImageRepository {
  async getAll(): Promise<AstroImage[]> {
    return [...images]
  }

  async getById(id: string): Promise<AstroImage | null> {
    return images.find(img => img.id === id) ?? null
  }

  async create(image: Omit<AstroImage, 'id'>): Promise<AstroImage> {
    const newImage: AstroImage = { ...image, id: String(nextId++) }
    images.push(newImage)
    return newImage
  }

  async update(id: string, updates: Partial<Omit<AstroImage, 'id'>>): Promise<AstroImage> {
    const idx = images.findIndex(img => img.id === id)
    if (idx === -1) throw new Error(`Image ${id} not found`)
    images[idx] = { ...images[idx], ...updates }
    return images[idx]
  }

  async delete(id: string): Promise<void> {
    images = images.filter(img => img.id !== id)
  }

  async uploadImage(_file: File, imageId?: string): Promise<{ thumbnailUrl: string; fullUrl: string }> {
    const seed = imageId ?? String(Math.random())
    return {
      thumbnailUrl: `https://picsum.photos/seed/${seed}/600/400`,
      fullUrl: `https://picsum.photos/seed/${seed}/1920/1280`,
    }
  }
}
