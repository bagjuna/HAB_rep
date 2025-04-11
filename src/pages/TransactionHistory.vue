<template>
  <GoBackHeaderLayout :title="''" @goBack="handleBack" />
  <div class="p-8">
    <div class="bg-white p-4 rounded-2xl shadow-custom space-y-3 m-4">
      <!-- 년.월 + <> 버튼 -->
      <div class="p-2.5 flex items-center gap-1">
        <button v-if="!isFiltered" @click="goToPrevMonth">
          <ChevronLeft class="w-5 h-5" />
        </button>
        <span class="text-lg font-semibold">
          {{ displayDateLabel }}
        </span>
        <button
          v-if="!isFiltered"
          @click="goToNextMonth"
          :disabled="isCurrentMonth"
          class="disabled:opacity-30"
        >
          <ChevronRight class="w-5 h-5" />
        </button>
        <div class="ml-auto flex gap-2">
          <button @click="openFilterDialog">
            <Filter class="w-5 h-5" />
          </button>
          <el-button type="danger" plain @click="resetFilters">필터 초기화</el-button>
        </div>
      </div>

      <!-- 로딩 상태 -->
      <div v-if="transactionStore.loading" class="py-8 text-center">
        <p>데이터를 불러오는 중...</p>
      </div>

      <!-- 에러 상태 -->
      <div v-else-if="transactionStore.error" class="py-8 text-center text-red-500">
        <p>{{ transactionStore.error }}</p>
        <p class="text-sm mt-2">JSON Server가 실행 중인지 확인하세요.</p>
      </div>

      <!-- 데이터 없음 -->
      <div
        v-else-if="transactionStore.filteredTransactions.length === 0"
        class="py-8 text-center text-gray-500"
      >
        <p>거래 내역이 없습니다.</p>
      </div>

      <!-- 거래카드 -->
      <div v-else style="background-color: #ffffff">
        <TransactionItemList
          :transactions="transactionStore.paginatedTransactions"
          @click="goToDetail"
        />

        <!-- 페이지네이션 UI -->
        <div
          v-if="transactionStore.filteredTransactions.length > 0"
          class="mt-4 flex items-center justify-between relative"
        >
          <!-- 페이지네이션 내용 -->
          <div class="text-sm text-gray-500 flex-shrink-0">
            {{ transactionStore.filteredTransactions.length }}개 중
            {{
              (transactionStore.pagination.currentPage - 1) *
                transactionStore.pagination.itemsPerPage +
              1
            }}-
            {{
              Math.min(
                transactionStore.pagination.currentPage * transactionStore.pagination.itemsPerPage,
                transactionStore.filteredTransactions.length,
              )
            }}
          </div>

          <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <el-pagination
              v-model:current-page="currentPage"
              :page-count="transactionStore.totalPages"
              layout="prev, pager, next"
              background
              @current-change="handlePageChange"
            />
          </div>

          <!-- 항목 개수 선택: 오른쪽 정렬 -->
          <div class="flex items-center gap-2 ml-auto">
            <div class="mr-3">
              <el-select
                v-model="itemsPerPage"
                size="small"
                style="width: 100px"
                @change="changeItemsPerPage"
              >
                <el-option label="10개씩" :value="10" />
                <el-option label="20개씩" :value="20" />
                <el-option label="5개씩" :value="5" />
              </el-select>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <el-dialog
    v-model="isFilterOpen"
    title="필터"
    width="90%"
    class="rounded-xl"
    :close-on-click-modal="true"
    :destroy-on-close="true"
    center
  >
    <div class="space-y-4">
      <!-- 기간 필터 -->
      <div>
        <label class="block mb-1 font-medium">기간</label>
        <el-date-picker
          v-model="tempDateRange"
          type="daterange"
          start-placeholder="시작일"
          end-placeholder="종료일"
          class="w-full"
        />
      </div>

      <!-- 카테고리 필터 -->
      <div>
        <label class="block mb-1 font-medium">카테고리</label>
        <el-select v-model="tempCategory" placeholder="전체" class="w-full">
          <el-option label="전체" :value="''" />
          <el-option
            v-for="(label, id) in categoryMap"
            :key="id"
            :label="label"
            :value="Number(id)"
          />
        </el-select>
      </div>

      <!-- 수입/지출 필터 -->
      <div>
        <label class="block mb-1 font-medium">수입/지출</label>
        <el-select v-model="tempType" placeholder="전체" class="w-full">
          <el-option label="전체" value="" />
          <el-option label="수입" value="INCOME" />
          <el-option label="지출" value="EXPENDITURE" />
        </el-select>
      </div>

      <!-- 버튼 -->
      <div class="flex justify-end gap-2 pt-4">
        <el-button @click="isFilterOpen = false">취소</el-button>
        <el-button type="primary" @click="applyFilters">적용</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { ChevronLeft, ChevronRight, Filter } from 'lucide-vue-next'
import TransactionItemList from '@/components/Transaction/TransactionItemList.vue'
import GoBackHeaderLayout from '@/components/layout/GoBackHeaderLayout.vue'
import NavBar from '@/components/layout/NavBar.vue'
import { useRouter } from 'vue-router'
import 'element-plus/es/components/button/style/css'
import 'element-plus/es/components/pagination/style/css'
import 'element-plus/es/components/select/style/css'
import { useTransactionStore } from '@/api/transaction-store'
import { dateToInt, intToDate } from '@/api/TransactionApi'

// 스토어 설정
const transactionStore = useTransactionStore()

// 디버그 토글
const showDebug = ref(false)
const toggleDebug = () => {
  showDebug.value = !showDebug.value
}

const now = new Date()
const selectedDate = ref(new Date())
const isFilterOpen = ref(false)

// 필터 관련 상태
const tempDateRange = ref([])
const tempCategory = ref('')
const tempType = ref('')

// 페이지네이션 관련 상태
const currentPage = ref(1)
const itemsPerPage = ref(10)

// 컴포넌트 마운트 시 데이터 로드
onMounted(async () => {
  // 시작 시 모든 트랜잭션을 가져온 다음 필터링
  await transactionStore.fetchAllTransactions()
  // 현재 월에 해당하는 데이터만 필터링
  await loadTransactionsForCurrentMonth()
})

// 선택한 날짜가 변경될 때 데이터 다시 로드
watch(selectedDate, async () => {
  if (!isFiltered.value) {
    await loadTransactionsForCurrentMonth()
  }
})

// 현재 페이지 변경 시 스토어의 페이지도 변경
watch(currentPage, (newPage) => {
  transactionStore.goToPage(newPage)
})

// 스토어의 현재 페이지가 변경되면 컴포넌트의 currentPage도 업데이트
watch(
  () => transactionStore.pagination.currentPage,
  (newPage) => {
    currentPage.value = newPage
  },
)

// 현재 월의 트랜잭션 데이터 로드
const loadTransactionsForCurrentMonth = async () => {
  // 이미 모든 트랜잭션을 로드했으므로 해당 월 데이터만 필터링
  await transactionStore.fetchTransactionsByMonth(currentYear.value, currentMonth.value)
}

const handleBack = () => {
  router.back()
}

const openFilterDialog = () => {
  // 기존에 선택된 필터가 있으면 유지
  if (transactionStore.filters.dateRange?.length === 2) {
    const startInt = transactionStore.filters.dateRange[0]
    const endInt = transactionStore.filters.dateRange[1]
    tempDateRange.value = [intToDate(startInt), intToDate(endInt)]
  } else {
    tempDateRange.value = []
  }

  tempCategory.value = transactionStore.filters.category_id
  tempType.value = transactionStore.filters.type
  isFilterOpen.value = true
}

const applyFilters = async () => {
  try {
    // 날짜 범위 필터 적용
    if (tempDateRange.value?.length === 2) {
      const startDate = tempDateRange.value[0]
      const endDate = tempDateRange.value[1]

      // Date 객체가 아니면 변환
      const startObj = startDate instanceof Date ? startDate : new Date(startDate)
      const endObj = endDate instanceof Date ? endDate : new Date(endDate)

      // 정수 형태로 변환
      const startInt = dateToInt(startObj)
      const endInt = dateToInt(endObj)

      console.log('필터 적용 - 날짜 범위:', startInt, endInt)

      // 스토어 필터 설정 (정수 값으로)
      transactionStore.setFilter('dateRange', [startInt, endInt])

      // API 호출
      await transactionStore.fetchTransactionsByMonth(
        startObj.getFullYear(),
        startObj.getMonth() + 1,
        endObj,
      )
    }

    // 카테고리와 타입 필터 적용
    transactionStore.setFilter('category_id', tempCategory.value)
    transactionStore.setFilter('type', tempType.value)

    isFilterOpen.value = false
  } catch (error) {
    console.error('필터 적용 중 오류 발생:', error)
    transactionStore.error = '필터 적용 중 오류가 발생했습니다'
  }
}

const resetFilters = async () => {
  transactionStore.resetFilters()
  await loadTransactionsForCurrentMonth()
}

const handlePageChange = (page) => {
  transactionStore.goToPage(page)
}

const changeItemsPerPage = (value) => {
  transactionStore.setItemsPerPage(value)
}

const currentYear = computed(() => selectedDate.value.getFullYear())
const currentMonth = computed(() => selectedDate.value.getMonth() + 1)

const displayDateLabel = computed(() => {
  if (transactionStore.filters.dateRange?.length === 2) {
    const start = transactionStore.filters.dateRange[0]
    const end = transactionStore.filters.dateRange[1]

    // 정수 형식(yyyymmdd)에서 월과 일 추출
    const formatIntDate = (dateInt) => {
      const dateStr = String(dateInt)
      const month = dateStr.substring(4, 6)
      const day = dateStr.substring(6, 8)
      return `${parseInt(month)}.${parseInt(day)}`
    }

    return `${formatIntDate(start)} - ${formatIntDate(end)}`
  }
  return `${currentYear.value}.${String(currentMonth.value).padStart(2, '0')}`
})

const isCurrentMonth = computed(() => {
  return currentYear.value === now.getFullYear() && currentMonth.value === now.getMonth() + 1
})

const goToPrevMonth = () => {
  selectedDate.value = new Date(selectedDate.value.getFullYear(), selectedDate.value.getMonth() - 1)
}

const goToNextMonth = () => {
  if (!isCurrentMonth.value) {
    selectedDate.value = new Date(
      selectedDate.value.getFullYear(),
      selectedDate.value.getMonth() + 1,
    )
  }
}

const router = useRouter()
const goToDetail = (id) => {
  router.push(`/transactions/${id}`)
}

const categoryMap = {
  1: '식비',
  2: '교통비',
  3: '월급',
  4: '술·유흥',
  5: '쇼핑',
  6: '취미·여가',
  7: '의료·건강·피트니스',
  8: '주거·통신',
  9: '보험·세금·기타금융',
  10: '미용',
  11: '교통',
  12: '교육',
  13: '생활',
  14: '카테고리 없음',
  15: '이체',
  16: '급여',
  17: '저축·투자',
}

const isFiltered = computed(() => {
  const filters = transactionStore.filters
  return (
    (filters.dateRange && filters.dateRange.length === 2) ||
    filters.category_id !== '' ||
    filters.type !== ''
  )
})
</script>

<style scoped>
.shadow-custom {
  box-shadow: 0 -1px 10px rgba(0, 0, 0, 0.15); /* 위쪽에 그림자가 더 많이 보이도록 설정 */
}
/* 현재 페이지 네모박스 색상 변경 */
:deep(.el-pagination.is-background .el-pager li.is-active) {
  background-color: #6aa25a;
  color: white;
  border-color: #6aa25a;
}
</style>
