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
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      color="inherit"
      style="font-size: 20px"
    >
      <path fill="none" d="M0 0h24v24H0V0z"></path>
      <path
        d="M10.25 13a1.25 1.25 0 11-2.5 0 1.25 1.25 0 012.5 0zM15 11.75a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5zm7 .25c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2s10 4.48 10 10zM10.66 4.12C12.06 6.44 14.6 8 17.5 8c.46 0 .91-.05 1.34-.12C17.44 5.56 14.9 4 12 4c-.46 0-.91.05-1.34.12zM4.42 9.47a8.046 8.046 0 003.66-4.44 8.046 8.046 0 00-3.66 4.44zM20 12c0-.78-.12-1.53-.33-2.24-.7.15-1.42.24-2.17.24a10 10 0 01-7.76-3.69A10.016 10.016 0 014 11.86c.01.04 0 .09 0 .14 0 4.41 3.59 8 8 8s8-3.59 8-8z"
      ></path>
    </svg>
  </el-icon>
</template>
