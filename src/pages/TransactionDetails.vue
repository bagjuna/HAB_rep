<template>
  <GoBackHeaderLayout />
  <div class="p-8">
    <!-- Body: 입력 폼 -->
    <div class="space-y-6">
      <!-- 날짜 선택 -->
      <div>
        <label class="text-base font-bold flex items-center mb-3">날짜</label>
        <el-date-picker
          v-model="transaction.date"
          type="date"
          placeholder="날짜를 선택하세요"
          value-format="YYYY-MM-DD"
        />
      </div>

      <!-- 거래 이름 입력 -->
      <div>
        <label class="text-base font-bold flex items-center mb-3">거래 이름</label>
        <InputWithLength
          v-model="transaction.title"
          placeholder="거래 이름을 입력하세요"
          :maxLength="100"
          class="w-full"
        />
      </div>

      <!-- 메모 입력 -->
      <div>
        <label class="text-base font-bold flex items-center mb-3">메모</label>
        <InputWithLength
          v-model="transaction.memo"
          placeholder="메모를 입력하세요"
          type="textarea"
          class="w-full"
        />
      </div>

      <!-- 가격 입력 -->
      <div>
        <label class="text-base font-bold flex items-center mb-3">가격(원)</label>
        <PriceInput v-model="transaction.amount" placeholder="가격을 입력하세요" class="w-full" />
      </div>

      <!-- 거래 구분 선택 (수입/지출) -->
      <div>
        <label class="text-base font-bold flex items-center mb-3">구별</label>
        <TwoButtonSelect
          v-model="transaction.type"
          :options="[
            { label: '수입', value: 'INCOME' },
            { label: '지출', value: 'EXPENDITURE' },
          ]"
        />
      </div>

      <!-- 카테고리 선택 -->
      <label class="text-base font-bold flex items-center mb-3">카테고리</label>
      <div class="flex flex-wrap gap-2">
        <CategoryButton
          v-for="id in 17"
          :key="id"
          :categoryId="id"
          :selected="transaction.category_id === id"
          @click="updateCategory(id)"
        />
      </div>

      <!-- 버튼 영역: 삭제하기 / 수정하기 -->
      <div class="flex justify-between mt-8 gap-4">
        <!-- 삭제하기 버튼 -->
        <CommonButton
          variant="warning"
          class="w-full justify-center"
          @click="openDeleteDialog = true"
        >
          삭제하기
        </CommonButton>
        <!-- 수정하기 버튼 -->
        <CommonButton
          variant="black"
          :disabled="!canSave"
          :class="[saveButtonClasses, 'w-full', 'justify-center']"
          @click="openSaveDialog = true"
        >
          수정하기
        </CommonButton>
      </div>
    </div>

    <!-- 삭제 확인 다이얼로그 -->
    <el-dialog v-model="openDeleteDialog" title="경고" width="300px">
      <span>삭제하시겠습니까?</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="openDeleteDialog = false">취소</el-button>
          <el-button
            type="danger"
            @click="confirmDelete"
            :style="{ backgroundColor: '#6AA25A', borderColor: '#6AA25A' }"
            >예</el-button
          >
        </span>
      </template>
    </el-dialog>

    <!-- 수정 확인 다이얼로그 -->
    <el-dialog v-model="openSaveDialog" title="수정 확인" width="300px">
      <span>거래 내역을 수정하시겠습니까?</span>
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
import { reactive, computed, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import GoBackHeaderLayout from '@/components/layout/GoBackHeaderLayout.vue'
import InputWithLength from '@/components/common/InputWithLength.vue'
import PriceInput from '@/components/common/PriceInput.vue'
import TwoButtonSelect from '@/components/Transaction/TwoButtonSelect.vue'
import CommonButton from '@/components/common/CommonButton.vue'
import CategoryButton from '@/components/common/CategoryButton.vue'
import { useTransactionStoreAdapter } from '@/stores/transactionStoreAdapter'

const router = useRouter()
const route = useRoute()

// 거래 데이터 초기값
const transaction = reactive({
  date: '',
  title: '',
  memo: '',
  amount: 0,
  type: '',
  category_id: 0,
})

const { getTransaction, deleteTransaction, editTransaction } = useTransactionStoreAdapter()

// 값 초기화
const fetchTransaction = async () => {
  const transactionId = route.params.id

  try {
    const foundTransaction = await getTransaction(transactionId)
    console.log(foundTransaction)

    if (foundTransaction) {
      transaction.date = foundTransaction.date
      transaction.title = foundTransaction.title
      transaction.memo = foundTransaction.memo || ''
      transaction.amount = foundTransaction.amount
      transaction.type = foundTransaction.type
      transaction.category_id = foundTransaction.category_id
    }

    // 깊은 복사를 통해 초기값을 설정
    initialTransaction.value = JSON.parse(JSON.stringify(transaction))
  } catch (error) {
    console.log(error)
  }
}

// 조회
onMounted(() => {
  fetchTransaction()
})

// 수정 전 값을 저장
const initialTransaction = ref({ ...transaction })

// 수정 여부 체크: 초기 값과 비교하여 변경된 필드만 체크
const isModified = computed(() => {
  return (
    transaction.title !== initialTransaction.value.title ||
    transaction.memo !== initialTransaction.value.memo ||
    transaction.amount !== initialTransaction.value.amount ||
    transaction.type !== initialTransaction.value.type ||
    transaction.date !== initialTransaction.value.date ||
    transaction.category_id !== initialTransaction.value.category_id
  )
})

// 수정된 값이 있으면 저장 버튼 활성화
const canSave = computed(() => {
  return isModified.value
})

const saveButtonClasses = computed(() => {
  return canSave.value ? '' : 'opacity-50 cursor-not-allowed'
})

// 삭제 및 수정 다이얼로그 상태 관리
const openDeleteDialog = ref(false)
const openSaveDialog = ref(false)

// 삭제 확인 후 처리 함수
const confirmDelete = async () => {
  openDeleteDialog.value = false
  const transactionId = route.params.id

  try {
    await deleteTransaction(transactionId)
    router.back()
  } catch (error) {
    console.log('삭제 실패 : ', error)
  }
}

// 수정 확인 후 처리 함수
const confirmSave = async () => {
  openSaveDialog.value = false
  const transactionId = route.params.id

  try {
    await editTransaction(transactionId, transaction)

    // 수정 확인용
    console.log('Modified Transaction Data: ', transaction)

    // 새로고침
    window.scrollTo(0, 0)
  } catch (error) {
    console.log('수정 실패 : ', error)
  }
}

// 카테고리 선택 업데이트 함수
const updateCategory = (id) => {
  // 이미 선택된 카테고리를 다시 클릭하면 취소
  transaction.category_id = transaction.category_id === id ? '' : id
}
</script>

<style scoped></style>
