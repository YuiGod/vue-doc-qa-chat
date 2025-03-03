import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// 重置默认样式
import '@/styles/reset.scss'
// markdown 样式
import '@/styles/markdown/mdmdt-light.scss'
import '@/styles/markdown/plugins.scss'
// elementplus 自定义样式
import '@/styles/index.scss'
// elementplus 图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// elementplus 图标注册
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')
