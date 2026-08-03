<script setup lang="ts">
import gsap from "gsap";

definePageMeta({ pageTransition: false, key: "gallery" });

const route = useRoute();
const requestUrl = useRequestURL();
const slug = computed(() => route.params.slug as string | undefined);

const { images, sortedImages, loading, error, fetchImages } = useImages();
const { resolveById, navigatePrev, navigateNext, hasPrev, hasNext } =
    useGallerySelection(sortedImages);
const { resolveUrl } = useImageUrl();
if (images.value.length === 0) {
    await fetchImages();
}

const image = computed(() => (slug.value ? resolveById(slug.value) : undefined));
const imageUrl = computed(() => {
    if (!image.value) {
        return undefined;
    }
    return resolveUrl(image.value.thumbnail);
});
const description = computed(() =>
    image.value?.subTitle ??
    "Browse the astrophotography gallery featuring nebulae, galaxies, and star clusters.",
);

useSeoMeta({
    title: computed(() =>
        image.value
            ? `${image.value.title} — Jonathan Hankey Astrophotography`
            : "Gallery — Jonathan Hankey Astrophotography",
    ),
    description,
    ogTitle: computed(() => image.value?.title ?? "Gallery"),
    ogDescription: description,
    ogImage: imageUrl,
    ogUrl: computed(() => requestUrl.href),
    ogType: "website",
    ogSiteName: "Jonathan Hankey Astrophotography",
    twitterCard: "summary_large_image",
});

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
                        v-for="(img, index) in sortedImages"
                        :key="img.id"
                        :data-index="index"
                        :image="img"
                    />
                </TransitionGroup>
            </div>
        </main>

        <!-- Modal — driven by URL slug; same component instance, no remount -->
        <ImageModal
            v-if="image && slug"
            :image="image"
            :has-prev="hasPrev(slug)"
            :has-next="hasNext(slug)"
            @close="$router.push('/gallery')"
            @prev="navigatePrev(slug)"
            @next="navigateNext(slug)"
        />
    </div>
</template>
