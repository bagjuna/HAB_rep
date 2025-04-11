<template>
  <div class="h-full flex flex-col">
    <GoBackHeaderLayout title="프로필 수정" />
    <div class="h-full p-8 flex flex-col">
      <!-- 본문 영역 -->
      <main class="flex-1 flex flex-col gap-6">
        <!-- 닉네임 필드 -->
        <NicknameInput v-model="nickname" />

        <!-- 이메일 필드 -->
        <EmailInput v-model="email" />
      </main>

      <!-- Footer 버튼 영역 -->
      <footer class="flex justify-between mt-6 gap-4">
        <CommonButton variant="white" :onClick="cancelEdit" class="w-full justify-center">
          취소
        </CommonButton>
        <CommonButton variant="black" :onClick="saveEdit" class="w-full justify-center">
          저장하기
        </CommonButton>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getUser, updateUserProfile } from '@/api/user'

import GoBackHeaderLayout from '@/components/layout/GoBackHeaderLayout.vue'
import NicknameInput from '@/components/NicknameInput.vue'
import EmailInput from '@/components/EmailInput.vue'
import CommonButton from '@/components/common/CommonButton.vue'

const router = useRouter()

const nickname = ref('')
const email = ref('')

onMounted(async () => {
  try {
    const data = await getUser(1)
    nickname.value = data.nickname
    email.value = data.email
  } catch (err) {
    console.error('유저 정보 가져오기 실패!:', err)
  }
})

const cancelEdit = () => {
  console.log('취소 버튼 클릭')
  router.back()
}

const saveEdit = async () => {
  try {
    await updateUserProfile(1, {
      nickname: nickname.value,
      email: email.value,
    })
    router.push({ name: 'setting' })
  } catch (err) {
    console.error('수정 실패:', err)
  }
}
</script>
