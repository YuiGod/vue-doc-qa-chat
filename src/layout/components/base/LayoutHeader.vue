<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import { computed } from 'vue'

const appStore = useAppStore()
const viteTitle = computed(() => {
  return appStore.title
})
</script>

<template>
  <div class="header">
    <div>
      <img src="@/assets/logo.svg" alt="" />
      <span>{{ viteTitle }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--el-header-height);
  padding-left: 0;
  font-size: 20px;
  color: #fff;

  > div {
    display: flex;
    align-items: center;

    img {
      height: 30px;
    }

    span {
      margin-left: 5px;
    }
  }
}
</style>
