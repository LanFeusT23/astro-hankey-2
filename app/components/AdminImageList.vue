<script setup lang="ts">
import type { AstroImage } from "~/types/image";

const props = defineProps<{ images: AstroImage[] }>();
const emit = defineEmits<{ updated: []; deleted: [] }>();

const { updateImage, deleteImage } = useImages();

const editingId = ref<string | null>(null);
const editForm = reactive({ title: "", subtitle: "", location: "" });

const formatDate = (date: Date) =>
  date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

const startEdit = (image: AstroImage) => {
  editingId.value = image.id;
  editForm.title = image.title;
  editForm.subtitle = image.subtitle ?? "";
  editForm.location = image.location;
};

const cancelEdit = () => {
  editingId.value = null;
};

const saveEdit = async (id: string) => {
  await updateImage(id, {
    title: editForm.title,
    subtitle: editForm.subtitle || undefined,
    location: editForm.location,
  });
  editingId.value = null;
  emit("updated");
};

const handleDelete = async (id: string) => {
  if (!confirm("Delete this image?")) return;
  await deleteImage(id);
  emit("deleted");
};
</script>

<template>
  <div class="bg-space-800/40 border border-space-700/40 rounded-2xl p-6 backdrop-blur-sm">
    <h2 class="text-xl font-semibold text-white mb-6 flex items-center gap-2">
      <svg class="w-5 h-5 text-nebula-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 6h16M4 10h16M4 14h16M4 18h16"
        />
      </svg>
      Current Images ({{ images.length }})
    </h2>

    <div v-if="images.length === 0" class="text-center py-12 text-slate-500">
      No images yet. Upload your first image above.
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="image in images"
        :key="image.id"
        class="flex gap-4 p-4 bg-space-900/50 border border-space-700/30 rounded-xl group hover:border-space-600/50 transition-colors"
      >
        <!-- Thumbnail -->
        <img
          :src="image.thumbnail"
          :alt="image.title"
          class="w-20 h-14 object-cover rounded-lg flex-shrink-0"
        />

        <!-- Info / Edit -->
        <div class="flex-1 min-w-0">
          <div v-if="editingId !== image.id">
            <h3 class="font-medium text-white truncate">{{ image.title }}</h3>
            <p class="text-slate-400 text-sm mt-0.5">{{ formatDate(image.imageTakenDate) }}</p>
            <p class="text-slate-500 text-xs mt-1 line-clamp-1">{{ image.subtitle }}</p>
          </div>
          <div v-else class="space-y-2">
            <input
              v-model="editForm.title"
              type="text"
              class="w-full bg-space-800 border border-space-600 rounded px-3 py-1.5 text-white text-sm focus:outline-none focus:border-nebula-500"
              placeholder="Title"
            />
            <input
              v-model="editForm.location"
              type="text"
              class="w-full bg-space-800 border border-space-600 rounded px-3 py-1.5 text-white text-sm focus:outline-none focus:border-nebula-500"
              placeholder="Location"
            />
            <textarea
              v-model="editForm.subtitle"
              rows="2"
              class="w-full bg-space-800 border border-space-600 rounded px-3 py-1.5 text-white text-sm focus:outline-none focus:border-nebula-500 resize-none"
              placeholder="Subtitle"
            />
          </div>
        </div>

        <!-- Actions -->
        <div class="flex flex-col gap-2 flex-shrink-0">
          <template v-if="editingId !== image.id">
            <button
              @click="startEdit(image)"
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
          </template>
          <template v-else>
            <button
              @click="saveEdit(image.id)"
              class="px-3 py-1.5 text-xs bg-nebula-600/80 hover:bg-nebula-500/80 text-white rounded-lg transition-colors"
            >
              Save
            </button>
            <button
              @click="cancelEdit"
              class="px-3 py-1.5 text-xs bg-space-700/60 hover:bg-space-600/60 text-slate-300 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

