<template>
  <div class="min-h-screen bg-space-950">
    <AppNav />

    <main class="pt-24 pb-16 px-4">
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="text-center mb-16">
          <h1 class="text-4xl md:text-6xl font-display font-bold text-white mb-4">
            The <span class="text-nebula-400">Gallery</span>
          </h1>
          <p class="text-slate-400 text-lg max-w-2xl mx-auto">
            A collection of deep sky objects captured through long nights of patient observation.
          </p>
          <div class="flex items-center justify-center gap-4 mt-6">
            <div class="h-px w-16 bg-gradient-to-r from-transparent to-nebula-500"></div>
            <div class="w-2 h-2 rounded-full bg-nebula-500"></div>
            <div class="h-px w-16 bg-gradient-to-l from-transparent to-nebula-500"></div>
          </div>
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="flex justify-center items-center py-24">
          <div class="relative">
            <div class="w-16 h-16 border-4 border-space-700 rounded-full animate-spin border-t-nebula-500"></div>
          </div>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="text-center py-24 text-red-400">
          <p>{{ error }}</p>
          <button @click="fetchImages" class="mt-4 px-4 py-2 bg-nebula-600 rounded-lg text-white hover:bg-nebula-500 transition-colors">
            Retry
          </button>
        </div>

        <!-- Image grid -->
        <div
          v-else
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <ImageCard
            v-for="image in images"
            :key="image.id"
            :image="image"
            @click="openModal(image)"
          />
        </div>
      </div>
    </main>

    <!-- Modal -->
    <ImageModal
      v-if="selectedImage"
      :image="selectedImage"
      @close="selectedImage = null"
    />
  </div>
</template>

<script setup lang="ts">
import type { AstroImage } from '~/types/image'

useSeoMeta({
  title: 'Gallery — Jonathan Hankey Astrophotography',
  description: 'Browse the astrophotography gallery featuring nebulae, galaxies, and star clusters.',
})

const { images, loading, error, fetchImages } = useImages()
const selectedImage = ref<AstroImage | null>(null)

const openModal = (image: AstroImage) => {
  selectedImage.value = image
}

onMounted(() => {
  fetchImages()
})
</script>
