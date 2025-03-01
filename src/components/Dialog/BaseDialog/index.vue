<script setup lang="ts">
import { computed, useAttrs, ref, unref, useSlots, watch, nextTick } from 'vue'
import { Close, FullScreen } from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: false,
    default: false
  },
  title: {
    type: String,
    required: false,
    default: '弹窗'
  },
  fullscreen: {
    type: Boolean,
    required: false,
    default: true
  },
  maxHeight: {
    type: [String, Number],
    required: false,
    default: '400px'
  }
})

const getBindValue = computed(() => {
  const delArr: string[] = ['fullscreen', 'title', 'maxHeight']
  const attrs = useAttrs()
  const obj = { ...attrs, ...props }
  Object.keys(obj).forEach(item => {
    if (delArr.indexOf(item) !== -1) {
      delete obj[item as keyof typeof props]
    }
  })
  return obj
})

const slots = useSlots()

// dialog是否全屏以及高度计算
const dialogHeight = ref(typeof props.maxHeight === 'number' ? `${props.maxHeight}px` : props.maxHeight)
const isFullscreen = ref(false)
const toggleFull = () => {
  isFullscreen.value = !unref(isFullscreen)
}
watch(
  () => isFullscreen.value,
  async (val: boolean) => {
    await nextTick()
    if (val) {
      const windowHeight = document.documentElement.offsetHeight
      dialogHeight.value = `${windowHeight - 55 - 60 - (slots.footer ? 63 : 0)}px`
    } else {
      dialogHeight.value = typeof props.maxHeight === 'number' ? `${props.maxHeight}px` : props.maxHeight
    }
  },
  {
    immediate: true
  }
)

const dialogStyle = computed(() => {
  return {
    height: unref(dialogHeight),
    padding: '10px 0'
  }
})
</script>

<template>
  <div>
    <el-dialog
      v-bind="getBindValue"
      :fullscreen="isFullscreen"
      destroy-on-close
      lock-scroll
      draggable
      class="dialog"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <template #header="{ close }">
        <div class="dialog-header">
          <slot name="title">
            <div class="title">
              {{ title }}
            </div>
          </slot>
          <div class="tools">
            <el-button v-if="fullscreen" type="info" link @click="toggleFull">
              <el-icon v-if="!isFullscreen"><FullScreen /></el-icon>
              <el-icon v-else size="18">
                <svg data-v-8d6d3157="" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15">
                  <path
                    fill="currentColor"
                    fill-rule="evenodd"
                    d="M5.5 2a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1 0-1H5V2.5a.5.5 0 0 1 .5-.5m4 0a.5.5 0 0 1 .5.5V5h2.5a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5v-3a.5.5 0 0 1 .5-.5M2 9.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0V10H2.5a.5.5 0 0 1-.5-.5m7 0a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1H10v2.5a.5.5 0 0 1-1 0z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </el-icon>
            </el-button>
            <el-button type="info" link @click="close">
              <el-icon size="18">
                <Close />
              </el-icon>
            </el-button>
          </div>
        </div>
      </template>

      <el-scrollbar :style="dialogStyle">
        <slot></slot>
      </el-scrollbar>

      <template v-if="slots.footer" #footer>
        <slot name="footer"></slot>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.dialog {
  .dialog-header {
    display: flex;
    align-items: center;
    height: 40px;
    padding: 0 15px;
    border-bottom: 1px solid var(--el-border-color);

    .title {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .tools {
      right: 0;
      display: flex;
      align-items: center;
      height: 40px;
    }
  }
}
</style>
