<script setup lang="ts">
import { chatSessionsApi, chatSessionsDeleteApi, chatSessionsEditApi } from '@/api/chatSession'
import type { ChatSessionResponseType } from '@/api/chatSession/types'
import { onMounted, ref, toRaw } from 'vue'

/** v-model */
const visible = defineModel('visible')
const activeId = defineModel('activeId')

/** emit */
const emit = defineEmits<{
  /** 列表Item点击事件 */
  itemClick: [chatSession: ChatSessionResponseType]
  /** 重命名提交成功触发事件 */
  rename: [title: string, chatSessionId: string]
  /** 会话删除成功触发事件 */
  delete: [chatSessionId: string]
}>()

const loading = ref(false)
const chatSessionsMap = ref(new Map<string, ChatSessionResponseType[]>())

onMounted(async () => {
  loadData()
})

/**
 * 列表项点击事件
 */
const onItemClick = async (item: ChatSessionResponseType) => {
  emit('itemClick', toRaw(item))
  visible.value = false
  activeId.value = item.id
}

/**
 * 加载会话列表
 */
async function loadData() {
  loading.value = true
  const res = await chatSessionsApi().finally(() => (loading.value = false))
  chatSessionByDate(res.data)
}

/**
 * 根据日期分组
 * @param chatSessionList 会话列表
 */
function chatSessionByDate(chatSessionList: ChatSessionResponseType[]) {
  const toData = new Date(new Date().toLocaleDateString()).getTime()
  const todayStart = toData
  const todayEnd = todayStart + 24 * 60 * 60 * 1000 - 1
  const yesterdayStart = toData - 3600 * 24 * 1000
  const yesterdayEnd = yesterdayStart + 24 * 60 * 60 * 1000 - 1
  const past7daysStart = toData - 7 * 3600 * 24 * 1000

  chatSessionsMap.value.clear()
  const todayList = []
  const yesterdayList = []
  const past7daysList = []
  const otherList = []

  for (const chatSession of chatSessionList) {
    // 获取对话记录时间戳
    const sessionDate = Date.parse(new Date(chatSession.date).toString())
    if (sessionDate >= todayStart && sessionDate <= todayEnd) {
      todayList.push(chatSession)
      chatSessionsMap.value.set('今天', todayList)
    } else if (sessionDate >= yesterdayStart && sessionDate <= yesterdayEnd) {
      yesterdayList.push(chatSession)
      chatSessionsMap.value.set('昨天', yesterdayList)
    } else if (sessionDate >= past7daysStart && sessionDate <= yesterdayStart) {
      past7daysList.push(chatSession)
      chatSessionsMap.value.set('7天内', past7daysList)
    } else {
      otherList.push(chatSession)
      chatSessionsMap.value.set('7天外', otherList)
    }
  }
}

/**
 * 列表更多按钮，下拉菜单按钮
 * @param command 下拉项回调值
 */
const onCommand = (command: { index: number; chatSession: ChatSessionResponseType }) => {
  const { index, chatSession } = command

  if (index === 1) {
    ElMessageBox.prompt('', '重命名', {
      inputValue: chatSession.title,
      inputPlaceholder: '请输入标题……',
      inputPattern: /^.+$/,
      inputErrorMessage: '文本不能为空！',
      beforeClose: async (action, instance, done) => {
        if (action === 'confirm') {
          instance.confirmButtonLoading = true
          instance.confirmButtonText = '提交中'
          const inputValue = instance.inputValue
          chatSession.title = inputValue

          const response = await chatSessionsEditApi(chatSession).finally(() => (instance.confirmButtonLoading = false))
          emit('rename', response.data.title, response.data.id)
          ElMessage.success('修改成功！')
          loadData()
          done()
        } else {
          done()
        }
      }
    }).catch(() => {})
  } else if (index === 2) {
    ElMessageBox.confirm('删除后，该对话将不可恢复。确认删除吗？', '永久删除对话', {
      type: 'error',
      beforeClose: async (action, instance, done) => {
        if (action === 'confirm') {
          instance.confirmButtonLoading = true
          instance.confirmButtonText = '提交中'

          await chatSessionsDeleteApi(chatSession.id).finally(() => (instance.confirmButtonLoading = false))
          emit('delete', chatSession.id)
          ElMessage.success('删除成功！')
          loadData()
          done()
        } else {
          done()
        }
      }
    }).catch(() => {})
  }
}
</script>

<template>
  <div class="history">
    <div class="history-header">
      <el-button size="small" icon="CloseBold" circle @click="visible = false" />
    </div>
    <el-skeleton :loading="loading" :rows="10" :throttle="300" animated>
      <el-empty v-if="!loading && chatSessionsMap.size === 0" />
      <ElScrollbar v-else>
        <div class="history-content">
          <template v-for="[key, sessionList] of chatSessionsMap" :key="key">
            <div class="history-label">{{ key }}</div>

            <template v-for="item in sessionList" :key="item.id">
              <div class="history-item" :class="{ active: activeId === item.id }">
                <div class="item-content">
                  <el-tooltip
                    class="box-item"
                    :disabled="!item.title || item.title.length < 15"
                    :content="item.title"
                    placement="top-start"
                  >
                    <span class="item-text" @click="onItemClick(item)">{{ item.title }}</span>
                  </el-tooltip>

                  <div class="placeholder" :class="{ active: activeId === item.id }"></div>

                  <el-dropdown placement="bottom-start" trigger="click" @command="onCommand">
                    <el-button class="extra" :class="{ active: activeId === item.id }" size="small" type="warning" plain round>
                      <el-icon><More /></el-icon>
                    </el-button>

                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item :command="{ index: 1, chatSession: item }">
                          <el-icon><Edit /></el-icon>重命名
                        </el-dropdown-item>
                        <el-dropdown-item :command="{ index: 2, chatSession: item }">
                          <el-icon><Delete /></el-icon>删除
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </div>
              </div>
            </template>
          </template>
        </div>
      </ElScrollbar>
    </el-skeleton>
  </div>
</template>

<style lang="scss" scoped>
.history {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 500px;

  .history-header {
    margin-bottom: 10px;
    text-align: end;
  }

  .history-content {
    flex: 1;
    overflow: auto;

    .history-label {
      height: 40px;
      font-weight: bold;
      line-height: 40px;
      color: var(--el-color-info);
    }

    .history-item {
      position: relative;
      height: 40px;
      padding-left: 10px;
      margin-right: 10px;
      line-height: 40px;
      cursor: pointer;
      border-radius: 10px;
      transition: all 0.3s ease;

      &:hover {
        background-color: var(--el-menu-hover-bg-color);
      }

      .item-content {
        display: flex;
        align-items: center;
        height: 100%;

        .item-text {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          color: var(--el-text-color-primary);
          white-space: nowrap;
        }

        .placeholder {
          width: 0;
        }

        .placeholder.active {
          width: 50px;
        }
      }

      .extra {
        position: absolute;
        top: -12px;
        right: 10px;
        width: 30px;
        opacity: 0;
      }

      .extra.active {
        opacity: 1;
      }

      &:hover .placeholder {
        width: 50px;
      }

      &:hover .extra {
        opacity: 1;
      }
    }

    .history-item.active {
      color: var(--el-menu-active-color);
      background-color: var(--el-color-primary-light-7);
    }

    .history-group {
      margin-top: 15px;
      color: var(--el-color-info);
    }
  }
}
</style>
