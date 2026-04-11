<template>
  <div
    class="group relative overflow-hidden rounded-2xl cursor-pointer bg-space-800 border border-space-700/50 hover:border-nebula-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-nebula-900/30"
    @click="$emit('click')"
  >
    <!-- Image -->
    <div class="aspect-[3/2] overflow-hidden">
      <img
        :src="image.thumbnailUrl"
        :alt="image.title"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        loading="lazy"
      />
    </div>

    <!-- Hover overlay -->
    <div
      class="absolute inset-0 bg-gradient-to-t from-space-950 via-space-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-5"
    >
      <h3
        class="text-white font-semibold text-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300"
      >
        {{ image.title }}
      </h3>
      <p
        class="text-slate-400 text-sm mt-1 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-75"
      >
        {{ formatDate(image.dateTaken) }}
      </p>
    </div>

    <!-- Expand icon -->
    <div
      class="absolute top-4 right-4 w-8 h-8 rounded-full bg-space-900/80 border border-space-600/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-1 group-hover:translate-y-0"
    >
      <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
        />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AstroImage } from "~/types/image";

defineProps<{ image: AstroImage }>();
defineEmits<{ click: [] }>();

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
</script>
