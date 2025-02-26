<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  color?: string
  size?: string | number
}

const { color, size = '1rem' } = defineProps<Props>()

const sizeValue = computed(() => {
  if (typeof size === 'number') {
    return size + 'px'
  }
  return size
})
</script>

<template>
  <el-icon :size="sizeValue" :color="color">
    <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
      <path d="M64 512a448 448 0 1 0 896 0 448 448 0 1 0-896 0z" fill="#FF4C4C" p-id="5069"></path>
      <path
        d="M529.28 192a81.28 81.28 0 0 1 80.256 94.72l-42.88 257.728a37.76 37.76 0 0 1-74.56 0L449.088 286.72A81.28 81.28 0 0 1 529.344 192zM528 800a80 80 0 1 1 0-160 80 80 0 0 1 0 160z"
        fill="#FFFFFF"
        p-id="5070"
      ></path>
    </svg>
  </el-icon>
</template>
