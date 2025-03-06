<script setup lang="ts">
import http from '@/http'
import { ref } from 'vue'

const data = ref()

const chatData = {
  role: 'user',
  content: '测试测试',
  chat_session_id: '79f175e8-cd80-432f-9dec-01a709ddcc40'
}

const demo = 'qqqqqq'
const bd = demo.split('<think>')
console.log(bd)

const onClick = async () => {
  const response = await http.post('/chat/history/add', chatData)
  data.value = response
}
</script>
<template>
  <el-button type="primary" @click="onClick">点击测试</el-button>
  <div>{{ data }}</div>
</template>

<style lang="scss" scoped></style>
