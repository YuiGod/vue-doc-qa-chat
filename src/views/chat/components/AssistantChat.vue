<script setup lang="ts">
import DOMPurify from 'dompurify'
import { computed, reactive, ref, watchEffect } from 'vue'
import MarkdownItRender from '@/utils/markdownit'

/** props */
interface Props {
  /** 文本内容 */
  content?: string
  /** 思考内容 */
  think?: string
  /** 是否正在传输流 */
  isStream?: boolean
  /** 是否添加思考内容卡片 */
  hasThinkCard?: boolean
  /** 是否报错 */
  error?: boolean | string
}
const { content = '', think = '', isStream = false, hasThinkCard = false, error = false } = defineProps<Props>()

/** 计算 stream 输出花费的时间 */
const streamtime = reactive({
  startTime: 0,
  diffTime: 0,
  flag: false
})

watchEffect(() => {
  if (isStream) {
    const date = new Date()
    streamtime.startTime = date.getTime()
    streamtime.flag = true
  }
  if (!isStream && streamtime.flag) {
    const date = new Date()
    streamtime.diffTime = Math.ceil((date.getTime() - streamtime.startTime) / 1000)
    streamtime.flag = false
  }
})

/**
 * 错误处理
 */
const errorContent = computed(() => {
  if (typeof error === 'string') {
    return error
  }
  return '服务器繁忙，请稍后再试。'
})

/**
 * 初始化 MarkdownIt 并将文本流传进去
 */
const md = MarkdownItRender()

/**
 * 输出 md 转换后的 html
 */
const renderedContent = computed(() => {
  // XSS 防护
  return DOMPurify.sanitize(md.render(content))
})

const isThinkHidden = ref(false)
function toggle() {
  isThinkHidden.value = !isThinkHidden.value
}
</script>

<template>
  <div class="chat-assistant">
    <AssistantIcon class="assistant-icon" size="32px" />

    <div class="assistant-container">
      <div v-if="hasThinkCard">
        <el-button class="thinking-button" style="border-radius: 6px" type="primary" text bg size="small" @click="toggle()">
          <span v-if="isStream">思考中……</span>
          <span v-else>已思考（用时 {{ streamtime.diffTime }} 秒）</span>
          <el-icon class="el-icon--right" v-if="isThinkHidden"><ArrowDown /></el-icon>
          <el-icon class="el-icon--right" v-else><ArrowUp /></el-icon>
        </el-button>
        <div ref="box" class="think-container" :class="{ 'think-hidden': isThinkHidden }">
          <section class="trigger-section">
            <div class="think">{{ think }}</div>
            <el-button
              v-if="think"
              class="thinking-button"
              type="primary"
              text
              bg
              circle
              icon="ArrowUp"
              size="small"
              @click="toggle()"
            ></el-button>
          </section>
        </div>
      </div>

      <div class="mdmdt">
        <div v-html="renderedContent"></div>
      </div>

      <div v-if="error">
        <el-text size="large">{{ errorContent }}<ErrorIcon style="margin-left: 10px" /></el-text>
      </div>

      <div class="chat-loading" v-if="isStream">
        <el-icon class="is-loading" color="#606266">
          <Loading />
        </el-icon>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.chat-assistant {
  display: flex;
  gap: 8px;
  align-items: baseline;
  padding: 16px 0 16px 16px;
  font-size: 16px;
  border-radius: 8px;

  .assistant-icon {
    flex-shrink: 0;
    margin-top: 4px;
    color: #fff;
    background-color: #165dff;
    border-radius: 6px;
  }

  .assistant-container {
    display: flex;
    flex: 1;
    flex-direction: column;
    width: 0;
    padding-top: 2px;
    line-height: 24px;

    .thinking-button {
      margin-bottom: 6px;
      background-color: #ffe5e5;

      &:hover {
        background-color: #ffdbdb;
      }
    }

    .think-container {
      display: grid;
      grid-template-rows: 1fr;
      overflow: hidden;
      transition: all 0.3s;

      .trigger-section {
        min-height: 0;
        overflow: hidden;
      }
    }

    .think-hidden {
      grid-template-rows: 0fr;
    }

    .think {
      padding-left: 10px;
      font-size: 14px;
      color: var(--el-text-color-secondary);
      white-space: pre-wrap;
      border-left: 2px solid #ccc;
    }

    .chat-loading {
      padding-top: 20px;
    }
  }
}
</style>
