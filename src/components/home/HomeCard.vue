<template>
  <div
    class="flex flex-col justify-between rounded-xl shadow-md p-4 w-full flex-1 min-h-[98px] relative"
    :class="[bgColor, textColor]"
  >
    <div class="flex justify-between items-start w-full h-full">
      <span class="text-left self-start text-sm" v-html="title"></span>
      <IconButton
        v-if="iconButton"
        :onClick="iconButton.onClick"
        class="text-gray-600 hover:text-gray-900"
      >
        <component :is="iconButton.icon" class="w-5 h-5" />
      </IconButton>
    </div>
    <slot />
    <div class="w-full flex justify-end">
      <span class="text-lg font-semibold self-end">{{ formattedAmount }} 원</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import IconButton from '@/components/common/IconButton.vue'

const props = defineProps({
  title: {
    type: String,
    default: '제목 없음',
  },
  amount: {
    type: Number,
    default: 0,
  },
  bgColor: {
    type: String,
    default: 'bg-gray-100',
  },
  textColor: {
    type: String,
    default: 'text-black',
  },
  iconButton: {},
  type: {
    type: String,
    default: '', // 'income' 또는 'expenditure'
  },
})

// 부호 붙인 금액 텍스트
const formattedAmount = computed(() => {
  const sign = props.type === 'income' ? '+' : props.type === 'expenditure' ? '-' : ''
  return `${sign}${props.amount.toLocaleString()} `
})
</script>
