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
              <span class="text-slate-300 text-sm">{{ user?.displayName || user?.email }}</span>
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
            <svg
              class="w-5 h-5 text-nebula-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Upload New Image
          </h2>
          <form @submit.prevent="handleUpload" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-slate-300 mb-2">Image File</label>
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
                <svg
                  class="w-10 h-10 mx-auto text-slate-500 mb-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p class="text-slate-400 text-sm">
                  {{ uploadForm.file ? uploadForm.file.name : "Click or drag to upload image" }}
                </p>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Title</label>
              <input
                v-model="uploadForm.title"
                type="text"
                required
                placeholder="e.g. Andromeda Galaxy (M31)"
                class="w-full bg-space-900/80 border border-space-600/60 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-nebula-500 transition-colors"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Date Taken</label>
              <input
                v-model="uploadForm.dateTaken"
                type="date"
                required
                class="w-full bg-space-900/80 border border-space-600/60 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-nebula-500 transition-colors"
              />
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-slate-300 mb-2">Description</label>
              <textarea
                v-model="uploadForm.description"
                rows="3"
                required
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
                <svg v-if="uploading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
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

<script setup lang="ts">
definePageMeta({ middleware: "auth" });

useSeoMeta({ title: "Admin — Jonathan Hankey Astrophotography" });

const { user, signOut } = useAuth();
const { images, fetchImages, createImage } = useImages();

const fileInput = ref<HTMLInputElement | null>(null);
const uploading = ref(false);

const uploadForm = reactive({
  title: "",
  description: "",
  dateTaken: "",
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
  if (!uploadForm.title || !uploadForm.description || !uploadForm.dateTaken) return;
  uploading.value = true;
  try {
    const { getImageRepository } = await import("~/repositories/index");
    const repo = getImageRepository();
    let thumbnailUrl = `https://picsum.photos/seed/${Date.now()}/600/400`;
    let fullUrl = `https://picsum.photos/seed/${Date.now()}/1920/1280`;
    if (uploadForm.file) {
      const urls = await repo.uploadImage(uploadForm.file);
      thumbnailUrl = urls.thumbnailUrl;
      fullUrl = urls.fullUrl;
    }
    await createImage({
      title: uploadForm.title,
      description: uploadForm.description,
      dateTaken: uploadForm.dateTaken,
      thumbnailUrl,
      fullUrl,
    });
    uploadForm.title = "";
    uploadForm.description = "";
    uploadForm.dateTaken = "";
    uploadForm.file = null;
    if (fileInput.value) fileInput.value.value = "";
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
