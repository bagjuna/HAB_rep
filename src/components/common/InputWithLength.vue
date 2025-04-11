<template>
  <div class="space-y-1">
    <CommonInput v-model="text" :placeholder="placeholder" :maxlength="maxLength" v-bind="$attrs" />
    <div class="text-right text-sm text-gray-400">{{ text.length }} / {{ maxLength }}</div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import CommonInput from './CommonInput.vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  maxLength: {
    type: Number,
    default: 255,
  },
})

const emit = defineEmits(['update:modelValue'])

const text = ref(props.modelValue)

// 외부에서 modelValue 변경 시 반영
watch(
  () => props.modelValue,
  (val) => {
    text.value = val
  },
)

// 내부 값 변경 시 emit
watch(text, (val) => {
  emit('update:modelValue', val)
})
</script>
