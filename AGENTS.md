# Copilot Agent Instructions

## Vue File Structure

In all `.vue` files, the `<script>` block must come **before** the `<template>` block:

```vue
<script setup lang="ts">
// ...
</script>

<template>
  <!-- ... -->
</template>
```

Never place `<template>` above `<script>`. This applies to all new and edited Vue files.
