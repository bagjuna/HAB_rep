<template>
  <div
    class="flex justify-between items-center bg-[#efefef] p-5 rounded-xl shadow-sm border border-gray-200 cursor-pointer"
    @click="handleClick"
  >
    <div class="flex flex-col justify-between">
      <div class="text-sm text-gray-400 mb-1.5 pl-1">
        {{ formatDate(transaction.date) }}
      </div>
      <div class="text-base font-medium pl-1">
        {{ transaction.title }}
      </div>
    </div>

    <div class="flex flex-col items-end gap-2 pt-1 pr-1">
      <component :is="getCategoryIcon(transaction.category_id)" class="w-5 h-5 text-gray-500" />
      <div
        :class="[
          'text-base font-semibold',
          transaction.type === 'INCOME' ? 'text-[#6AA25A]' : 'text-black',
        ]"
      >
        {{ transaction.type === 'INCOME' ? '+' : '-' }}
        {{ Number(transaction.amount).toLocaleString() }} 원
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import {
  Utensils,
  Coffee,
  Store,
  Wine,
  ShoppingCart,
  Gamepad,
  Stethoscope,
  Home,
  FileText,
  Scissors,
  Car,
  GraduationCap,
  Sprout,
  MoreHorizontal,
  DollarSign,
  HandCoins,
  PiggyBank,
  HelpCircle,
} from 'lucide-vue-next'

const props = defineProps({
  transaction: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['click'])

const handleClick = () => {
  emit('click', props.transaction.id)
}

const formatDate = (dateInt) => {
  // 정수를 문자열로 변환
  const dateStr = String(dateInt)

  // 문자열에서 년(0-3), 월(4-5), 일(6-7) 추출
  const year = dateStr.substring(0, 4)
  const month = dateStr.substring(4, 6)
  const day = dateStr.substring(6, 8)

  // 월.일 형식으로 반환
  return `${month}.${day}`
}

const getCategoryIcon = (category_id) => {
  const map = {
    1: Utensils,
    2: Coffee,
    3: Store,
    4: Wine,
    5: ShoppingCart,
    6: Gamepad,
    7: Stethoscope,
    8: Home,
    9: FileText,
    10: Scissors,
    11: Car,
    12: GraduationCap,
    13: Sprout,
    14: MoreHorizontal,
    15: DollarSign,
    16: HandCoins,
    17: PiggyBank,
  }
  return map[category_id] || HelpCircle
}
</script>
