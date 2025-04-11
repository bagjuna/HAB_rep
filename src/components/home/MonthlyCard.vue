<template>
  <div class="bg-white rounded-2xl p-4 shadow-2xl space-y-3">
    <!-- 월 네비게이션 -->
    <div class="flex items-center gap-1 text-lg font-semibold mb-2.5">
      <!-- 이전 달 버튼 -->
      <button @click="goToPrevMonth">
        <ChevronLeft class="w-5 h-5" />
      </button>

      <!-- 현재 월 표시 버튼 (클릭 시 date-picker) -->
      <span class="px-1">
        {{ formattedMonth }}
      </span>

      <!-- 다음 달 버튼 -->
      <button @click="goToNextMonth" :disabled="isCurrentMonth" class="disabled:opacity-30">
        <ChevronRight class="w-5 h-5" />
      </button>

      <!-- 캘린더 아이콘만 있는 버튼 -->
      <IconButton :onClick="openMonthPicker">
        <CalendarDays class="w-5 h-5 text-gray-700" />
      </IconButton>

      <!-- 숨겨진 month picker -->
      <el-date-picker
        ref="monthPickerRef"
        v-model="selectedMonth"
        type="month"
        format="YYYY.MM"
        value-format="YYYY-MM"
        :teleported="false"
        :editable="false"
        :prefix-icon="null"
        class="absolute w-0 h-0 opacity-0 pointer-events-none"
        @change="handleMonthChange"
      />
    </div>

    <!-- 수입/지출 카드 -->
    <div class="flex gap-3">
      <HomeCard
        title="수입"
        type="income"
        :amount="localIncome"
        bgColor="bg-[#4B4B4B]"
        textColor="text-white"
      />
      <HomeCard
        title="지출"
        type="expenditure"
        :amount="localExpenditure"
        bgColor="bg-[#F8F8F8]"
        textColor="text-black"
      />
    </div>

    <!-- 순수익 -->
    <div class="px-2 py-3 flex justify-between text-gray-500 font-medium font-semibold">
      <span>순수익</span>
      <span :class="NetProfit >= 0 ? 'text-[#6AA25A]' : 'text-black'">
        {{ NetProfit > 0 ? '+ ' : NetProfit < 0 ? '- ' : '' }}
        {{ Math.abs(NetProfit).toLocaleString() }} 원
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { defineProps, defineEmits } from 'vue'
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-vue-next'
import HomeCard from '@/components/home/HomeCard.vue'
import IconButton from '@/components/common/IconButton.vue'

import { dateToInt, intToDate, fetchTransactionsByMonth } from '@/api/TransactionApi'
import { useTransactionStore } from '@/api/transaction-store'
import { useTransactionStoreAdapter } from '@/stores/transactionStoreAdapter'

// dayjs 추가
import dayjs from 'dayjs'
import 'dayjs/locale/ko'

dayjs.locale('ko')

// props 정의
const props = defineProps({
  income: {
    type: Number,
    default: 0,
  },
  expenditure: {
    type: Number,
    default: 0,
  },
})

// emit 정의
const emit = defineEmits(['update:income', 'update:expenditure'])

// 컴포넌트 내부 상태 - props를 직접 수정할 수 없으므로 로컬 상태 사용
const localIncome = ref(props.income)
const localExpenditure = ref(props.expenditure)

// 디버그 토글
const showDebug = ref(false)
const toggleDebug = () => {
  showDebug.value = !showDebug.value
}

const now = new Date()
const selectedDate = ref(new Date())
const isFilterOpen = ref(false)
const isFiltered = ref(false) // 필터 적용 여부를 추적하는 상태 추가

// 현재 선택된 월 (기본값: 오늘)
const selectedMonth = ref(dayjs().format('YYYY-MM'))
const monthPickerRef = ref(null)

// 현재 월 형식화 (YYYY.MM)
const formattedMonth = computed(() => {
  return dayjs(selectedMonth.value).format('YYYY.MM')
})

// 현재 월 확인
const isCurrentMonth = computed(() => {
  const today = dayjs()
  const selected = dayjs(selectedMonth.value)
  return today.year() === selected.year() && today.month() === selected.month()
})

// 순수익 = 수입 - 지출
const NetProfit = computed(() => {
  const result = localIncome.value - localExpenditure.value
  return isNaN(result) ? 0 : result
})

// 컴포넌트 마운트 시 데이터 로드
onMounted(async () => {
  // 컴포넌트 로드 시 현재 월의 트랜잭션 데이터 로드
  await loadTransactionsForCurrentMonth()
})

// 선택한 날짜가 변경될 때 데이터 다시 로드
watch(selectedDate, async () => {
  if (!isFiltered.value) {
    await loadTransactionsForCurrentMonth()
  }
})

// 선택한 월의 트랜잭션 데이터 로드
const loadTransactionsForCurrentMonth = async () => {
  try {
    // 현재 선택된 월의 년도와 월 분리
    const [year, month] = selectedMonth.value.split('-')

    // API를 통해 해당 월의 트랜잭션 데이터 로드
    const transactions = await fetchTransactionsByMonth(year, month)

    // 수입과 지출 계산
    let incomeTotal = 0
    let expenditureTotal = 0

    // 트랜잭션 타입에 따라 수입과 지출 분류 및 합산
    transactions.forEach(item => {
      if (item.type === 'INCOME') {
        incomeTotal += item.amount
      } else {
        expenditureTotal += item.amount
      }
    })

    // 로컬 상태 업데이트
    localIncome.value = incomeTotal
    localExpenditure.value = expenditureTotal

    // 부모 컴포넌트에 변경 사항 알림 (v-model 사용 시)
    emit('update:income', incomeTotal)
    emit('update:expenditure', expenditureTotal)

    console.log('월별 데이터 로드 완료:', { 수입: incomeTotal, 지출: expenditureTotal })
  } catch (error) {
    console.error('월별 트랜잭션 로드 오류:', error)
  }
}

// 수입 계산 함수 (사용 안 함 - 참고용)
const getIncomeMonth = async (year, month) => {
  try {
    const response = await fetchTransactionsByMonth(year, month)
    let incomeTotal = 0

    // 모든 수입 항목 합산
    for (const item of response) {
      if (item.type === 'INCOME') {
        incomeTotal += item.amount
      }
    }

    return incomeTotal
  } catch (error) {
    console.error('수입 계산 오류:', error)
    return 0
  }
}

// 지출 계산 함수 (사용 안 함 - 참고용)
const getExpenseMonth = async (year, month) => {
  try {
    const response = await fetchTransactionsByMonth(year, month)
    let expenseTotal = 0

    // 모든 지출 항목 합산
    for (const item of response) {
      if (item.type !== 'INCOME') { // 수입이 아닌 모든 항목을 지출로 처리
        expenseTotal += item.amount
      }
    }

    return expenseTotal
  } catch (error) {
    console.error('지출 계산 오류:', error)
    return 0
  }
}

// 이전 달 이동
const goToPrevMonth = async () => {
  // 이전 달로 날짜 변경
  selectedMonth.value = dayjs(selectedMonth.value).subtract(1, 'month').format('YYYY-MM')
  console.log('이전 달 이동:', selectedMonth.value)

  // 변경된 월의 트랜잭션 데이터 로드
  await loadTransactionsForCurrentMonth()
}

// 다음 달 이동
const goToNextMonth = async () => {
  // 현재 월이 아닌 경우에만 다음 달로 이동 가능
  if (!isCurrentMonth.value) {
    selectedMonth.value = dayjs(selectedMonth.value).add(1, 'month').format('YYYY-MM')
    console.log('다음 달 이동:', selectedMonth.value)

    // 변경된 월의 트랜잭션 데이터 로드
    await loadTransactionsForCurrentMonth()
  }
}

// 달 클릭 시 date-picker 열기
const openMonthPicker = () => {
  monthPickerRef.value?.focus()
}

// 달력에서 선택했을 때 값 반영
const handleMonthChange = async (val) => {
  selectedMonth.value = val // 이 값은 'YYYY-MM' 형식 문자열

  // 선택한 월의 트랜잭션 데이터 로드
  await loadTransactionsForCurrentMonth()
}
</script>
