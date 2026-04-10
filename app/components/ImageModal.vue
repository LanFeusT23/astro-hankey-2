<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-[100] flex items-center justify-center p-4"
      @click.self="$emit('close')"
    >
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-space-950/95 backdrop-blur-md" @click="$emit('close')" />

      <!-- Modal -->
      <div class="relative z-10 max-w-5xl w-full bg-space-800/80 border border-space-700/50 rounded-2xl overflow-hidden shadow-2xl">
        <!-- Close button -->
        <button
          class="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-space-900/80 border border-space-600/50 flex items-center justify-center text-slate-400 hover:text-white hover:border-space-500 transition-all"
          @click="$emit('close')"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div class="flex flex-col md:flex-row">
          <!-- Image -->
          <div class="flex-1 bg-black flex items-center justify-center min-h-[300px] md:min-h-[500px]">
            <img
              :src="image.fullUrl"
              :alt="image.title"
              class="max-w-full max-h-[70vh] object-contain"
            />
          </div>

          <!-- Info panel -->
          <div class="md:w-72 p-6 flex flex-col justify-between border-t md:border-t-0 md:border-l border-space-700/50">
            <div>
              <h2 class="text-xl font-display font-bold text-white mb-3">{{ image.title }}</h2>
              <div class="flex items-center gap-2 text-nebula-400 text-sm mb-4">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {{ formatDate(image.dateTaken) }}
              </div>
              <p class="text-slate-400 text-sm leading-relaxed">{{ image.description }}</p>
            </div>

            <div class="mt-6 pt-6 border-t border-space-700/50">
              <a
                :href="image.fullUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-nebula-600/20 hover:bg-nebula-600/40 border border-nebula-500/30 hover:border-nebula-400/60 text-nebula-300 rounded-lg text-sm transition-all"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View Full Resolution
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import type { AstroImage } from '~/types/image'

defineProps<{ image: AstroImage }>()
defineEmits<{ close: [] }>()

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

onMounted(() => {
  document.body.style.overflow = 'hidden'
})
onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>
