<script setup lang="ts">
const { initAuth } = useAuth();

onMounted(() => {
    initAuth();
});
</script>

<template>
    <div class="relative">
        <StarField />
        <NuxtPage />
    </div>
</template>
