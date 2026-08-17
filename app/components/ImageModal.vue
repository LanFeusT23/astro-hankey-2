<script setup lang="ts">
import type { AstroImage } from "~/types/image";

const props = defineProps<{
    image: AstroImage;
    hasPrev?: boolean;
    hasNext?: boolean;
    imageIndex?: number;
}>();
const emit = defineEmits<{ close: []; prev: []; next: []; "update:imageIndex": [index: number] }>();

const { resolveUrl } = useImageUrl();

const selectedIndex = ref(props.imageIndex ?? 0);

watch(
    () => props.image,
    () => {
        selectedIndex.value = props.imageIndex ?? 0;
    },
);

const currentCloudLocation = computed(
    () => resolveUrl(props.image.images[selectedIndex.value]?.cloudLocation) ?? "",
);

const hasMultipleImages = computed(() => props.image.images.length > 1);

const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

// Keyboard navigation
const onKeydown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft" && props.hasPrev) {
        emit("prev");
    } else if (e.key === "ArrowRight" && props.hasNext) {
        emit("next");
    } else if (e.key === "Escape") {
        emit("close");
    }
};

// Touch swipe navigation
let touchStartX = 0;
const onTouchStart = (e: TouchEvent) => {
    touchStartX = e.touches[0]?.clientX ?? 0;
};
const onTouchEnd = (e: TouchEvent) => {
    const endX = e.changedTouches[0]?.clientX ?? touchStartX;
    const delta = touchStartX - endX;
    if (Math.abs(delta) < 50) {
        return;
    }
    if (delta > 0 && props.hasNext) {
        emit("next");
    } else if (delta < 0 && props.hasPrev) {
        emit("prev");
    }
};

onMounted(() => {
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeydown);
});
onUnmounted(() => {
    document.body.style.overflow = "";
    window.removeEventListener("keydown", onKeydown);
});
</script>

<template>
    <Teleport to="body">
        <div
            class="fixed inset-0 z-100 flex items-center justify-center p-4"
            @click.self="$emit('close')"
            @touchstart="onTouchStart"
            @touchend="onTouchEnd"
        >
            <!-- Backdrop -->
            <div class="absolute inset-0 bg-space-950/50 backdrop-blur-md"></div>

            <!-- Prev arrow -->
            <button
                v-if="hasPrev"
                class="absolute left-4 z-20 flex items-center justify-center text-slate-400 hover:text-white transition-all opacity-50"
                @click.stop="$emit('prev')"
                aria-label="Previous image"
            >
                <MdiChevronLeft class="text-3xl" />
            </button>

            <!-- Next arrow -->
            <button
                v-if="hasNext"
                class="absolute right-4 z-20 flex items-center justify-center text-slate-400 hover:text-white transition-all opacity-50"
                @click.stop="$emit('next')"
                aria-label="Next image"
            >
                <MdiChevronRight class="text-3xl" />
            </button>

            <!-- Modal -->
            <div
                class="relative z-10 max-w-7xl w-full bg-space-800 border border-space-700/50 rounded-2xl overflow-hidden shadow-2xl h-full max-h-[95%]"
            >
                <!-- Close button -->
                <button
                    class="absolute top-1 right-1 z-20 w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white hover:border-space-500 transition-all"
                    @click="$emit('close')"
                >
                    <MdiClose class="w-5 h-5" />
                </button>

                <div class="flex flex-col md:flex-row h-full overflow-y-auto md:overflow-hidden">
                    <!-- Image -->
                    <div
                        class="relative flex-1 bg-black flex flex-col items-center justify-center min-h-75 md:min-h-[65vh] shrink-0 md:shrink"
                    >
                        <img
                            :src="currentCloudLocation"
                            :alt="image.title"
                            class="max-w-full max-h-[85vh] object-contain h-full"
                        />

                        <!-- Thumbnail strip -->
                        <div
                            v-if="hasMultipleImages"
                            class="absolute bottom-0 w-full px-3 py-2 flex gap-2 overflow-x-auto justify-center bg-black/20"
                        >
                            <button
                                v-for="(img, i) in image.images"
                                :key="i"
                                type="button"
                                class="flex-shrink-0 w-14 h-14 rounded overflow-hidden border-2 transition-colors"
                                :class="
                                    i === selectedIndex
                                        ? 'border-nebula-400'
                                        : 'border-transparent opacity-60 hover:opacity-100'
                                "
                                @click.stop="selectedIndex = i; emit('update:imageIndex', i)"
                            >
                                <img
                                    :src="resolveUrl(img.cloudLocation)"
                                    :alt="`Image ${i + 1}`"
                                    class="w-full h-full object-cover"
                                />
                            </button>
                        </div>
                    </div>

                    <!-- Info panel -->
                    <div
                        class="md:w-96 p-3 md:p-6 flex flex-col justify-between border-t md:border-t-0 md:border-l border-space-700/50 shrink-0 md:overflow-y-auto"
                    >
                        <div>
                            <h2 class="text-xl font-display font-bold text-white mb-3">
                                {{ image.title }}
                            </h2>
                            <div class="flex items-center gap-2 text-nebula-400 text-sm mb-4">
                                <MdiCalendarMonthOutline class="w-4 h-4" />
                                {{ formatDate(image.imageTakenDate) }}
                            </div>
                            <p
                                v-if="image.subTitle"
                                class="text-slate-400 text-sm leading-relaxed whitespace-pre-wrap"
                            >{{ image.subTitle }}</p>
                        </div>

                        <div class="mt-6 pt-6 border-t border-space-700/50">
                            <a
                                :href="currentCloudLocation"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-nebula-600/20 hover:bg-nebula-600/40 border border-nebula-500/30 hover:border-nebula-400/60 text-nebula-300 rounded-lg text-sm transition-all"
                            >
                                <MdiOpenInNew class="w-4 h-4" />
                                View Full Resolution
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>
