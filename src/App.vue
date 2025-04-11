<script setup>
import { RouterView } from 'vue-router'
import PageLayout from './components/layout/PageLayout.vue'
</script>

<template>
  <PageLayout :showHeader="true">
    <RouterView />
  </PageLayout>
</template>

<style scoped></style>
