import type { AxiosRequestConfig, GenericAbortSignal, InternalAxiosRequestConfig } from 'axios'
import type { ValueOf } from 'element-plus/es/components/table/src/table-column/defaults.mjs'

/**
 * AbortController 自定义中断请求配置
 */
export interface CustomAbortRequestConfig {
  url?: string
  method?: string
  params?: any
  data?: any
  signal?: GenericAbortSignal | AbortSignal | null
}

/**
 * axios 扩展配置参数，基本参数
 */
export interface CustomAxiosBaseConfig {
  /**
   * 控制是否取消重复的请求，默认为true。
   * true：重复请求需要取消，对于不小心连续触发多个相同的请求的情况，取消重复的请求
   * false：重复请求不需要取消
   */
  cancel?: boolean
}
/** axios 扩展参数配置 */
export interface CustomAxiosConfig<D = any> extends CustomAxiosBaseConfig, AxiosRequestConfig<D> {}
/** axios 拦截器扩展参数配置 */
export interface CustomAxiosInterceptorsConfig<D = any> extends CustomAxiosBaseConfig, InternalAxiosRequestConfig<D> {}

/**
 * fetch 扩展配置参数，继承 fetch 原有 config
 */
export interface FetchConfig<D = any> extends RequestInit {
  /** `baseURL` 将自动加在 `url` 前面，如果 `url` 是一个绝对 URL，则会忽略 `baseURL`。 */
  baseURL?: string
  /** `url` 是用于请求的服务器 URL */
  url?: string
  /** `method` 是创建请求时使用的方法 */
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  /** `params` 是与请求一起发送的 URL 参数，必须是一个简单对象或 URLSearchParams 对象 */
  params?: object
  /** `data` 是作为请求体被发送的数据，仅适用 'PUT', 'POST', 'DELETE 和 'PATCH' 请求方法 */
  data?: D
  /** `timeout` 指定请求超时的毫秒数。如果请求时间超过 `timeout` 的值，则请求会被中断 */
  timeout?: number
  /**
   * `cancel` 控制是否取消重复的请求，默认为true。
   * @description `true`：取消重复请求，对于不小心连续触发多个相同的请求的情况，可以取消重复的请求。
   * @description `false`：不取消重复请求。
   */
  cancel?: boolean
  /**
   * `onReady()`请求响应成功，准备流式输出
   * @param response 响应值 response
   * @returns
   */
  onReady?: (response: FetchResponse<D>) => void
  /**
   * `onChunk()` 开启 stream 流式响应并回调函数
   * @param reader 二进制字节流，一般用于下载文件流
   * @param chunk TextDecoder()解码后的文本流，一般用于文字流式输出
   * @returns
   */
  onStream?: (reader: Uint8Array<ArrayBufferLike>, chunk: string) => void
}

/**
 * 请求响应成功，准备流式输出，类型提取自 `FetchConfig.onReady`
 * @param response 响应值 response
 * @returns
 */
export type OnReady<T> = ValueOf<Pick<FetchConfig<T>, 'onReady'>>
/**
 * 开启 stream 流式响应并回调函数，类型提取自 `FetchConfig.onStream`
 * @param reader 二进制字节流，一般用于下载文件流
 * @param chunk TextDecoder()解码后的文本流，一般用于文字流式输出
 * @returns
 */
export type OnStream = ValueOf<Pick<FetchConfig, 'onStream'>>

/**
 * fetch 扩展响应参数，继承 fetch 原有 Response
 */
export interface FetchResponse<D = any> extends Response {
  config?: FetchConfig<D>
}

/**
 * 请求响应参数（不包含data）
 */
export interface Result {
  code: number
  message: string
}

/**
 * 请求响应参数（包含data），继承 Result
 */
export interface ResultData<T> extends Result {
  data: T
}
