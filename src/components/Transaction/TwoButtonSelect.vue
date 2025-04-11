<template>
  <div class="flex gap-2 w-full">
    <button
      v-for="option in options"
      :key="option.value"
      @click="handleClick(option)"
      :class="getButtonClass(option)"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: '', // 실제 저장 값: 'INCOME' 또는 'EXPENDITURE'
  },
  options: {
    type: Array,
    default: () => [
      { label: '수입', value: 'INCOME' },
      { label: '지출', value: 'EXPENDITURE' },
    ],
  },
})

const emit = defineEmits(['update:modelValue'])

const isSelected = (option) => props.modelValue === option.value

const getButtonClass = (option) => {
  const baseClass =
    'flex-1 px-4 py-2 rounded-xl text-sm sm:text-base flex justify-center items-center border gap-2 font-bold hover:cursor-pointer text-center'
  const selectedClass = 'text-white bg-black border-black hover:bg-gray-800'
  const unselectedClass = 'text-gray-400 bg-gray-100 border-gray-200 hover:bg-gray-200'

  return [baseClass, isSelected(option) ? selectedClass : unselectedClass].join(' ')
}

const handleClick = (option) => {
  const newValue = isSelected(option) ? '' : option.value
  emit('update:modelValue', newValue)
}
</script>

<style scoped></style>
