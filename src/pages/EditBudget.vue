<template>
  <div class="flex flex-col h-full">
    <GoBackHeaderLayout title="월 예산 설정" />
    <div class="h-full p-8 flex flex-col">
      <main class="flex-1 flex flex-col justify-between">
        <div class="p-4">
          <span class="mb-2">수정할 금액을 입력해주세요 </span><PriceInput v-model="budget" />
        </div>

        <div class="flex justify-between mt-10 gap-4">
          <CommonButton variant="white" :onClick="goBack" class="w-full justify-center">
            취소
          </CommonButton>
          <CommonButton variant="black" :onClick="openSaveDialog" class="w-full justify-center">
            <Pencil class="w-4 h-4" />
            저장하기
          </CommonButton>
        </div>
      </main>

      <el-dialog v-model="openDialog" title="저장 확인" width="300px">
        <span>예산을 저장하시겠습니까?</span>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="openDialog = false">취소</el-button>
            <el-button
              @click="confirmSave"
              style="background-color: #6aa25a; color: white; border: none"
            >
              저장
            </el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { updateBudgetMonthly, getUser } from '@/api/user'

import GoBackHeaderLayout from '@/components/layout/GoBackHeaderLayout.vue'
import CommonButton from '@/components/common/CommonButton.vue'
import PriceInput from '@/components/common/PriceInput.vue'
import { Pencil } from 'lucide-vue-next'

const router = useRouter()

const budget = ref()
const openDialog = ref(false)

const goBack = () => {
  router.back()
}

const openSaveDialog = () => {
  openDialog.value = true
}

const confirmSave = async () => {
  openDialog.value = false
  try {
    await updateBudgetMonthly(1, budget.value)
    router.push('/setting')
  } catch (error) {
    alert('예산 저장 중 오류가 발생했습니다.')
    console.error(error)
  }
}

onMounted(async () => {
  try {
    const user = await getUser(1)
    budget.value = user.budgetMonthly ?? 0
  } catch (err) {
    console.error('유저 정보 가져오기 실패:', err)
  }
})
</script>
