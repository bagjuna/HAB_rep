<template>
  <div
    class="flex items-center justify-between w-full px-4 py-3 border-b border-gray-200 cursor-pointer"
    :class="buttonClasses"
    @click="handleClick"
  >
    <div class="flex items-center gap-2">
      <!-- selectedData.icon으로부터 아이콘 컴포넌트를 동적으로 렌더링 -->
      <component :is="selectedData.icon" :class="iconClasses" />
      <span :class="textClasses">{{ selectedData.text }}</span>
    </div>
    <div v-if="selected">
      <Check class="w-5 h-5 text-white" />
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'
import {
  Check,
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
  categoryId: Number,
  selected: Boolean,
})

const emit = defineEmits(['click'])

// 아이콘
const iconMap = {
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

// 카테고리
const categoryList = {
  1: '식비',
  2: '카페 · 간식',
  3: '편의점 · 마트 · 잡화',
  4: '술 · 유흥',
  5: '쇼핑',
  6: '취미 · 여가',
  7: '의료 · 건강 · 피트니스',
  8: '주거 · 통신',
  9: '보험 · 세금 · 기타금융',
  10: '미용',
  11: '교통',
  12: '교육',
  13: '생활',
  14: '카테고리 없음',
  15: '이체',
  16: '급여',
  17: '저축 · 투자',
}

const selectedData = computed(() => {
  return {
    icon: iconMap[props.categoryId] || HelpCircle,
    text: categoryList[props.categoryId] || '',
  }
})

// 선택된 카테고리일 때 배경색과 텍스트 색 동적 적용
const buttonClasses = computed(() => {
  return [
    'flex items-center justify-between w-full px-4 py-3 border-b border-gray-200 cursor-pointer rounded-xl', // 라운드 추가
    props.selected ? 'bg-[#6AA25A] text-white' : 'bg-transparent text-gray-700',
    'hover:bg-[#6AA25A]/65', // hover 시 연한 색상으로 표시
  ]
})

// 아이콘 색상
const iconClasses = computed(() => {
  return props.selected ? 'w-5 h-5 text-white' : 'w-5 h-5 text-gray-500'
})

// 텍스트 색상
const textClasses = computed(() => {
  return props.selected ? 'text-white' : 'text-gray-700'
})

const handleClick = () => {
  emit('click', props.categoryId)
}
</script>

<style scoped></style>
