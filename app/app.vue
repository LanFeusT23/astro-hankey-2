<script setup lang="ts">
const { initAuth } = useAuth();

onMounted(() => {
    initAuth();
});
</script>

<template>
    <div class="relative page-transition-shell">
        <StarField />
        <NuxtPage />
    </div>
</template>
