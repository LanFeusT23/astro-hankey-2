<script setup lang="ts">
import type { AstroImage } from "~/types/image";

const props = defineProps<{ image: AstroImage }>();
defineEmits<{ click: [] }>();

const { resolveUrl } = useImageUrl();

const thumbnailSrc = computed(() => {
    return resolveUrl(props.image.thumbnail);
});

const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};
</script>

<template>
    <div
        class="group relative overflow-hidden rounded-2xl cursor-pointer bg-space-800 border border-space-700/50 hover:border-nebula-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-nebula-900/30"
        @click="$emit('click')"
    >
        <!-- Image -->
        <div class="aspect-3/2 overflow-hidden">
            <img
                :src="thumbnailSrc"
                :alt="image.title"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
            />
        </div>

        <!-- Hover overlay -->
        <div
            class="absolute inset-0 bg-linear-to-t from-space-950 via-space-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-5"
        >
            <h3
                class="text-white font-semibold text-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300"
            >
                {{ image.title }}
            </h3>
            <p
                class="text-slate-400 text-sm mt-1 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-75"
            >
                {{ formatDate(image.imageTakenDate) }}
            </p>
        </div>

        <!-- Expand icon -->
        <div
            class="absolute top-4 right-4 w-8 h-8 rounded-full bg-space-900/80 border border-space-600/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-1 group-hover:translate-y-0"
        >
            <MdiArrowExpandAll class="w-4 h-4 text-white" />
        </div>
    </div>
</template>
