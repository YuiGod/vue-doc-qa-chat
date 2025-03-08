<script setup lang="ts">
import type { Ref } from 'vue'
import type { ChatSessionResponseType } from '@/api/chatSession/types'
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import { chatApi, chatCancelRequest, chatHistoryApi } from '@/api/chat'
import { chatSessionsAddApi } from '@/api/chatSession'

import HumanChat from './components/HumanChat.vue'
import AssistantChat from './components/AssistantChat.vue'
import ChatHistory from './components/ChatHistory.vue'

/** 配置组件名，使 KeepAlive 能找到该组件 */
defineOptions({ name: 'Chat' })

type Chat = {
  role: string
  content: string
  think?: string
  isStream?: boolean
  error?: boolean | string
}

/** 对话id */
const chatSessionId = ref('')
const chatTitle = ref('')

/** 响应式对话，界面显示历史 */
const chatting: Ref<Chat[]> = ref([])
/** 用户输入消息 */
const humanInput = ref('')

const loading = ref(false)
const disabled = ref(false)
/** 历史会话列表框显隐 */
const historyVisible = ref(false)

/** 监听 assistant 是否正在流式输出文字 */
const isStream = ref(false)
/** 监听是否使用了鼠标滚轮 */
const isWheelMove = ref(false)

const chatMainRef = ref<HTMLDivElement>()

/**
 * 历史记录列表，item点击事件
 * @param chatSession 会话记录
 */
const onHistoryItemClick = async (chatSession: ChatSessionResponseType) => {
  const response = await chatHistoryApi(chatSession.id)
  chatting.value = response.data
  chatTitle.value = chatSession.title
  chatSessionId.value = chatSession.id
  scrollToButtom(chatMainRef.value!)
}

/**
 * 会话重命名标题后的回调
 */
const onHistoryItemRename = (title: string, id: string) => {
  // 如果重命名的会话记录和当前正在聊天的会话相同，则更新标题
  if (chatSessionId.value === id) {
    chatTitle.value = title
  }
}

const onHistoryItemDelete = (id: string) => {
  if (chatSessionId.value === id) {
    onRestartNewChat()
  }
}

/**
 * 输入框提交
 */
const onSubmit = async () => {
  if (humanInput.value === '') {
    ElMessage.warning('请输入对话内容。')
    return
  }
  if (!chatSessionId.value) {
    disabled.value = true
    loading.value = true

    try {
      const res = await chatSessionsAddApi({ title: humanInput.value })
      chatSessionId.value = res.data.id
      chatTitle.value = res.data.title
      startChatting()
    } catch {
      disabled.value = false
      loading.value = false
    }
  } else {
    startChatting()
  }
}

/**
 * 开始对话，流式响应
 */
function startChatting() {
  disabled.value = true
  loading.value = true
  isWheelMove.value = false
  scrollToButtom(chatMainRef.value!)

  const userChat = ref<Chat>({
    role: 'user',
    content: humanInput.value,
    error: false
  })
  const assistantChat = ref<Chat>({
    role: 'assistant',
    content: '',
    think: '',
    isStream: false,
    error: false
  })

  // 请求参数
  const data = {
    model: 'deepseek-r1:7b',
    messages: {
      role: userChat.value.role,
      content: userChat.value.content
    },
    chat_session_id: chatSessionId.value,
    stream: true
  }
  let isThinking = false
  let buffer = ''
  // 请求后台 chat
  chatApi(
    data,
    () => {
      humanInput.value = ''
      chatting.value.push(userChat.value)
      chatting.value.push(assistantChat.value)
      assistantChat.value.isStream = true
      isStream.value = true
      loading.value = false
    },
    (_reader, chunk) => {
      const lines = chunk.split('\n').filter(line => line.trim())
      for (const line of lines) {
        if (line.trim() === '') {
          continue
        }
        const data = JSON.parse(line)
        const content = data.message.content as string

        // 截取 think 标签的内容
        if (content === '<think>') {
          isThinking = true
          continue
        }
        if (content === '</think>') {
          isThinking = false
          continue
        }

        if (isThinking) {
          assistantChat.value.think += content
        } else {
          assistantChat.value.content += content
        }

        if (content.indexOf('\n')) {
          buffer = ''
          scrollToButtom(chatMainRef.value!)
        }
        buffer += content

        if (!isWheelMove.value && buffer.length >= 50) {
          scrollToButtom(chatMainRef.value!)
        }

        if (buffer.length >= 50) {
          buffer = ''
        }
      }
    }
  )
    .catch(error => {
      userChat.value.error = error.message
      assistantChat.value.error = error.message
    })
    .finally(() => {
      disabled.value = false
      loading.value = false
      isStream.value = false
      assistantChat.value.isStream = false
    })
}

/**
 * 输入框键盘事件
 * @param event KeyboardEvent
 */
const inputKeyboard = (event: KeyboardEvent | Event) => {
  const e = event as KeyboardEvent
  // Shift + Enter 换行
  if (e.key == 'Enter' && e.shiftKey) {
    return
  }
  // Ctrl + Enter 换行
  if (e.key == 'Enter' && e.ctrlKey) {
    humanInput.value = humanInput.value + '\n'
  } else if (e.key == 'Enter') {
    // Enter 提交
    event.preventDefault()
    onSubmit()
  }
}

/**
 * 取消请求
 */
const onCancelRequest = () => {
  chatCancelRequest()
}

/**
 * 开启新对话
 */
const onRestartNewChat = () => {
  chatSessionId.value = ''
  chatTitle.value = ''
  humanInput.value = ''
  loading.value = false
  disabled.value = false
  chatting.value = []
  chatCancelRequest()
  ElMessage.success('开始新对话。')
}

/**
 * 判断容器是否滚动到底部
 * @param element 指定目标容器 Element
 * @param threshold 误差高度阈值
 */
const isMoveToBottom = (element: HTMLDivElement | undefined, threshold: number = 1): boolean => {
  if (!element) {
    return false
  }
  const { scrollTop, clientHeight, scrollHeight } = element
  return scrollTop + clientHeight >= scrollHeight - threshold
}

/**
 * 鼠标滚轮监听事件
 */
const handleWhell = () => {
  isWheelMove.value = true
}

/**
 * 滚动条监听事件
 */
const handleScroll = () => {
  if (isMoveToBottom(chatMainRef.value)) {
    isWheelMove.value = false
  }
}

onMounted(() => {
  document.addEventListener('wheel', handleWhell)
  document.addEventListener('scroll', handleScroll, true)
})

onUnmounted(() => {
  document.removeEventListener('wheel', handleWhell)
  document.removeEventListener('scroll', handleScroll)
})

function scrollToButtom(div: Element | null) {
  if (div === null) {
    return
  }

  nextTick(() => {
    div.scrollTop = div.scrollHeight
  })
}
</script>

<template>
  <div class="chat-container">
    <div class="chat-header">
      <el-tooltip class="box-item" :content="chatTitle" placement="bottom">
        <span class="title">{{ chatTitle }}</span>
      </el-tooltip>
    </div>

    <div ref="chatMainRef" class="chat-main">
      <div class="chat-content">
        <div class="chat">
          <AssistantChat key="system" :content="'您好！我是贴心的小助手，有什么可以帮助您的吗？'"></AssistantChat>
          <template v-for="(item, index) in chatting">
            <HumanChat :key="index" v-if="item.role === 'user'" :content="item.content" :error="item.error"></HumanChat>
            <AssistantChat
              :key="index"
              v-if="item.role === 'assistant'"
              :content="item.content"
              :think="item.think"
              :is-stream="item.isStream"
              :hasThinkCard="true"
              :error="item.error"
            ></AssistantChat>
          </template>
        </div>

        <div class="chat-input-container">
          <div class="chat-loading" v-if="loading">
            <ChatLoading></ChatLoading>
          </div>
          <div class="input-card">
            <el-input
              v-model="humanInput"
              class="chat-send-input"
              type="textarea"
              :autofocus="true"
              :autosize="{ minRows: 3, maxRows: 20 }"
              :readonly="disabled"
              maxlength="2000"
              show-word-limit
              @keydown.enter="inputKeyboard"
              placeholder="请输入对话内容……"
            >
            </el-input>

            <div class="bottom-send">
              <el-button v-if="isStream" type="primary" plain round @click="onCancelRequest">
                <StopIcon size="20px" />
              </el-button>
              <el-button v-else type="primary" plain round :loading="loading" :disabled="disabled" @click="onSubmit">
                <SendIcon size="20px" />
              </el-button>
            </div>

            <div class="chat-send-bottom-controls">
              <el-text type="info" size="small">内容由 AI 生成，请仔细甄别</el-text>
              <div class="send-controls-extra">
                <el-button-group>
                  <el-popover
                    :popper-style="{ borderRadius: '26px' }"
                    :visible="historyVisible"
                    placement="top-end"
                    :width="350"
                    trigger="click"
                    :persistent="false"
                  >
                    <template #reference>
                      <el-button round @click="historyVisible = !historyVisible">历史对话</el-button>
                    </template>
                    <ChatHistory
                      v-model:visible="historyVisible"
                      v-model:active-id="chatSessionId"
                      @item-click="onHistoryItemClick"
                      @rename="onHistoryItemRename"
                      @delete="onHistoryItemDelete"
                    />
                  </el-popover>

                  <el-button round type="primary" @click="onRestartNewChat">新对话</el-button>
                </el-button-group>
              </div>
              <div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.chat-container {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom right, #fff9f6, 60%, #ebded3);

  .chat-header {
    display: flex;
    flex: none;
    align-items: center;
    justify-content: center;
    height: 60px;

    .title {
      max-width: 1000px;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 18px;
      font-weight: bold;
      white-space: nowrap;
    }
  }

  .chat-main {
    position: relative;
    display: flex;
    flex: 1;
    justify-content: center;
    width: 100%;
    min-height: calc(100% - 60px);
    overflow: auto;

    .chat-content {
      position: relative;
      display: flex;
      flex-grow: 1;
      flex-direction: column;
      max-width: 1000px;
      height: 100%;

      .chat {
        box-sizing: border-box;
        flex: 1;
        width: 100%;
        padding: 0 20px 30px;
      }

      .chat-input-container {
        position: sticky;
        bottom: 0;
        z-index: 1;
        box-sizing: border-box;
        display: flex;
        flex-shrink: 0;
        flex-direction: column;
        align-items: center;
        width: 100%;
        margin-top: auto;

        .chat-loading {
          margin-bottom: 5px;
        }

        .input-card {
          position: relative;
          box-sizing: border-box;
          width: 100%;
          padding: 20px;
          background-color: #f4e9db;
          border-radius: 26px 26px 0 0;
          box-shadow: rgb(0 0 0 / 18%) 4px 14px 24px 14px;

          .chat-send-input {
            flex: 1;
            /* stylelint-disable-next-line selector-class-pattern */
            :deep(.el-textarea__inner) {
              padding: 10px 66px 20px 24px;
              resize: none;
              background-color: #f7f7f7;
              border: 0;
              border-radius: 26px;
              box-shadow: none;

              &:focus {
                outline: none;
                box-shadow: 0 0 0 1px var(--el-color-primary-light-5) inset;
              }

              &:read-only {
                box-shadow: none;
              }
            }
            /* stylelint-disable-next-line selector-class-pattern */
            :deep(.el-input__count) {
              right: 16px;
            }
          }

          .bottom-send {
            position: absolute;
            right: 32px;
            bottom: 88px;
            display: flex;
            align-items: center;
            font-size: var(--el-font-size-small);
            color: var(--el-text-color-placeholder);

            .el-button {
              margin-left: 10px;
            }
          }

          .chat-send-bottom-controls {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 35px;
            margin-top: 10px;

            .send-controls-extra {
              position: absolute;
              top: 0;
              left: 0;
            }
          }
        }
      }
    }
  }
}
</style>
