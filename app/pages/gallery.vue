<script setup lang="ts">
import gsap from "gsap";
import type { AstroImage } from "~/types/image";

useSeoMeta({
    title: "Gallery — Jonathan Hankey Astrophotography",
    description:
        "Browse the astrophotography gallery featuring nebulae, galaxies, and star clusters.",
});

const { images, loading, error, fetchImages } = useImages();
const selectedImage = ref<AstroImage | null>(null);

const selectedIndex = computed(() =>
    selectedImage.value ? images.value.indexOf(selectedImage.value) : -1,
);

const openModal = (image: AstroImage) => {
    selectedImage.value = image;
};

const navigatePrev = () => {
    if (selectedIndex.value > 0) {
        selectedImage.value = images.value[selectedIndex.value - 1] ?? null;
    }
};

const navigateNext = () => {
    if (selectedIndex.value < images.value.length - 1) {
        selectedImage.value = images.value[selectedIndex.value + 1] ?? null;
    }
};

const onBeforeEnter = (el: Element) => {
    gsap.set(el, {
        scale: 0.2,
        opacity: 0,
        x: "10rem",
        transformOrigin: "center center",
    });
};

const DELAY_BETWEEN_IMAGES_IN_MS = 50;

const onEnter = (el: Element, done: () => void) => {
    const delayIndex = Number((el as HTMLElement).dataset.index ?? 0);
    const delay = (delayIndex * DELAY_BETWEEN_IMAGES_IN_MS) / 1000;

    gsap.to(el, {
        scale: 1,
        opacity: 1,
        x: 0,
        duration: 0.5,
        delay: delay,
        ease: "power3.in",
        onComplete: done,
    });
};

onMounted(() => {
    fetchImages();
});
</script>

<template>
    <div class="min-h-screen overflow-x-hidden">
        <AppNav />

        <main class="pt-24 pb-16 px-4">
            <div class="max-w-7xl mx-auto">
                <!-- Header -->
                <div class="text-center mb-16">
                    <h1 class="text-4xl md:text-6xl font-display font-bold text-white mb-4">
                        The <span class="text-nebula-400">Gallery</span>
                    </h1>
                    <p class="text-slate-400 text-lg max-w-2xl mx-auto">
                        A collection of deep sky objects captured through long nights of patient
                        observation.
                    </p>
                    <div class="flex items-center justify-center gap-4 mt-6">
                        <div class="h-px w-16 bg-linear-to-r from-transparent to-nebula-500"></div>
                        <div class="w-2 h-2 rounded-full bg-nebula-500"></div>
                        <div class="h-px w-16 bg-linear-to-l from-transparent to-nebula-500"></div>
                    </div>
                </div>

                <!-- Loading state -->
                <div v-if="loading" class="flex justify-center items-center py-24">
                    <div class="relative">
                        <div
                            class="w-16 h-16 border-4 border-space-700 rounded-full animate-spin border-t-nebula-500"
                        ></div>
                    </div>
                </div>

                <!-- Error state -->
                <div v-else-if="error" class="text-center py-24 text-red-400">
                    <p>{{ error }}</p>
                    <button
                        @click="fetchImages"
                        class="mt-4 px-4 py-2 bg-nebula-600 rounded-lg text-white hover:bg-nebula-500 transition-colors"
                    >
                        Retry
                    </button>
                </div>

                <!-- Image grid -->
                <TransitionGroup
                    v-else
                    tag="div"
                    class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6"
                    :css="false"
                    appear
                    @before-enter="onBeforeEnter"
                    @enter="onEnter"
                >
                    <ImageCard
                        v-for="(image, index) in images"
                        :key="image.id"
                        :data-index="index"
                        :image="image"
                        @click="openModal(image)"
                    />
                </TransitionGroup>
            </div>
        </main>

        <!-- Modal -->
        <ImageModal
            v-if="selectedImage"
            :image="selectedImage"
            :has-prev="selectedIndex > 0"
            :has-next="selectedIndex < images.length - 1"
            @close="selectedImage = null"
            @prev="navigatePrev"
            @next="navigateNext"
        />
    </div>
</template>
