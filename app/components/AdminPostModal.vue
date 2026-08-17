<script setup lang="ts">
import type { AstroImage } from "~/types/image";

type PostStatus = AstroImage["status"];

type ImageItem =
    | { key: string; type: "existing"; cloudLocation: string; thumbnailUrl?: string; previewUrl: string }
    | { key: string; type: "new"; file: File; previewUrl: string };

let itemKeyCounter = 0;
const nextKey = () => String(++itemKeyCounter);

export type AdminPostSavePayload = {
    id?: string;
    title: string;
    subTitle: string;
    location: string;
    imageTakenDate: string;
    status: PostStatus;
    imageItems: Array<
        | { type: "existing"; cloudLocation: string; thumbnailUrl?: string }
        | { type: "new"; file: File }
    >;
};

const props = defineProps<{
    image?: AstroImage | null;
    open: boolean;
    saving?: boolean;
}>();

const emit = defineEmits<{ close: []; save: [payload: AdminPostSavePayload] }>();

const { resolveUrl } = useImageUrl();

const fileInput = ref<HTMLInputElement | null>(null);
const formError = ref("");

const form = reactive({
    title: "",
    subTitle: "",
    location: "",
    imageTakenDate: "",
});

const imageItems = ref<ImageItem[]>([]);

const isEditMode = computed(() => Boolean(props.image?.id));

const cleanupNewItems = () => {
    for (const item of imageItems.value) {
        if (item.type === "new") {
            URL.revokeObjectURL(item.previewUrl);
        }
    }
};

const resetForm = () => {
    cleanupNewItems();
    form.title = props.image?.title ?? "";
    form.subTitle = props.image?.subTitle ?? "";
    form.location = props.image?.location ?? "";
    form.imageTakenDate = props.image
        ? props.image.imageTakenDate.toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10);
    formError.value = "";
    if (fileInput.value) {
        fileInput.value.value = "";
    }
    imageItems.value = (props.image?.images ?? []).map((img, i) => ({
        key: nextKey(),
        type: "existing" as const,
        cloudLocation: img.cloudLocation,
        // Carry the post thumbnail only for the first image (it's the thumbnail source)
        thumbnailUrl: i === 0 ? (props.image?.thumbnail ?? undefined) : undefined,
        previewUrl: resolveUrl(img.cloudLocation) ?? "",
    }));
};

watch(
    () => [props.image, props.open],
    () => {
        if (props.open) {
            resetForm();
        }
    },
    { immediate: true },
);

onUnmounted(() => {
    cleanupNewItems();
});

// ── File input ────────────────────────────────────────────────────────────────

const addFiles = (files: File[]) => {
    for (const file of files) {
        imageItems.value.push({
            key: nextKey(),
            type: "new",
            file,
            previewUrl: URL.createObjectURL(file),
        });
    }
};

const handleFilesChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    addFiles(Array.from(target.files ?? []));
    if (fileInput.value) {
        fileInput.value.value = "";
    }
};

// ── Drop zone (file drop) ─────────────────────────────────────────────────────

const dropZoneActive = ref(false);

const onDropZoneDragover = (e: DragEvent) => {
    e.preventDefault();
    dropZoneActive.value = true;
};

const onDropZoneDragleave = () => {
    dropZoneActive.value = false;
};

const onDropZoneDrop = (e: DragEvent) => {
    e.preventDefault();
    dropZoneActive.value = false;
    const files = Array.from(e.dataTransfer?.files ?? []).filter((f) =>
        f.type.startsWith("image/"),
    );
    addFiles(files);
};

// ── List drag-and-drop reorder ────────────────────────────────────────────────

const dragSrcIndex = ref<number | null>(null);
const dragOverIndex = ref<number | null>(null);

const onItemDragstart = (e: DragEvent, index: number) => {
    dragSrcIndex.value = index;
    if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = "move";
        // Carry the key so the browser ghost is meaningful
        e.dataTransfer.setData("text/plain", imageItems.value[index]?.key ?? "");
    }
};

const onItemDragover = (e: DragEvent, index: number) => {
    e.preventDefault();
    if (e.dataTransfer) {
        e.dataTransfer.dropEffect = "move";
    }
    dragOverIndex.value = index;
};

const onItemDragleave = (e: DragEvent, index: number) => {
    // Only clear if the pointer actually left this row (not just moved to a child element)
    const row = (e.currentTarget as HTMLElement);
    if (row.contains(e.relatedTarget as Node | null)) {
        return;
    }
    if (dragOverIndex.value === index) {
        dragOverIndex.value = null;
    }
};

const onItemDrop = (_e: DragEvent, index: number) => {
    const src = dragSrcIndex.value;
    if (src === null || src === index) {
        dragSrcIndex.value = null;
        dragOverIndex.value = null;
        return;
    }
    const arr = [...imageItems.value];
    const [moved] = arr.splice(src, 1);
    arr.splice(index, 0, moved);
    imageItems.value = arr;
    dragSrcIndex.value = null;
    dragOverIndex.value = null;
};

const onItemDragend = () => {
    dragSrcIndex.value = null;
    dragOverIndex.value = null;
};

// ── Remove ────────────────────────────────────────────────────────────────────

const removeItem = (index: number) => {
    const item = imageItems.value[index];
    if (item?.type === "new") {
        URL.revokeObjectURL(item.previewUrl);
    }
    imageItems.value.splice(index, 1);
};

// ── Submit ────────────────────────────────────────────────────────────────────

const submit = (status: PostStatus) => {
    if (props.saving) {
        return;
    }
    if (!form.title || !form.location || !form.imageTakenDate) {
        formError.value = "Title, date, and location are required.";
        return;
    }
    if (imageItems.value.length === 0) {
        formError.value = "At least one image is required.";
        return;
    }
    formError.value = "";
    emit("save", {
        id: props.image?.id,
        title: form.title,
        subTitle: form.subTitle,
        location: form.location,
        imageTakenDate: form.imageTakenDate,
        status,
        imageItems: imageItems.value.map((item) =>
            item.type === "existing"
                ? { type: "existing" as const, cloudLocation: item.cloudLocation }
                : { type: "new" as const, file: item.file },
        ),
    });
};
</script>

<template>
    <Teleport to="body">
        <div
            v-if="open"
            class="fixed inset-0 z-100 flex items-center justify-center p-4"
            @click.self="$emit('close')"
        >
            <div class="absolute inset-0 bg-space-950/70 backdrop-blur-md"></div>

            <div
                class="relative z-10 w-full max-w-5xl bg-space-800 border border-space-700/60 rounded-2xl overflow-hidden shadow-2xl"
            >
                <div class="flex items-center justify-between px-6 py-4 border-b border-space-700/50">
                    <h2 class="text-xl font-semibold text-white">
                        {{ isEditMode ? "Edit Post" : "Add Post" }}
                    </h2>
                    <button
                        class="text-slate-400 hover:text-white transition-colors"
                        @click="$emit('close')"
                    >
                        <MdiClose class="w-6 h-6" />
                    </button>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 max-h-[75vh] overflow-y-auto">
                    <!-- Images section -->
                    <div class="space-y-4">
                        <div class="flex items-center justify-between">
                            <label class="block text-sm font-medium text-slate-300">Images</label>
                            <span class="text-xs text-slate-500">First image is the thumbnail</span>
                        </div>

                        <!-- Draggable image list -->
                        <div v-if="imageItems.length > 0" class="space-y-2">
                            <div
                                v-for="(item, index) in imageItems"
                                :key="item.key"
                                draggable="true"
                                class="flex items-center gap-3 bg-space-900/60 border rounded-lg p-2 cursor-grab active:cursor-grabbing transition-colors select-none"
                                :class="
                                    dragOverIndex === index && dragSrcIndex !== index
                                        ? 'border-nebula-400/70 bg-space-800/80'
                                        : dragSrcIndex === index
                                          ? 'border-space-600/40 opacity-50'
                                          : 'border-space-700/40'
                                "
                                @dragstart="onItemDragstart($event, index)"
                                @dragover="onItemDragover($event, index)"
                                @dragleave="onItemDragleave($event, index)"
                                @drop="onItemDrop($event, index)"
                                @dragend="onItemDragend"
                            >
                                <!-- Drag handle indicator -->
                                <MdiDragVertical
                                    class="w-4 h-4 flex-shrink-0 text-slate-600"
                                    aria-hidden="true"
                                />

                                <!-- Thumbnail preview -->
                                <div
                                    class="w-16 h-16 flex-shrink-0 bg-space-950 rounded overflow-hidden"
                                >
                                    <img
                                        :src="item.previewUrl"
                                        :alt="`Image ${index + 1}`"
                                        class="w-full h-full object-cover"
                                        draggable="false"
                                    />
                                </div>

                                <!-- Label -->
                                <div class="flex-1 min-w-0">
                                    <span class="text-sm text-slate-300 truncate block">
                                        {{
                                            item.type === "new"
                                                ? item.file.name
                                                : `Image ${index + 1}`
                                        }}
                                    </span>
                                    <span
                                        v-if="index === 0"
                                        class="text-xs text-nebula-400"
                                    >Thumbnail</span>
                                </div>

                                <!-- Remove button -->
                                <button
                                    type="button"
                                    class="p-1 text-slate-500 hover:text-red-400 transition-colors flex-shrink-0"
                                    title="Remove"
                                    @click="removeItem(index)"
                                >
                                    <MdiClose class="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <!-- Add images drop zone -->
                        <div
                            class="border-2 border-dashed rounded-xl transition-colors"
                            :class="
                                dropZoneActive
                                    ? 'border-nebula-400 bg-nebula-900/20'
                                    : 'border-space-600 hover:border-nebula-500'
                            "
                            @dragover="onDropZoneDragover"
                            @dragleave="onDropZoneDragleave"
                            @drop="onDropZoneDrop"
                        >
                            <input
                                ref="fileInput"
                                type="file"
                                accept="image/*"
                                multiple
                                class="hidden"
                                @change="handleFilesChange"
                            />
                            <button
                                type="button"
                                class="w-full py-6 flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-slate-300 transition-colors"
                                @click="fileInput?.click()"
                            >
                                <MdiImagePlusOutline class="w-7 h-7" />
                                <span class="text-sm">
                                    {{ dropZoneActive ? "Drop to add" : "Click or drop images here" }}
                                </span>
                            </button>
                        </div>
                    </div>

                    <!-- Metadata fields -->
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-slate-300 mb-2">Title</label>
                            <input
                                v-model="form.title"
                                type="text"
                                class="w-full bg-space-900/80 border border-space-600/60 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-nebula-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-300 mb-2">Date</label>
                            <input
                                v-model="form.imageTakenDate"
                                type="date"
                                class="w-full bg-space-900/80 border border-space-600/60 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-nebula-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-300 mb-2"
                                >Location</label
                            >
                            <input
                                v-model="form.location"
                                type="text"
                                class="w-full bg-space-900/80 border border-space-600/60 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-nebula-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-300 mb-2"
                                >Description</label
                            >
                            <textarea
                                v-model="form.subTitle"
                                rows="8"
                                class="w-full bg-space-900/80 border border-space-600/60 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-nebula-500 transition-colors resize-y"
                            />
                        </div>
                    </div>
                </div>

                <div
                    class="px-6 py-4 border-t border-space-700/50 flex items-center justify-end gap-3 bg-space-900/40"
                >
                    <p v-if="formError" class="mr-auto text-sm text-red-400">
                        {{ formError }}
                    </p>
                    <button
                        type="button"
                        class="px-4 py-2 bg-space-700 hover:bg-space-600 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
                        @click="$emit('close')"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        :disabled="saving"
                        class="px-4 py-2 border border-nebula-500/60 rounded-lg text-nebula-300 hover:text-white hover:bg-nebula-600/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        @click="submit('draft')"
                    >
                        Save as Draft
                    </button>
                    <button
                        type="button"
                        :disabled="saving"
                        class="px-4 py-2 bg-nebula-600 hover:bg-nebula-500 rounded-lg text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        @click="submit('published')"
                    >
                        Publish Post
                    </button>
                </div>
            </div>
        </div>
    </Teleport>
</template>
