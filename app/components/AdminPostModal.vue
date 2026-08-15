<script setup lang="ts">
import type { AstroImage } from "~/types/image";

type PostStatus = AstroImage["status"];

type SavePayload = {
    id?: string;
    title: string;
    subTitle: string;
    location: string;
    imageTakenDate: string;
    status: PostStatus;
    file: File | null;
};

const props = defineProps<{
    image?: AstroImage | null;
    open: boolean;
    saving?: boolean;
}>();

const emit = defineEmits<{ close: []; save: [payload: SavePayload] }>();

const { resolveUrl } = useImageUrl();
const { renderMarkdown } = useMarkdownRenderer();

const fileInput = ref<HTMLInputElement | null>(null);
const showMarkdownPreview = ref(false);
const filePreviewUrl = ref<string | null>(null);
const formError = ref("");

const form = reactive({
    title: "",
    subTitle: "",
    location: "",
    imageTakenDate: "",
    file: null as File | null,
    currentImageUrl: "",
});

const isEditMode = computed(() => Boolean(props.image?.id));
const renderedDescription = computed(() => renderMarkdown(form.subTitle));
const imagePreviewSrc = computed(() => filePreviewUrl.value || form.currentImageUrl || "");

const resetPreview = () => {
    if (filePreviewUrl.value) {
        URL.revokeObjectURL(filePreviewUrl.value);
        filePreviewUrl.value = null;
    }
};

const resetForm = () => {
    form.title = props.image?.title ?? "";
    form.subTitle = props.image?.subTitle ?? "";
    form.location = props.image?.location ?? "";
    form.imageTakenDate = props.image
        ? props.image.imageTakenDate.toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10);
    form.file = null;
    form.currentImageUrl = resolveUrl(props.image?.thumbnail) ?? "";
    showMarkdownPreview.value = false;
    formError.value = "";
    if (fileInput.value) {
        fileInput.value.value = "";
    }
};

watch(
    () => [props.image, props.open],
    () => {
        resetPreview();
        if (props.open) {
            resetForm();
        }
    },
    { immediate: true },
);

onUnmounted(() => {
    resetPreview();
});

const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0] ?? null;
    form.file = file;
    resetPreview();
    if (file) {
        filePreviewUrl.value = URL.createObjectURL(file);
    }
};

const submit = (status: PostStatus) => {
    if (props.saving) {
        return;
    }
    if (!form.title || !form.location || !form.imageTakenDate) {
        formError.value = "Title, date, and location are required.";
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
        file: form.file,
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
                    <div class="space-y-4">
                        <label class="block text-sm font-medium text-slate-300">Image</label>
                        <div
                            class="border-2 border-dashed border-space-600 hover:border-nebula-500 rounded-xl p-4 text-center transition-colors"
                        >
                            <input
                                ref="fileInput"
                                type="file"
                                accept="image/*"
                                class="hidden"
                                @change="handleFileChange"
                            />
                            <button
                                type="button"
                                class="w-full min-h-64 bg-space-900/70 rounded-lg overflow-hidden flex items-center justify-center"
                                @click="fileInput?.click()"
                            >
                                <img
                                    v-if="imagePreviewSrc"
                                    :src="imagePreviewSrc"
                                    alt="Post preview"
                                    class="w-full h-full object-cover"
                                />
                                <div v-else class="text-slate-500 flex flex-col items-center gap-2">
                                    <MdiFileImageOutline class="w-10 h-10" />
                                    <span>Select image</span>
                                </div>
                            </button>
                        </div>
                    </div>

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
                            <div class="flex items-center justify-between mb-2">
                                <label class="block text-sm font-medium text-slate-300"
                                    >Description</label
                                >
                                <button
                                    type="button"
                                    class="text-xs px-2 py-1 rounded border border-space-600 text-slate-300 hover:border-nebula-500 hover:text-white transition-colors"
                                    @click="showMarkdownPreview = !showMarkdownPreview"
                                >
                                    {{ showMarkdownPreview ? "Edit Markdown" : "Preview Markdown" }}
                                </button>
                            </div>
                            <textarea
                                v-if="!showMarkdownPreview"
                                v-model="form.subTitle"
                                rows="8"
                                class="w-full bg-space-900/80 border border-space-600/60 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-nebula-500 transition-colors resize-y"
                            />
                            <div
                                v-else
                                class="min-h-44 bg-space-900/80 border border-space-600/60 rounded-lg px-4 py-2.5 text-slate-300 markdown-body"
                            >
                                <div v-if="renderedDescription" v-html="renderedDescription"></div>
                                <p v-else>No markdown content yet.</p>
                            </div>
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
