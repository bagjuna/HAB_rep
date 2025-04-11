<template>
  <div class="relative">
    <input
      type="text"
      :value="formattedValue"
      @input="handleInput"
      :placeholder="placeholder"
      class="w-full bg-gray-100 px-4 py-2 pr-16 rounded-xl text-gray-800 focus:outline-none text-left"
      v-bind="$attrs"
    />
    <!-- 오른쪽에 만원 단위로 변환된 값 표시 -->
    <!-- <span class="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-600">
      {{ convertedValue }}
    </span> -->
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

// Props 정의
const props = defineProps({
  modelValue: {
    type: Number,
    default: 0,
  },
  placeholder: {
    type: String,
    default: '',
  },
})

// 부모 컴포넌트에 숫자값 전달하는 emit 함수 정의
const emit = defineEmits(['update:modelValue'])

// 숫자를 3자리마다 콤마를 넣어 표시하는 함수
const formatNumber = (num) => {
  if (!num) return ''
  return num.toLocaleString('ko-KR')
}

// 입력 필드 표시용 값 (콤마 포함)
const formattedValue = ref('')

// modelValue가 변경되면 입력 필드에 포맷된 값을 동기화
watch(
  () => props.modelValue,
  (val) => {
    formattedValue.value = formatNumber(val)
  },
  { immediate: true },
)

// 입력 처리 함수
const handleInput = (e) => {
  // 숫자가 아닌 모든 문자를 제거
  const raw = e.target.value.replace(/\D/g, '')
  const num = Number(raw)

  // 부모로 숫자값 전달
  emit('update:modelValue', num)
  // 콤마 포함해서 표시
  formattedValue.value = formatNumber(num)
}

// modelValue를 만원 단위 문자열로 변환하는 computed
// const convertedValue = computed(() => {
//   if (!props.modelValue) return ''
//   const mValue = props.modelValue / 10000

//   return `${mValue.toFixed(0)}만원`
// })

// ✅ placeholder 문구 자동 생성
const placeholderText = computed(() => {
  if (props.modelValue && props.modelValue > 0) {
    return `${formatNumber(props.modelValue)}원`
  }
  return '0원'
})
</script>
