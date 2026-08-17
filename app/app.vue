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

<style>
.markdown-body p {
    margin: 0 0 0.75rem;
}

.markdown-body h1,
.markdown-body h2,
.markdown-body h3 {
    margin: 0.75rem 0;
    color: #fff;
    font-weight: 600;
}

.markdown-body ul,
.markdown-body ol {
    margin: 0 0 0.75rem 1.25rem;
}

.markdown-body a {
    color: #93c5fd;
    text-decoration: underline;
}
</style>
