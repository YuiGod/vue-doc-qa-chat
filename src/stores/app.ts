import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * 项目 全局状态
 */
export const useAppStore = defineStore('app', () => {
  // 标题
  const title = ref(import.meta.env.VITE_APP_TITLE)
  // 折叠菜单
  const collapse = ref(false)

  return { title, collapse }
})
