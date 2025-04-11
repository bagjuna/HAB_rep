<template>
  <!-- Container -->
  <div
    :style="{ height: `calc(var(--vh, 1vh) * 100)` }"
    class="flex items-center w-screen justify-center overflow-hidden bg-gray-100"
  >
    <!-- Wrapper -->
    <div class="w-full h-full max-w-[800px] flex flex-col">
      <!-- 본문 -->
      <div class="w-full flex-1 bg-white overflow-x-hidden">
        <slot />
      </div>

      <!-- 모바일 -->
      <div class="flex lg:hidden w-full h-fit">
        <NavBar />
      </div>
    </div>
  </div>

  <!-- 데스크탑 전용 사이드바 -->
  <SideBar />
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import NavBar from '@/components/layout/NavBar.vue'
import SideBar from '@/components/layout/SideBar.vue'

// 모바일 브라우저 100vh 대응
const setViewportHeight = () => {
  const vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty('--vh', `${vh}px`)
}

onMounted(() => {
  setViewportHeight()
  window.addEventListener('resize', setViewportHeight)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', setViewportHeight)
})
</script>

<style>
body {
  margin: 0;
}
</style>
