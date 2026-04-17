<script setup lang="ts">
const links = [
  { to: "/", label: "Home" },
  { to: "/gallery", label: "Gallery" },
  { to: "/admin", label: "Admin" },
];
</script>

<template>
  <nav class="fixed top-0 left-0 right-0 z-50 px-4 py-4">
    <div class="max-w-7xl mx-auto">
      <div
        class="bg-space-900/80 border border-space-700/40 rounded-full px-6 py-3 backdrop-blur-md flex items-center justify-between"
      >
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-3 group">
          <div
            class="w-8 h-8 rounded-full bg-nebula-600/20 border border-nebula-500/40 flex items-center justify-center group-hover:border-nebula-400/60 transition-colors"
          >
            <svg class="w-4 h-4 text-nebula-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M10 2a8 8 0 100 16A8 8 0 0010 2zm0 14a6 6 0 110-12 6 6 0 010 12zm0-9a3 3 0 100 6 3 3 0 000-6z"
              />
            </svg>
          </div>
          <span class="font-display font-semibold text-white text-sm tracking-wide"
            >Jonathan Hankey</span
          >
        </NuxtLink>

        <!-- Links -->
        <div class="flex items-center gap-1">
          <NuxtLink
            v-for="link in links"
            :key="link.to"
            :to="link.to"
            class="px-4 py-1.5 rounded-full text-sm text-slate-400 hover:text-white hover:bg-space-700/60 transition-all duration-200"
            active-class="text-white bg-space-700/60"
          >
            {{ link.label }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </nav>
</template>

