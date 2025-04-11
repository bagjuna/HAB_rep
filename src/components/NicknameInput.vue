<template>
  <div class="space-y-1">
    <div class="flex items-center justify-between">
      <label>닉네임</label>
      <IconButton @click="generateNickname">
        <RefreshCcw />
      </IconButton>
    </div>
    <InputWithLength v-model="modelValue" placeholder="닉네임을 입력해주세요" :maxLength="15" />
  </div>
</template>

<script setup>
import { RefreshCcw } from 'lucide-vue-next'
import { computed } from 'vue'
import IconButton from './common/IconButton.vue'
import InputWithLength from './common/InputWithLength.vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])

const modelValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const generateNickname = () => {
  const samples = [
    '함부기북스',
    '함북스',
    '함부기온앤온',
    '함버거',
    '함박스테이크',
    '함경도버거',
    '함부르크',
  ]
  const random = samples[Math.floor(Math.random() * samples.length)]
  modelValue.value = random
}
</script>
