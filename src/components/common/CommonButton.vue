<template>
  <button :class="computedClasses" @click="handleClick">
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue'
// Props
const props = defineProps({
  variant: {
    type: String,
    default: 'black', // 기본값
    validator: (v) => ['white', 'black', 'warning'].includes(v),
  },
  class: {
    type: String,
    default: '',
  },
  onClick: {
    type: Function,
    default: null,
  },
})

// Variant 별 클래스
const baseClass =
  'px-4 py-2 rounded-xl flex border items-center gap-2 hover:cursor-pointer font-bold'

const variants = {
  white: 'text-black border-black bg-white hover:bg-gray-100',
  black: 'text-white bg-black border-black hover:bg-gray-800',
  warning: 'text-red-500 border-red-500 bg-white hover:bg-red-50',
}

const computedClasses = computed(() => {
  return `${baseClass} ${variants[props.variant]} ${props.class}`.trim()
})

// 클릭 이벤트 처리 함수
const handleClick = (e) => {
  if (props.onClick) {
    props.onClick(e)
  }
}
</script>
