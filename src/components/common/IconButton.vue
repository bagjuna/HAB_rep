<template>
  <button
    class="p-2 rounded-full hover:cursor-pointer hover:bg-black/5 transition-colors duration-200"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<script setup>
const props = defineProps({
  onClick: {
    type: Function,
    default: null,
  },
})

const handleClick = (e) => {
  if (props.onClick) {
    props.onClick(e)
  }
}
</script>
