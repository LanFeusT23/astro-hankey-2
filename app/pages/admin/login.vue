<template>
  <div class="min-h-screen bg-space-950 flex items-center justify-center relative overflow-hidden">
    <!-- Stars -->
    <div class="absolute inset-0">
      <div
        v-for="star in stars"
        :key="star.id"
        class="absolute rounded-full bg-white animate-twinkle"
        :style="{
          left: star.x + '%',
          top: star.y + '%',
          width: star.size + 'px',
          height: star.size + 'px',
          opacity: star.opacity,
          animationDelay: star.delay + 's',
        }"
      />
    </div>

    <div class="relative z-10 w-full max-w-md px-4">
      <div class="bg-space-800/60 border border-space-700/50 rounded-2xl p-8 backdrop-blur-sm text-center">
        <!-- Logo -->
        <div class="w-16 h-16 mx-auto mb-6 rounded-full bg-nebula-600/20 border border-nebula-500/30 flex items-center justify-center">
          <svg class="w-8 h-8 text-nebula-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </div>

        <h1 class="text-2xl font-display font-bold text-white mb-2">Admin Access</h1>
        <p class="text-slate-400 text-sm mb-8">Sign in to manage your astrophotography collection</p>

        <div v-if="error" class="mb-4 p-3 bg-red-900/30 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {{ error }}
        </div>

        <button
          @click="handleSignIn"
          :disabled="loading"
          class="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed text-slate-800 font-medium rounded-xl transition-colors"
        >
          <svg v-if="loading" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          <svg v-else viewBox="0 0 24 24" class="w-5 h-5">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {{ loading ? 'Signing in...' : 'Sign in with Google' }}
        </button>

        <p class="mt-6 text-xs text-slate-500">
          Access restricted to authorized administrators only.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({ title: 'Admin Login — Jonathan Hankey Astrophotography' })

const { signInWithGoogle, loading, error, isAuthenticated } = useAuth()

const stars = Array.from({ length: 80 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2 + 0.5,
  opacity: Math.random() * 0.6 + 0.2,
  delay: Math.random() * 4,
}))

const handleSignIn = async () => {
  try {
    await signInWithGoogle()
    await navigateTo('/admin')
  } catch {
    // error is set in composable
  }
}

// Redirect if already logged in
watchEffect(() => {
  if (isAuthenticated.value) {
    navigateTo('/admin')
  }
})
</script>
