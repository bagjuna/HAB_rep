<template>
  <HeaderLayout />
  <div class="w-full h-full flex flex-col justify-between">
    <div class="flex flex-col p-10 gap-5">
      <div class="flex flex-col gap-2">
        <h2 class="font-bold text-3xl">프로필을 작성해주세요.</h2>
        <p class="text-neutral-500">닉네임은 언제든 수정할 수 있습니다.</p>
      </div>
      <div class="flex flex-col gap-5">
        <NicknameInput v-model="nickname" />
        <EmailInput v-model="email" />
      </div>
    </div>
    <div class="flex p-10 w-full">
      <CommonButton class="w-full justify-center" @click="handleClick"> 계속하기 </CommonButton>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CommonButton from '@/components/common/CommonButton.vue'
import EmailInput from '@/components/EmailInput.vue'
import HeaderLayout from '@/components/layout/HeaderLayout.vue'
import NicknameInput from '@/components/NicknameInput.vue'

const nickname = ref('')
const email = ref('')

const handleClick = () => {
  console.log('Nickname:', nickname.value)
  console.log('Email:', email.value)
}
</script>
