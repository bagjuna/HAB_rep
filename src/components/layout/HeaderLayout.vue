<script setup>
import LogoComponent from '../common/LogoComponent.vue'
</script>

<template>
  <div class="flex w-full h-[48px] justify-start items-center p-8 lg:hidden">
    <router-link to="/" class="text-black hover:opacity-70">
      <LogoComponent />
    </router-link>
  </div>
</template>
