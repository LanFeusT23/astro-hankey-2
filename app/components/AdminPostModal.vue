<script setup lang="ts">
import type { AstroImage } from "~/types/image";

type PostStatus = AstroImage["status"];

type ImageItem =
    | { key: string; type: "existing"; cloudLocation: string; previewUrl: string }
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
    imageItems: Array<{ type: "existing"; cloudLocation: string } | { type: "new"; file: File }>;
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
    imageItems.value = (props.image?.images ?? []).map((img) => ({
        key: nextKey(),
        type: "existing" as const,
        cloudLocation: img.cloudLocation,
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

const handleFilesChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const files = Array.from(target.files ?? []);
    for (const file of files) {
        imageItems.value.push({
            key: nextKey(),
            type: "new",
            file,
            previewUrl: URL.createObjectURL(file),
        });
    }
    if (fileInput.value) {
        fileInput.value.value = "";
    }
};

const removeItem = (index: number) => {
    const item = imageItems.value[index];
    if (item?.type === "new") {
        URL.revokeObjectURL(item.previewUrl);
    }
    imageItems.value.splice(index, 1);
};

const moveUp = (index: number) => {
    if (index === 0) {
        return;
    }
    const arr = imageItems.value;
    [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
};

const moveDown = (index: number) => {
    if (index >= imageItems.value.length - 1) {
        return;
    }
    const arr = imageItems.value;
    [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
};

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

                        <!-- Image list -->
                        <div v-if="imageItems.length > 0" class="space-y-2">
                            <div
                                v-for="(item, index) in imageItems"
                                :key="item.key"
                                class="flex items-center gap-3 bg-space-900/60 border border-space-700/40 rounded-lg p-2"
                            >
                                <!-- Thumbnail preview -->
                                <div
                                    class="w-16 h-16 flex-shrink-0 bg-space-950 rounded overflow-hidden"
                                >
                                    <img
                                        :src="item.previewUrl"
                                        :alt="`Image ${index + 1}`"
                                        class="w-full h-full object-cover"
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

                                <!-- Reorder + remove -->
                                <div class="flex items-center gap-1">
                                    <button
                                        type="button"
                                        :disabled="index === 0"
                                        class="p-1 text-slate-500 hover:text-white disabled:opacity-30 transition-colors"
                                        title="Move up"
                                        @click="moveUp(index)"
                                    >
                                        <MdiChevronUp class="w-4 h-4" />
                                    </button>
                                    <button
                                        type="button"
                                        :disabled="index === imageItems.length - 1"
                                        class="p-1 text-slate-500 hover:text-white disabled:opacity-30 transition-colors"
                                        title="Move down"
                                        @click="moveDown(index)"
                                    >
                                        <MdiChevronDown class="w-4 h-4" />
                                    </button>
                                    <button
                                        type="button"
                                        class="p-1 text-slate-500 hover:text-red-400 transition-colors"
                                        title="Remove"
                                        @click="removeItem(index)"
                                    >
                                        <MdiClose class="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Add image button -->
                        <div
                            class="border-2 border-dashed border-space-600 hover:border-nebula-500 rounded-xl transition-colors"
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
                                <MdiPlus class="w-7 h-7" />
                                <span class="text-sm">Add images</span>
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
                        class="px-4 py-2 border border-space-600 rounded-lg text-slate-300 hover:text-white hover:border-space-500 transition-colors"
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
