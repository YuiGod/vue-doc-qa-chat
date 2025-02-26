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
      <path
        d="M510.9 60.7c-245.6 0-446.7 199.8-446.7 446.7C64.2 753 263.9 954 510.8 954s446.6-199.7 446.6-446.6c0.1-245.6-199.6-446.7-446.5-446.7z m139.8 574c0 8.8-7.2 16-16 16H389.3c-8.8 0-16-7.2-16-16V389.3c0-8.8 7.2-16 16-16h245.5c8.8 0 16 7.2 16 16v245.4z"
        p-id="2045"
      ></path>
    </svg>
  </el-icon>
</template>
