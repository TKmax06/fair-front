<template>
  <div>
    <h2>Welcome to the Fair App!</h2>
    <router-view :key="router.currentRoute.value.query.random" />
  </div>
</template>

<script setup lang="ts">
  import router from '@/router/index.ts';
</script>

<style scoped>

</style>