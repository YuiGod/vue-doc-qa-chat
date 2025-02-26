import { createRouter, createWebHistory } from 'vue-router'
import LayoutClassic from '@/layout/LayoutClassic.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/chat'
    },
    {
      path: '/',
      component: LayoutClassic,
      children: [
        {
          path: '/chat',
          name: 'chat',
          meta: {
            title: '聊天',
            icon: 'ChatDotRound'
          },
          component: () => import('@/views/chat/index.vue')
        },
        {
          path: '/documents',
          name: 'documents',
          meta: {
            title: '上传文档',
            icon: 'Document'
          },
          component: () => import('@/views/documents/index.vue')
        },
        {
          path: '/test',
          name: 'test',
          meta: {
            title: 'md主题测试',
            icon: 'Warning'
          },
          component: () => import('@/views/test/index.vue')
        }
      ]
    }
  ]
})

export default router
