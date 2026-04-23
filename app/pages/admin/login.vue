<script setup lang="ts">
useSeoMeta({ title: "Admin Login — Jonathan Hankey Astrophotography" });

const { signInWithGoogle, signOut, loading, error, isAuthenticated, isAdmin } = useAuth();

const handleSignIn = async () => {
    try {
        await signInWithGoogle();
        if (isAuthenticated.value && isAdmin.value) {
            await navigateTo("/admin");
            return;
        }

        await signOut();
        error.value = "This account is not authorized for admin access.";
    } catch {
        // error is set in composable
    }
};

// Redirect if already logged in
watchEffect(() => {
    if (isAuthenticated.value && isAdmin.value) {
        navigateTo("/admin");
    }
});
</script>

<template>
    <div class="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div class="relative z-10 w-full max-w-md px-4">
            <div
                class="bg-space-800/60 border border-space-700/50 rounded-2xl p-8 backdrop-blur-sm text-center"
            >
                <!-- Logo -->
                <div
                    class="w-16 h-16 mx-auto mb-6 rounded-full bg-nebula-600/20 border border-nebula-500/30 flex items-center justify-center"
                >
                    <MdiShieldKeyOutline class="w-8 h-8 text-nebula-400" />
                </div>

                <h1 class="text-2xl font-display font-bold text-white mb-2">Admin Access</h1>
                <p class="text-slate-400 text-sm mb-8">
                    Sign in to manage your astrophotography collection
                </p>

                <div
                    v-if="error"
                    class="mb-4 p-3 bg-red-900/30 border border-red-500/30 rounded-lg text-red-400 text-sm"
                >
                    {{ error }}
                </div>

                <button
                    @click="handleSignIn"
                    :disabled="loading"
                    class="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed text-slate-800 font-medium rounded-xl transition-colors"
                >
                    <MdiLoading v-if="loading" class="w-5 h-5 animate-spin" />
                    <MdiGoogle v-else class="w-5 h-5" />
                    {{ loading ? "Signing in..." : "Sign in with Google" }}
                </button>

                <p class="mt-6 text-xs text-slate-500">
                    Access restricted to authorized administrators only.
                </p>
            </div>
        </div>
    </div>
</template>
