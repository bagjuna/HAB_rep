<template>
  <div class="h-full flex flex-col">
    <HeaderLayout />
    <div class="flex flex-col justify-between h-full bg-white p-8 pb-24">
      <!-- Body -->
      <main class="flex flex-col gap-6">
        <!-- Profile Section -->
        <section>
          <div class="flex items-center gap-2 mb-1">
            <!-- 닉네임 표시 -->
            <p class="text-xl font-bold">{{ user.nickname }}</p>
            <!-- 닉네임 수정 버튼 (연필 아이콘) -->
            <IconButton class="text-gray-500 text-sm" :onClick="editNickname">
              <Pencil />
            </IconButton>
          </div>
          <!-- 이메일 표시 -->
          <p class="text-sm text-gray-400">{{ user.email }}</p>
        </section>

        <!-- 설정 버튼: 월 예산 설정 -->
        <button
          @click="goToBudget"
          class="w-full flex items-center justify-between p-4 bg-gray-100 rounded-lg text-left hover:text-neutral-500 hover:cursor-pointer"
        >
          <div class="flex items-center gap-3">
            <HandCoins />
            월 예산 설정
          </div>
        </button>
      </main>

      <!-- Footer -->
      <footer class="flex w-full justify-center text-center text-md text-gray-400 space-x-2 mt-8">
        <span>© 2025 HAB</span>
        <span>·</span>
        <a
          href="https://github.com/KB-HAB/HAB"
          class="inline-flex items-center gap-1 hover:text-black"
          >GitHub</a
        >
      </footer>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

// 기존에 사용하던 아이콘들
import { Pencil, HandCoins } from 'lucide-vue-next'
// 새 내비게이션에 사용할 아이콘들
import HeaderLayout from '@/components/layout/HeaderLayout.vue'
import IconButton from '@/components/common/IconButton.vue'

const router = useRouter()
// 사용자 정보를 저장할 객체 (json-server의 단일 유저 사용)
const user = reactive({ id: '', nickname: '', email: '' })

// 컴포넌트가 마운트되면 API를 통해 유저 정보를 가져옴
onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:3000/user')
    if (response.data && response.data.length > 0) {
      user.id = response.data[0].id
      user.nickname = response.data[0].nickname
      user.email = response.data[0].email
    } else {
      console.warn('유저 정보를 찾을 수 없습니다.')
    }
  } catch (error) {
    console.error('유저 정보를 가져오는 중 에러 발생:', error)
  }
})

// 닉네임 수정 화면으로 이동
const editNickname = () => {
  router.push({ name: 'editProfile' })
}

// 월 예산 설정 화면으로 이동
const goToBudget = () => {
  router.push({ name: 'editBudget' })
}
</script>

<style scoped>
/* 필요에 따라 추가 스타일 작성 */
</style>
