/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly NODE_ENV: 'development' | 'production' | 'test'
  /** vite_title 标题 */
  readonly VITE_TITLE: string
  /** 后端axios接口地址 */
  readonly VITE_API_BASEURL: string
  /** vite本地端口 */
  readonly VITE_PORT: number
  /** 开发环境跨域代理，支持配置多个 */
  readonly VITE_PROXY: string[]
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
