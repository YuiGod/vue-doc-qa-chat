import qs from 'qs'
import type { FetchConfig, FetchResponse } from '../types'
import InterceptorManager from './InterceptorManager'
import { checkStatus } from '../helper/checkStatus'
import { addPending, removePending } from '../helper/abortController'
import { ContentTypeEnum, ResultEnum } from '@/enums/httpEnum'
import HttpError from '../helper/httpError'

/** 默认baseUrl */
const PATH_URL = import.meta.env.VITE_API_BASEURL

const defaultConfig: FetchConfig = {
  method: 'GET',
  /** 基本路径 */
  baseURL: PATH_URL,
  /** 请求超时时间 */
  timeout: ResultEnum.TIMEOUT as number,
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
      // 取消重复的请求，需要当前url请求完成后，才会重新请求。
      config.cancel ??= true
      // 请求开始，在 AbortController 管理中添加该请求
      config.cancel && addPending(config)
      return config
    },
    onRejected: error => {
      return Promise.reject(new HttpError(400, error.message))
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
        // 想要获取后端返回的错误信息，还需要 then 一次 response
        // 与后端协商好返回的错误信息。
        // 默认服务器返回错误对象必须含有 code 和 message 属性，如： {code: 500,message: '响应失败！'}
        return Promise.reject(response.json())

        // 如果不需要处理服务器返回的错误信息
        // return Promise.reject(new HttpError(response.status, ''))
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
    },
    onRejected: error => {
      // 处理除了 2xx 和 5xx 状态码的错误信息。
      return Promise.reject(new HttpError(error.code || 400, error.message))
    }
  })

  /**
   * 添加响应拦截器，处理最终的数据和错误信息。
   */
  interceptors.use({
    onFulfilled: response => {
      // 请求响应完成，在 AbortController 管理中移除该请求
      removePending(fetchConfig)
      return response
    },
    onRejected: async error => {
      // 处理服务器返回 5xx 的错误信息
      const response = await error
      // 统一处理 promise 链的 reject 错误。
      return Promise.reject(checkStatus(response.code, response.message))
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

  const requestInterceptorChain: any[] = []
  requestInterceptors.forEach(interceptor => {
    requestInterceptorChain.push(interceptor.onFulfilled, interceptor.onRejected)
  })

  const responseInterceptorChain: any[] = []
  responseInterceptors.forEach(interceptor => {
    responseInterceptorChain.push(interceptor.onFulfilled, interceptor.onRejected)
  })

  // 将请求拦截器依次添加到 promise 链
  let i = 0
  while (i < requestInterceptorChain.length) {
    promise = promise.then(requestInterceptorChain[i++], requestInterceptorChain[i++])
  }

  // Fetch 请求添加到 promise 链
  promise = promise.then(async newConfig => {
    const response = (await fetch(finalURL, newConfig)) as FetchResponse
    // 将 config 添加到 FetchResponse 中，响应拦截器需要用到 confog
    response.config = newConfig
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
