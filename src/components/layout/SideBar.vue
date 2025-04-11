<template>
  <aside
    class="hidden lg:flex fixed top-0 left-0 h-screen w-[72px] flex-col items-center justify-between py-8"
  >
    <router-link to="/" class="text-black hover:opacity-70">
      <LogoComponent />
    </router-link>
    <div class="flex flex-col items-center gap-10" center>
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
    </div>

    <a href="https://github.com/KB-HAB/HAB">
      <IconButton class="hover:opacity-70">
        <Github class="w-8 h-8" />
      </IconButton>
    </a>
  </aside>
</template>

<script setup>
import { HomeIcon, PlusSquareIcon, UserRound, Github } from 'lucide-vue-next'
import IconButton from '../common/IconButton.vue'
import LogoComponent from '../common/LogoComponent.vue'
</script>
