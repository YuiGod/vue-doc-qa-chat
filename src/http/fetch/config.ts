import qs from 'qs'
import type { FetchConfig, FetchResponse } from '../types'
import InterceptorManager from './InterceptorManager'
import { checkStatus } from '../helper/checkStatus'
import { addPending, removePending } from '../helper/abortController'
import { ContentTypeEnum } from '@/enums/httpEnum'

/** 默认baseUrl */
const PATH_URL = import.meta.env.VITE_API_BASEURL

const defaultConfig: FetchConfig = {
  method: 'GET',
  /** 基本路径 */
  baseURL: PATH_URL,
  /** 请求超时时间 */
  timeout: 5000,
  headers: {
    'Content-Type': ContentTypeEnum.JSON
  }
}

/**
 * 请求拦截器
 * @returns 请求拦截器管理
 */
function requestInterceptor<T>(interceptors: InterceptorManager<FetchConfig<T>>) {
  // 添加请求拦截器
  interceptors.use({
    onFulfilled: config => {
      // 重复请求不需要取消，在 api 服务中通过指定的第三个参数: { cancel: false } 来控制
      config.cancel ??= true
      // 在 AbortController 管理中添加该请求
      config.cancel && addPending(config)
      return config
    },
    onRejected: error => {
      return Promise.reject(error)
    }
  })
  return interceptors
}

/**
 * 响应拦截器
 * @returns 响应拦截器管理
 */
function responseInterceptor<T>(interceptors: InterceptorManager<FetchResponse<T>>) {
  let fetchConfig: FetchConfig
  // 添加响应拦截器，处理 Fetch 返回的数据，此时 response 还需要进一步处理
  interceptors.use({
    onFulfilled: response => {
      if (!response.ok) {
        return Promise.reject(checkStatus(response.status, false))
      }
      const { config } = response
      config && (fetchConfig = config)

      // 文本流式响应单独处理
      if (config?.onStream) {
        return handleStream<T>(response, config)
      }

      const contentType = response.headers.get('content-type') || ''
      if (contentType.includes('application/json')) {
        return response.json()
      } else if (contentType.startsWith('text/')) {
        return response.text()
      } else if (contentType.includes('image/')) {
        return response.blob()
      } else if (contentType.includes('multipart/form-data')) {
        return response.formData()
      }
      // 其他类型默认返回文本
      return response.text()
    }
  })

  // 添加响应拦截器，处理最终的数据
  interceptors.use({
    onFulfilled: response => {
      // 在 AbortController 管理中移除该请求
      removePending(fetchConfig)
      return response
    },
    onRejected: error => {
      return Promise.reject(checkStatus(error.code))
    }
  })

  return interceptors
}

/**
 * 处理流式响应
 * @param Response response fetch返回的响应对象
 * @param Function onChunk 处理每个数据块的函数
 */
async function handleStream<T>(response: FetchResponse<T>, config: FetchConfig<T>) {
  if (!config.onStream) {
    return Promise.reject(checkStatus(701, false))
  }

  if (!response.body) {
    return Promise.reject(checkStatus(702, false))
  }
  const reader = response.body.getReader()
  // 用于文本流解码
  const decoder = new TextDecoder()
  config.onReady && config.onReady(response)

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const chunk = decoder.decode(value, { stream: true })
    config.onStream(value, chunk)
  }

  return Promise.resolve({ code: 700, message: '流式响应完成！' })
}

/**
 * Fecth 请求
 * @param url url路径，可以是完整的 url。如果不是完整的，则会从 PATH_URL 中拼接
 * @param config 请求参数配置
 * @returns 返回响应数据 Promise
 */
async function fetchRequest<T = any>(url: string, config: FetchConfig<T> = {}): Promise<T> {
  let requestInterceptors = new InterceptorManager<FetchConfig<T>>()
  let responseInterceptors = new InterceptorManager<FetchResponse<T>>()

  requestInterceptors = requestInterceptor<T>(requestInterceptors)
  responseInterceptors = responseInterceptor<T>(responseInterceptors)

  // 合并基础配置
  const mergedConfig: FetchConfig = {
    ...defaultConfig,
    ...config
  }

  // 处理URL
  let finalURL = url
  if (PATH_URL && !url.startsWith('http')) {
    finalURL = PATH_URL + url
  }
  // 处理查询参数
  if (mergedConfig.params) {
    const params = qs.stringify(mergedConfig.params)
    finalURL += `?${params.toString()}`
  }
  // 处理请求数据
  if (mergedConfig.data) {
    mergedConfig.body = JSON.stringify(mergedConfig.data)
  }
  mergedConfig.url = finalURL

  // 创建 Fetch Promise 链，流程：（请求拦截器 → Fetch请求 → 响应拦截器）
  let promise = Promise.resolve(mergedConfig)

  // 处理请求拦截器数组--遍历所有的请求拦截器
  const requestInterceptorChain: any[] = []
  requestInterceptors.forEach(interceptor => {
    requestInterceptorChain.unshift(interceptor.onFulfilled, interceptor.onRejected)
  })

  // 处理响应拦截器--遍历所有的响应拦截器
  const responseInterceptorChain: any[] = []
  responseInterceptors.forEach(interceptor => {
    responseInterceptorChain.push(interceptor.onFulfilled, interceptor.onRejected)
  })

  // 将拦截器依次添加到 promise 链
  let i = 0
  while (i < requestInterceptorChain.length) {
    promise = promise.then(requestInterceptorChain[i++], requestInterceptorChain[i++])
  }

  // Fetch 请求添加到 promise 链
  promise = promise.then(async config => {
    const response = (await fetch(finalURL, config)) as FetchResponse
    // 将 config 添加到 FetchResponse 中，响应拦截器需要用到 confog
    response.config = config
    return response
  })

  // 响应拦截器依次添加到 promise 链
  i = 0
  while (i < responseInterceptorChain.length) {
    promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++])
  }

  return promise as Promise<T>
}

export { fetchRequest }
