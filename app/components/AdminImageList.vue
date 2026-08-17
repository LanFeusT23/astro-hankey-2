<script setup lang="ts">
import type { AstroImage } from "~/types/image";

const props = defineProps<{ images: AstroImage[] }>();
const emit = defineEmits<{ edit: [image: AstroImage]; deleted: [] }>();

const { deleteImage } = useImages();
const { resolveUrl } = useImageUrl();

const RETRY_DELAY_MS = 3000;
const MAX_RETRIES = 3;
const retryCount = ref<Record<string, number>>({});
const thumbnailBust = ref<Record<string, number>>({});

const thumbnailSrc = (image: AstroImage) => {
    const base = resolveUrl(image.thumbnail);
    if (!base) {
        return undefined;
    }
    const bust = thumbnailBust.value[image.id];
    return bust ? `${base}?v=${bust}` : base;
};

const onThumbnailError = (image: AstroImage) => {
    const count = retryCount.value[image.id] ?? 0;
    if (count >= MAX_RETRIES) {
        return;
    }
    retryCount.value[image.id] = count + 1;
    setTimeout(() => {
        thumbnailBust.value[image.id] = Date.now();
    }, RETRY_DELAY_MS);
};

const onThumbnailLoad = (image: AstroImage) => {
    delete retryCount.value[image.id];
    delete thumbnailBust.value[image.id];
};

const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

const handleDelete = async (id: string) => {
    if (!confirm("Delete this image?")) {
        return;
    }
    await deleteImage(id);
    emit("deleted");
};
</script>

<template>
    <div class="bg-space-800/40 border border-space-700/40 rounded-2xl p-6 backdrop-blur-sm">
        <h2 class="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <MdiFormatListBulleted class="w-5 h-5 text-nebula-400" />
            Current Posts ({{ images.length }})
        </h2>

        <div v-if="images.length === 0" class="text-center py-12 text-slate-500">
            No posts yet. Add your first post.
        </div>

        <div v-else class="space-y-4">
            <div
                v-for="image in images"
                :key="image.id"
                class="flex gap-4 p-4 bg-space-900/50 border border-space-700/30 rounded-xl group hover:border-space-600/50 transition-colors"
            >
                <!-- Thumbnail -->
                <div
                    class="relative w-20 h-14 rounded-lg shrink-0 overflow-hidden bg-space-700/60 flex items-center justify-center"
                >
                    <img
                        v-if="(retryCount[image.id] ?? 0) < MAX_RETRIES"
                        :src="thumbnailSrc(image)"
                        :alt="image.title"
                        class="w-full h-full object-cover"
                        @error="onThumbnailError(image)"
                        @load="onThumbnailLoad(image)"
                    />
                    <div
                        v-if="retryCount[image.id]"
                        class="absolute inset-0 flex items-center justify-center bg-space-900/60"
                    >
                        <div
                            class="w-5 h-5 border-2 border-space-500 border-t-nebula-400 rounded-full animate-spin"
                        ></div>
                    </div>
                </div>

                <!-- Info / Edit -->
                <div class="flex-1 min-w-0">
                    <h3 class="font-medium text-white truncate">{{ image.title }}</h3>
                    <div class="flex items-center gap-2 mt-0.5">
                        <p class="text-slate-400 text-sm">
                            {{ formatDate(image.imageTakenDate) }}
                        </p>
                        <span
                            class="text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded border"
                            :class="
                                image.status === 'published'
                                    ? 'text-emerald-300 border-emerald-500/40 bg-emerald-900/20'
                                    : 'text-amber-300 border-amber-500/40 bg-amber-900/20'
                            "
                        >
                            {{ image.status }}
                        </span>
                    </div>
                    <p class="text-slate-500 text-xs mt-1 line-clamp-1">{{ image.subTitle }}</p>
                </div>

                <!-- Actions -->
                <div class="flex flex-col gap-2 shrink-0">
                    <button
                        @click="emit('edit', image)"
                        class="px-3 py-1.5 text-xs bg-space-700/60 hover:bg-space-600/60 text-slate-300 rounded-lg transition-colors"
                    >
                        Edit
                    </button>
                    <button
                        @click="handleDelete(image.id)"
                        class="px-3 py-1.5 text-xs bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-lg transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
