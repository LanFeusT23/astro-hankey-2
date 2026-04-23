<script setup lang="ts">
const { count = 150 } = defineProps<{
    count?: number;
}>();

const stars = ref<
    Array<{
        id: number;
        x: number;
        y: number;
        size: number;
        opacity: number;
        delay: number;
        duration: number;
    }>
>([]);

function generateStars() {
    const starArray = [];
    for (let i = 0; i < count; i++) {
        starArray.push({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 2 + 0.5,
            opacity: Math.random() * 0.7 + 0.3,
            delay: Math.random() * 4,
            duration: Math.random() * 3 + 2,
        });
    }
    stars.value = starArray;
}

onMounted(() => {
    generateStars();
});
</script>

<template>
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
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
        ></div>
    </div>
</template>
