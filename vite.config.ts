import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
// 按需导入
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { createProxy } from './src/utils/proxy'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 获取.env文件的VITE_前缀变量
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      vue(),
      vueDevTools(),
      AutoImport({
        resolvers: [
          ElementPlusResolver({
            importStyle: 'sass',
            directives: true
          })
        ]
      }),
      Components({
        resolvers: [
          ElementPlusResolver({
            importStyle: 'sass',
            directives: true
          })
        ]
      })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/styles/element/index.scss" as *;`
        }
      }
    },
    server: {
      port: Number(env.VITE_PORT),
      ...(env.VITE_PROXY ? { proxy: createProxy(JSON.parse(env.VITE_PROXY)) } : {})
    }
  }
})
