<script setup lang="ts">
const publicLinks = [
    { to: "/gallery", label: "Gallery" },
];

const { isAuthenticated, isAdmin } = useAuth();
</script>

<template>
    <nav class="fixed top-0 left-0 right-0 z-50 px-4 py-4">
        <div class="max-w-7xl mx-auto">
            <div
                class="rounded-full p-px bg-[linear-gradient(120deg,rgba(255,255,255,0.55)_0%,rgba(181,204,255,0.32)_45%,rgba(255,255,255,0.14)_100%)]"
            >
                <div
                    class="rounded-full px-6 py-3 bg-space-700/45 backdrop-blur-md flex items-center justify-between"
                >
                    <!-- Logo -->
                    <NuxtLink to="/" class="flex items-center gap-3 group">
                        <div
                            class="w-8 h-8 rounded-full bg-nebula-600/20 border border-nebula-500/40 flex items-center justify-center group-hover:border-nebula-400/60 transition-colors"
                        >
                            <MdiOrbit
                                class="w-4 h-4 animate-spin text-nebula-400"
                                style="--animate-spin: spin 8s linear infinite"
                            />
                        </div>
                        <span class="font-display font-semibold text-white text-sm tracking-wide"
                            >Jonathan Hankey</span
                        >
                    </NuxtLink>

                    <!-- Links -->
                    <div class="flex items-center gap-1">
                        <NuxtLink
                            v-for="link in publicLinks"
                            :key="link.to"
                            :to="link.to"
                            class="px-4 py-1.5 rounded-full text-sm text-slate-200 hover:text-white hover:bg-space-500/45 transition-all duration-200"
                            active-class="text-white bg-space-500/45"
                        >
                            {{ link.label }}
                        </NuxtLink>
                        <!-- Admin users see the Admin link; unauthenticated users see Login;
                             authenticated non-Admin users see neither (intentional) -->
                        <NuxtLink
                            v-if="isAdmin"
                            to="/admin"
                            class="px-4 py-1.5 rounded-full text-sm text-slate-200 hover:text-white hover:bg-space-500/45 transition-all duration-200"
                            active-class="text-white bg-space-500/45"
                        >
                            Admin
                        </NuxtLink>
                        <NuxtLink
                            v-if="!isAdmin && !isAuthenticated"
                            to="/admin/login"
                            class="px-4 py-1.5 rounded-full text-sm text-slate-200 hover:text-white hover:bg-space-500/45 transition-all duration-200"
                            active-class="text-white bg-space-500/45"
                        >
                            Login
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>
    </nav>
</template>
