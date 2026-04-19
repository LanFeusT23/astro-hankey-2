<script setup lang="ts">
definePageMeta({ middleware: "auth" });

useSeoMeta({ title: "Admin — Jonathan Hankey Astrophotography" });

const { user, signOut } = useAuth();
const { images, fetchImages, createImage } = useImages();

const fileInput = ref<HTMLInputElement | null>(null);
const uploading = ref(false);

const uploadForm = reactive({
    title: "",
    subtitle: "",
    location: "",
    imageTakenDate: "",
    file: null as File | null,
});

const userInitial = computed(() => {
    const name = user.value?.displayName || user.value?.email || "A";
    return name.charAt(0).toUpperCase();
});

const handleFileChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    uploadForm.file = target.files?.[0] ?? null;
};

const handleDrop = (e: DragEvent) => {
    uploadForm.file = e.dataTransfer?.files?.[0] ?? null;
};

const handleUpload = async () => {
    if (!uploadForm.title || !uploadForm.location || !uploadForm.imageTakenDate) {
        return;
    }
    uploading.value = true;
    try {
        const { getImageRepository } = await import("~/repositories/index");
        const repo = getImageRepository();
        let cloudLocation = `https://picsum.photos/seed/${Date.now()}/1920/1280`;
        let thumbnailUrl: string;
        if (uploadForm.file) {
            const urls = await repo.uploadImage(
                uploadForm.file,
                new Date(uploadForm.imageTakenDate),
            );
            cloudLocation = urls.cloudLocation;
            thumbnailUrl = urls.thumbnailUrl;
        } else {
            thumbnailUrl = `https://picsum.photos/seed/${Date.now()}/600/400`;
        }
        await createImage({
            title: uploadForm.title,
            subtitle: uploadForm.subtitle || undefined,
            location: uploadForm.location,
            imageTakenDate: new Date(uploadForm.imageTakenDate),
            dateCreated: new Date(),
            dontContainImage: false,
            thumbnail: thumbnailUrl,
            images: [{ cloudLocation, isMain: true }],
        });
        uploadForm.title = "";
        uploadForm.subtitle = "";
        uploadForm.location = "";
        uploadForm.imageTakenDate = "";
        uploadForm.file = null;
        if (fileInput.value) {
            fileInput.value.value = "";
        }
    } finally {
        uploading.value = false;
    }
};

const handleSignOut = async () => {
    await signOut();
    await navigateTo("/");
};

onMounted(() => {
    fetchImages();
});
</script>

<template>
    <div class="min-h-screen bg-space-950">
        <AppNav />

        <main class="pt-24 pb-16 px-4">
            <div class="max-w-6xl mx-auto">
                <!-- Header -->
                <div class="flex items-center justify-between mb-8">
                    <div>
                        <h1 class="text-3xl font-display font-bold text-white">Admin Dashboard</h1>
                        <p class="text-slate-400 mt-1">Manage your astrophotography collection</p>
                    </div>
                    <div class="flex items-center gap-4">
                        <div
                            class="flex items-center gap-3 bg-space-800/60 border border-space-700/50 rounded-full px-4 py-2"
                        >
                            <div
                                class="w-8 h-8 rounded-full bg-nebula-600 flex items-center justify-center text-white text-sm font-medium"
                            >
                                {{ userInitial }}
                            </div>
                            <span class="text-slate-300 text-sm">{{
                                user?.displayName || user?.email
                            }}</span>
                        </div>
                        <button
                            @click="handleSignOut"
                            class="px-4 py-2 border border-space-600/50 hover:border-red-500/50 text-slate-400 hover:text-red-400 rounded-full text-sm transition-all duration-200"
                        >
                            Sign out
                        </button>
                    </div>
                </div>

                <!-- Upload new image form -->
                <div
                    class="bg-space-800/40 border border-space-700/40 rounded-2xl p-6 mb-8 backdrop-blur-sm"
                >
                    <h2 class="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                        <MdiPlus class="w-5 h-5 text-nebula-400" />
                        Upload New Image
                    </h2>
                    <form
                        @submit.prevent="handleUpload"
                        class="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium text-slate-300 mb-2"
                                >Image File</label
                            >
                            <div
                                class="border-2 border-dashed border-space-600 hover:border-nebula-500 rounded-xl p-8 text-center cursor-pointer transition-colors"
                                @click="fileInput?.click()"
                                @dragover.prevent
                                @drop.prevent="handleDrop"
                            >
                                <input
                                    ref="fileInput"
                                    type="file"
                                    accept="image/*"
                                    class="hidden"
                                    @change="handleFileChange"
                                />
                                <MdiFileImageOutline class="w-10 h-10 mx-auto text-slate-500 mb-3" />
                                <p class="text-slate-400 text-sm">
                                    {{
                                        uploadForm.file
                                            ? uploadForm.file.name
                                            : "Click or drag to upload image"
                                    }}
                                </p>
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-300 mb-2"
                                >Title</label
                            >
                            <input
                                v-model="uploadForm.title"
                                type="text"
                                required
                                placeholder="e.g. Andromeda Galaxy (M31)"
                                class="w-full bg-space-900/80 border border-space-600/60 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-nebula-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-300 mb-2"
                                >Location</label
                            >
                            <input
                                v-model="uploadForm.location"
                                type="text"
                                required
                                placeholder="e.g. Rural Colorado"
                                class="w-full bg-space-900/80 border border-space-600/60 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-nebula-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-300 mb-2"
                                >Image Taken Date</label
                            >
                            <input
                                v-model="uploadForm.imageTakenDate"
                                type="date"
                                required
                                class="w-full bg-space-900/80 border border-space-600/60 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-nebula-500 transition-colors"
                            />
                        </div>
                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium text-slate-300 mb-2"
                                >Subtitle <span class="text-slate-500">(optional)</span></label
                            >
                            <textarea
                                v-model="uploadForm.subtitle"
                                rows="3"
                                placeholder="Describe this image..."
                                class="w-full bg-space-900/80 border border-space-600/60 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-nebula-500 transition-colors resize-none"
                            />
                        </div>
                        <div class="md:col-span-2 flex justify-end">
                            <button
                                type="submit"
                                :disabled="uploading"
                                class="px-6 py-2.5 bg-nebula-600 hover:bg-nebula-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                            >
                                <MdiLoading v-if="uploading" class="w-4 h-4 animate-spin" />
                                {{ uploading ? "Uploading..." : "Upload Image" }}
                            </button>
                        </div>
                    </form>
                </div>

                <!-- Image list -->
                <AdminImageList :images="images" @updated="fetchImages" @deleted="fetchImages" />
            </div>
        </main>
    </div>
</template>
