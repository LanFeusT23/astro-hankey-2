<script setup lang="ts">
import landingPageMilkywayImage from "~/assets/images/landing-page-milkyway-lin.jpg";

useSeoMeta({
    title: "Jonathan Hankey — Astrophotography",
    description:
        "Deep sky astrophotography by Jonathan Hankey. Nebulae, galaxies, and star clusters captured from dark skies.",
});

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
            :style="{
                backgroundImage: `url(${landingPageMilkywayImage})`,
                opacity: 0.3,
            }"
        />

        <!-- Gradient overlays -->
        <div
            class="absolute inset-0 bg-linear-to-b from-space-950/60 via-transparent to-space-950"
        />
        <div
            class="absolute inset-0 bg-linear-to-r from-space-950/40 via-transparent to-space-950/40"
        />

        <!-- Navigation -->
        <AppNav />

        <!-- Hero content -->
        <div
            class="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center"
        >
            <div class="space-y-6 max-w-4xl mx-auto">
                <!-- Main title -->
                <h1
                    class="animate-shimmer font-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-none"
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
                    Capturing the universe, one photon at a time. Deep sky objects, nebulae, and
                    galaxies from dark skies across the American West.
                </p>

                <!-- CTA button -->
                <div class="animate-fade-in-up-delay-2 flex gap-4 justify-center mt-10">
                    <NuxtLink
                        to="/gallery"
                        class="group relative px-8 py-4 bg-nebula-600 hover:bg-nebula-500 text-white font-medium rounded-full transition-all duration-300 overflow-hidden"
                    >
                        <span class="relative z-10 flex items-center gap-2">
                            <svg
                                class="w-5 h-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
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
                            class="absolute inset-0 bg-linear-to-r from-nebula-600 to-star-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        />
                    </NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>
