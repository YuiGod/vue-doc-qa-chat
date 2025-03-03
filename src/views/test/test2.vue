<script setup lang="ts">
import http from '@/http'
import { ref } from 'vue'

const data = ref()

const onClick = async () => {
  const response = await http.get('/hello', { name: 'a' })
  data.value = response
}
</script>
<template>
  <el-button type="primary" @click="onClick">点击测试</el-button>
  <div>{{ data }}</div>
</template>

<style lang="scss" scoped></style>
