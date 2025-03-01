<script setup lang="ts">
import { computed } from 'vue'

/** props */
interface Props {
  /** 文本内容 */
  content: string
  /** 是否报错 */
  error?: boolean | string
}

const { content, error = false } = defineProps<Props>()

const errorContent = computed(() => {
  let err = '请求响应失败。'
  if (error) {
    if (typeof error === 'string') {
      err += error
    }
  }

  return err
})
</script>

<template>
  <div class="chat-human">
    <div class="chat-container">
      <el-tooltip v-if="error" :content="errorContent" placement="top">
        <ErrorIcon class="error"></ErrorIcon>
      </el-tooltip>

      <div class="chat-content">
        {{ content }}
      </div>

      <HumanIcon size="32px" class="human-icon" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.chat-human {
  display: flex;
  justify-content: flex-end;
  margin-left: 10%;

  .chat-container {
    display: flex;
    align-items: center;
    padding: 12px 16px 12px 12px;
    background-color: #d2d2d2;
    border-radius: 8px;

    .error {
      flex-shrink: 0;
      margin-right: 10px;
      cursor: pointer;
    }

    .chat-content {
      margin-right: 24px;
      line-height: 24px;
      white-space: pre-wrap;
    }

    .human-icon {
      flex-shrink: 0;
      color: #fff;
      background-color: #ff6c6c;
      border-radius: 8px;
    }
  }
}
</style>
