<template>
  <HeaderLayout />
  <div class="p-8 space-y-2">
    <!-- 하루 쓸수 있는 돈 -->
    <div class="h-[102px]">
      <HomeCard
        :title="cardTitle"
        bgColor="bg-[#6AA25A]"
        textColor="text-white"
        :amount="budgetStore.getDailyRemainingBudget().value"
      />
    </div>

    <!-- 일주일/남은돈 -->
    <div class="flex gap-3">
      <!-- 일주일 -->
      <HomeCard
        title="일주일"
        :amount="budgetStore.getWeeklyRemainingBudget().value"
        bgColor="bg-[#4B4B4B]"
        textColor="text-white"
      />
      <!-- 남은 돈 -->
      <HomeCard
        title="남은 돈"
        :amount="budgetStore.getRemainingBudget().value"
        bgColor="bg-[#F8F8F8]"
        textColor="text-black"
        :iconButton="{ icon: Pencil, onClick: handleEditBudget }"
      >
        <div class="flex gap-1 text-sm">
          <span class="text-[#6AA25A]"
            >{{ budgetStore.getMonthlyBudget().value.toLocaleString() }}원</span
          ><span class="text-red-700"
            >- {{ budgetStore.getMonthlyExpenditure().value.toLocaleString() }}원</span
          >
        </div>
      </HomeCard>
    </div>

    <!-- 수입 / 지출 요약 -->
    <div class="w-full">
      <MonthlyCard :income="300000" :expenditure="180000" />
    </div>

    <!-- 최근 거래내역 -->
    <div class="bg-white p-4 rounded-2xl shadow-2xl space-y-3">
      <div class="flex justify-between items-center mb-2" @click="gotoHistory">
        <h3 class="text-base font-bold flex items-center">
          최근 거래
          <ChevronRight class="w-4 h-4 text-gray-500 ml-1 cursor-pointer" />
        </h3>
      </div>

      <TransactionItemList :transactions="recentTransactions" @click="goToDetail" />
    </div>
  </div>
  <!-- <NavBar /> -->
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Pencil, ChevronRight } from 'lucide-vue-next'

import HomeCard from '@/components/home/HomeCard.vue'
import HeaderLayout from '@/components/layout/HeaderLayout.vue'
import TransactionItemList from '@/components/Transaction/TransactionItemList.vue'
import MonthlyCard from '@/components/home/MonthlyCard.vue'

import { useUserStore } from '@/stores/userStore'
import { useTransactionStore } from '@/api/transaction-store'
import { useBudgetStore } from '@/stores/budgetStore.js'

const router = useRouter()
const userStore = useUserStore()
const transactionStore = useTransactionStore()
const budgetStore = useBudgetStore()

// 마운트 시 사용자 정보 가져오기 (선택)
onMounted(() => {
  if (!userStore.user) {
    userStore.fetchUser(1)
  }
  loadRecentTransactions()
  budgetStore.initBudget()
})

// 제목 생성
const cardTitle = computed(() => {
  const name = userStore.user?.nickname || '엥'
  return `<strong>${name}</strong>님이 오늘 하루</strong>에 쓸 수 있는 돈`
})

const handleEditBudget = () => {
  router.push('/setting/budget')
}
const gotoHistory = () => {
  router.push('/transactions')
}
const goToDetail = (id) => {
  router.push(`/transactions/${id}`)
}

// 거래

// 최근거래
const recentTransactions = ref([])

const loadRecentTransactions = async () => {
  recentTransactions.value = await transactionStore.fetchRecentTransactions(5)
}
</script>
