<template>
  <div class="p-8">
    <div class="space-y-6">
      <!-- 날짜 선택 -->
      <div>
        <label class="text-base font-bold flex items-center mb-3"
          >날짜 <span class="text-neutral-500 ml-1">*</span></label
        >
        <el-date-picker
          v-model="transaction.date"
          type="date"
          placeholder="날짜를 선택하세요"
          value-format="YYYY-MM-DD"
        />
      </div>

      <!-- 거래 이름 입력 -->
      <div>
        <label class="text-base font-bold flex items-center mb-3"
          >거래 이름 <span class="text-neutral-500 ml-1">*</span></label
        >
        <InputWithLength
          v-model="transaction.title"
          placeholder="거래 이름을 입력하세요"
          :maxLength="100"
          class="w-full"
        />
      </div>

      <!-- 메모 입력 -->
      <div>
        <label class="text-base font-bold flex items-center mb-3">메모 </label>
        <InputWithLength
          v-model="transaction.memo"
          placeholder="메모를 입력하세요"
          type="textarea"
          class="w-full"
        />
      </div>

      <!-- 가격 입력 -->
      <div>
        <label class="text-base font-bold flex items-center mb-3"
          >가격(원) <span class="text-neutral-500 ml-1">*</span></label
        >
        <PriceInput v-model="transaction.amount" placeholder="가격을 입력하세요" class="w-full" />
      </div>

      <!-- 거래 구분 선택 (수입 / 지출) -->
      <div>
        <label class="text-base font-bold flex items-center mb-3"
          >구별 <span class="text-neutral-500 ml-1">*</span></label
        >
        <TwoButtonSelect
          v-model="transaction.type"
          :options="[
            { label: '수입', value: 'INCOME' },
            { label: '지출', value: 'EXPENDITURE' },
          ]"
        />
      </div>

      <!-- 카테고리 선택 -->
      <label class="text-base font-bold flex items-center mb-3"
        >카테고리 <span class="text-neutral-500 ml-1">*</span></label
      >
      <div class="flex flex-wrap gap-2">
        <CategoryButton
          v-for="id in 17"
          :key="id"
          :categoryId="id"
          :selected="transaction.category_id === id"
          @click="updateCategory(id)"
        />
      </div>

      <!-- 버튼 영역: 저장하기만 존재 -->
      <div class="flex justify-end mt-8">
        <CommonButton
          variant="black"
          :disabled="!canSave"
          :class="[saveButtonClasses, 'w-full', 'justify-center']"
          @click="handleSave"
        >
          저장하기
        </CommonButton>
      </div>
    </div>

    <!-- 저장 확인 다이얼로그 -->
    <el-dialog v-model="openSaveDialog" title="저장 확인" width="300px">
      <span>거래 내역을 저장하시겠습니까?</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="openSaveDialog = false">취소</el-button>
          <el-button
            type="primary"
            @click="confirmSave"
            :style="{ backgroundColor: '#6AA25A', borderColor: '#6AA25A' }"
            >예</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import InputWithLength from '@/components/common/InputWithLength.vue'
import PriceInput from '@/components/common/PriceInput.vue'
import TwoButtonSelect from '@/components/Transaction/TwoButtonSelect.vue'
import CommonButton from '@/components/common/CommonButton.vue'
import CategoryButton from '@/components/common/CategoryButton.vue'

import { useTransactionStoreAdapter } from '@/stores/transactionStoreAdapter'

const router = useRouter()

// 거래 데이터 초기값
const transaction = reactive({
  date: '',
  title: '',
  memo: '',
  amount: 0,
  type: '',
  category_id: '',
})

const { saveTransaction } = useTransactionStoreAdapter()

// 필수 필드가 모두 채워졌는지 확인
const canSave = computed(() => {
  return (
    (transaction.date || '').trim() !== '' &&
    transaction.title.trim() !== '' &&
    transaction.amount > 0 &&
    transaction.type.trim() !== '' &&
    transaction.category_id !== ''
  )
})

// 저장 버튼 활성화 클래스 (필수 입력이 모두 채워지면 빈 문자열, 아니면 비활성화 스타일)
const saveButtonClasses = computed(() => {
  return canSave.value ? '' : 'opacity-50 cursor-not-allowed'
})

// 저장 다이얼로그 상태 관리
const openSaveDialog = ref(false)

// 저장하기 버튼 클릭 시, 필수 입력이 모두 채워졌는지 확인하고, 채워지지 않았다면 아무 동작도 하지 않음
const handleSave = () => {
  if (!canSave.value) return
  openSaveDialog.value = true
}

// 저장 확인 후 처리 함수
const confirmSave = async () => {
  openSaveDialog.value = false

  try {
    // 저장 확인용
    console.log('Modified Transaction Data: ', transaction)

    await saveTransaction(transaction)
    // 거래내역으로 이동
    router.push({ path: '/transactions' })
    window.scrollTo(0, 0)
  } catch (error) {
    console.log('저장 실패 : ', error)
  }
}

// 카테고리 선택 업데이트 함수
const updateCategory = (id) => {
  transaction.category_id = id
}
</script>

<style scoped></style>
