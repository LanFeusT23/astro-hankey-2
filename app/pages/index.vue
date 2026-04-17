<script setup lang="ts">
useSeoMeta({
  title: "Jonathan Hankey — Astrophotography",
  description:
    "Deep sky astrophotography by Jonathan Hankey. Nebulae, galaxies, and star clusters captured from dark skies.",
});

const stats = [
  { value: "200+", label: "Hours of Integration" },
  { value: "50+", label: "Deep Sky Objects" },
  { value: "10+", label: "Years Experience" },
  { value: "6", label: "Featured Images" },
];

const stars = Array.from({ length: 150 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2.5 + 0.5,
  opacity: Math.random() * 0.7 + 0.3,
  delay: Math.random() * 4,
  duration: Math.random() * 3 + 2,
}));
</script>

<template>
  <div class="relative min-h-screen bg-space-950 overflow-hidden">
    <!-- Star field background -->
    <div class="absolute inset-0 overflow-hidden">
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
          animationDuration: star.duration + 's',
        }"
      />
    </div>

    <!-- Hero image overlay -->
    <div
      class="absolute inset-0 bg-cover bg-center bg-no-repeat"
      style="
        background-image: url(&quot;https://picsum.photos/seed/hero-space/1920/1080&quot;);
        opacity: 0.3;
      "
    />

    <!-- Gradient overlays -->
    <div class="absolute inset-0 bg-gradient-to-b from-space-950/60 via-transparent to-space-950" />
    <div
      class="absolute inset-0 bg-gradient-to-r from-space-950/40 via-transparent to-space-950/40"
    />

    <!-- Navigation -->
    <AppNav />

    <!-- Hero content -->
    <div
      class="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center"
    >
      <div class="space-y-6 max-w-4xl mx-auto">
        <!-- Decorative line -->
        <div class="animate-fade-in-up flex items-center justify-center gap-4 mb-8">
          <div class="h-px w-16 bg-gradient-to-r from-transparent to-nebula-400"></div>
          <span class="text-nebula-400 text-sm uppercase tracking-[0.3em] font-light"
            >Est. 2024</span
          >
          <div class="h-px w-16 bg-gradient-to-l from-transparent to-nebula-400"></div>
        </div>

        <!-- Main title -->
        <h1
          class="animate-shimmer font-display text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight leading-none"
        >
          Jonathan Hankey
        </h1>

        <!-- Subtitle -->
        <p
          class="animate-fade-in-up-delay text-xl md:text-3xl lg:text-4xl font-light tracking-[0.2em] uppercase text-star-400"
        >
          Astrophotography
        </p>

        <!-- Description -->
        <p
          class="animate-fade-in-up-delay-2 text-slate-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mt-6"
        >
          Capturing the universe, one photon at a time. Deep sky objects, nebulae, and galaxies from
          dark skies across the American West.
        </p>

        <!-- CTA button -->
        <div
          class="animate-fade-in-up-delay-2 flex flex-col sm:flex-row gap-4 justify-center mt-10"
        >
          <NuxtLink
            to="/gallery"
            class="group relative px-8 py-4 bg-nebula-600 hover:bg-nebula-500 text-white font-medium rounded-full transition-all duration-300 overflow-hidden"
          >
            <span class="relative z-10 flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              View Gallery
            </span>
            <div
              class="absolute inset-0 bg-gradient-to-r from-nebula-600 to-star-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
          </NuxtLink>
          <a
            href="#about"
            class="px-8 py-4 border border-nebula-500/50 hover:border-nebula-400 text-nebula-300 hover:text-nebula-200 font-medium rounded-full transition-all duration-300"
          >
            Learn More
          </a>
        </div>
      </div>

      <!-- Scroll indicator -->
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg
          class="w-6 h-6 text-nebula-400/60"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>

    <!-- About section -->
    <section id="about" class="relative z-10 py-24 px-4">
      <div class="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div class="space-y-6">
          <h2 class="text-3xl md:text-4xl font-display font-bold text-white">
            Exploring the <span class="text-nebula-400">Cosmos</span>
          </h2>
          <p class="text-slate-400 leading-relaxed">
            With over a decade of astrophotography experience, I specialize in capturing the
            breathtaking beauty of deep sky objects — from glowing nebulae to distant galaxies
            millions of light-years away.
          </p>
          <p class="text-slate-400 leading-relaxed">
            Each image represents hours of careful data collection, precise tracking, and meticulous
            processing to reveal details invisible to the naked eye.
          </p>
          <NuxtLink
            to="/gallery"
            class="inline-flex items-center gap-2 text-nebula-400 hover:text-nebula-300 font-medium transition-colors"
          >
            Explore the gallery
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </NuxtLink>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div
            v-for="stat in stats"
            :key="stat.label"
            class="bg-space-800/50 border border-space-700/50 rounded-2xl p-6 text-center backdrop-blur-sm"
          >
            <div class="text-3xl font-bold text-nebula-400 mb-1">{{ stat.value }}</div>
            <div class="text-sm text-slate-400">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

