<template>
  <div class="flex flex-col gap-2">
    <label>이메일</label>
    <input
      type="email"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :placeholder="placeholder"
      class="w-full bg-gray-100 px-4 py-2 rounded-xl text-gray-800 focus:outline-none"
      v-bind="$attrs"
    />
    <p v-if="showWarning" class="text-sm text-red-500">유효한 이메일 주소를 입력해주세요.</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: 'example@email.com',
  },
})

defineEmits(['update:modelValue'])

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const showWarning = computed(() => {
  return props.modelValue !== '' && !emailRegex.test(props.modelValue)
})
</script>
