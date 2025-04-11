<template>
  <nav v-if="visible" class="w-full bg-white py-4 flex justify-around items-center">
    <router-link to="/">
      <IconButton class="hover:opacity-70">
        <HomeIcon class="w-8 h-8" />
      </IconButton>
    </router-link>
    <router-link to="/transactions/add">
      <IconButton class="hover:opacity-70">
        <PlusSquareIcon class="w-8 h-8" />
      </IconButton>
    </router-link>
    <router-link to="/setting">
      <IconButton class="hover:opacity-70">
        <UserRound class="w-8 h-8" />
      </IconButton>
    </router-link>
  </nav>
</template>

<script setup>
import { HomeIcon, PlusSquareIcon, UserRound } from 'lucide-vue-next'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import IconButton from '../common/IconButton.vue'

const route = useRoute()

// 표시할 경로 목록
const visiblePaths = ['/', '/transactions', '/transactions/add', '/setting']

// 현재 경로가 목록에 있는 경우만 표시
const visible = computed(() => visiblePaths.includes(route.path))
</script>
