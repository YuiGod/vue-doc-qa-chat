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
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5.69362 11.9997L2.29933 3.2715C2.0631 2.66403 2.65544 2.08309 3.2414 2.28959L3.33375 2.32885L21.3337 11.3288C21.852 11.588 21.8844 12.2975 21.4309 12.6129L21.3337 12.6705L3.33375 21.6705C2.75077 21.962 2.11746 21.426 2.2688 20.8234L2.29933 20.7278L5.69362 11.9997L2.29933 3.2715L5.69362 11.9997ZM4.4021 4.54007L7.01109 11.2491L13.6387 11.2497C14.0184 11.2497 14.3322 11.5318 14.3818 11.8979L14.3887 11.9997C14.3887 12.3794 14.1065 12.6932 13.7404 12.7428L13.6387 12.7497L7.01109 12.7491L4.4021 19.4593L19.3213 11.9997L4.4021 4.54007Z"
      ></path>
    </svg>
  </el-icon>
</template>
