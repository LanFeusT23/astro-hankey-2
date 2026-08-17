<script setup lang="ts">
import type { AstroImage } from "~/types/image";
import type { AdminPostSavePayload } from "~/components/AdminPostModal.vue";

definePageMeta({ middleware: "auth" });

useSeoMeta({ title: "Admin" });

const { user, signOut } = useAuth();
const { sortedImages, fetchImages, createImage, updateImage, uploadImage } = useImages();

const isPostModalOpen = ref(false);
const selectedImage = ref<AstroImage | null>(null);
const savingPost = ref(false);

const userInitial = computed(() => {
    const name = user.value?.displayName || user.value?.email || "A";
    return name.charAt(0).toUpperCase();
});

const openCreatePostModal = () => {
    selectedImage.value = null;
    isPostModalOpen.value = true;
};

const openEditPostModal = (image: AstroImage) => {
    selectedImage.value = image;
    isPostModalOpen.value = true;
};

const closePostModal = () => {
    isPostModalOpen.value = false;
    selectedImage.value = null;
};

const handleSavePost = async (payload: AdminPostSavePayload) => {
    if (!payload.title || !payload.location || !payload.imageTakenDate) {
        return;
    }
    savingPost.value = true;
    try {
        const imageTakenDate = new Date(payload.imageTakenDate);

        // Resolve all image items: upload new files, keep existing cloudLocations
        const resolvedImages: { cloudLocation: string; thumbnailUrl?: string }[] = [];
        for (const item of payload.imageItems) {
            if (item.type === "existing") {
                resolvedImages.push({ cloudLocation: item.cloudLocation, thumbnailUrl: item.thumbnailUrl });
            } else {
                const urls = await uploadImage(item.file, imageTakenDate, payload.id);
                resolvedImages.push(urls);
            }
        }

        // Thumbnail is from the first image
        const thumbnailUrl =
            resolvedImages[0]?.thumbnailUrl ?? resolvedImages[0]?.cloudLocation ?? "";

        const imagesArray = resolvedImages.map((r) => ({
            cloudLocation: r.cloudLocation,
            isMain: false,
        }));
        if (imagesArray[0]) {
            imagesArray[0].isMain = true;
        }

        if (payload.id) {
            const updates: Partial<Omit<AstroImage, "id">> = {
                title: payload.title,
                subTitle: payload.subTitle || undefined,
                location: payload.location,
                imageTakenDate,
                status: payload.status,
                thumbnail: thumbnailUrl,
                images: imagesArray,
            };
            await updateImage(payload.id, updates);
        } else {
            await createImage({
                title: payload.title,
                subTitle: payload.subTitle || undefined,
                location: payload.location,
                imageTakenDate,
                status: payload.status,
                dateCreated: new Date(),
                dontContainImage: false,
                thumbnail: thumbnailUrl,
                images: imagesArray,
            });
        }
        closePostModal();
    } finally {
        savingPost.value = false;
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
    <div class="min-h-screen">
        <AppNav />

        <main class="pt-24 pb-16 px-4">
            <div class="max-w-6xl mx-auto">
                <!-- Header -->
                <div class="flex items-center justify-between mb-8 flex-wrap gap-2">
                    <div>
                        <h1 class="text-3xl font-display font-bold text-white">Admin Dashboard</h1>
                        <p class="text-slate-400 mt-1">Manage your astrophotography collection</p>
                    </div>
                    <div class="flex items-center gap-4">
                        <button
                            @click="openCreatePostModal"
                            class="px-4 py-2.5 bg-nebula-600 hover:bg-nebula-500 text-white rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2"
                        >
                            <MdiPlus class="w-4 h-4" />
                            Add Post
                        </button>
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

                <!-- Image list -->
                <AdminImageList :images="sortedImages" @edit="openEditPostModal" @deleted="fetchImages" />
            </div>
        </main>

        <AdminPostModal
            :open="isPostModalOpen"
            :image="selectedImage"
            :saving="savingPost"
            @close="closePostModal"
            @save="handleSavePost"
        />
    </div>
</template>
