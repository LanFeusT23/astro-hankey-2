<script setup lang="ts">
import landingPageMilkywayImage from "~/assets/images/landing-page-milkyway-lin.jpg";

useSeoMeta({
    title: "Jonathan Hankey — Astrophotography",
    description:
        "Deep sky astrophotography by Jonathan Hankey. Nebulae, galaxies, and star clusters captured from dark skies.",
});
</script>

<template>
    <div class="relative min-h-screen overflow-hidden">
        <!-- Hero image overlay -->
        <div
            class="absolute inset-0 bg-cover bg-center bg-no-repeat"
            :style="{
                backgroundImage: `url(${landingPageMilkywayImage})`,
                opacity: 0.3,
            }"
        ></div>

        <!-- Gradient overlays -->
        <div
            class="absolute inset-0 bg-linear-to-b from-space-950/30 via-transparent to-space-950"
        ></div>
        <div
            class="absolute inset-0 bg-linear-to-r from-space-950/20 via-transparent to-space-950/20"
        ></div>

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

                <!-- subTitle -->
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
                            <MdiImageMultipleOutline class="w-5 h-5" />
                            View Gallery
                        </span>
                        <div
                            class="absolute inset-0 bg-linear-to-r from-nebula-600 to-star-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        ></div>
                    </NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>
