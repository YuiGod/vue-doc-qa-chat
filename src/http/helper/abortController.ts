import type { CustomAbortRequestConfig } from '../types'

/**
 * AbortController 请求管理，用于取消请求操作
 */

// 声明一个 Map 用于存储每个 请求的标识 和对应 AbortController
const pendingMap = new Map<string, AbortController>()

// 获取请求的标识，url，method，data，params 值都一样即为相同请求
const getPendingUrl = (config: CustomAbortRequestConfig) => {
  return [config.method, config.url].join('&')
}

/**
 * @description: 添加请求到 pendingMap 中
 * @param config 请求参数配置
 * @return void
 */
function addPending(config: CustomAbortRequestConfig) {
  // 在请求开始前，对之前的请求做检查取消操作
  removePending(config)
  const url = getPendingUrl(config)
  const controller = new AbortController()
  config.signal = controller.signal
  pendingMap.set(url, controller)
}

/**
 * @description: 从 pendingMap 中移除请求
 * @param config 请求参数配置
 */
function removePending(config: CustomAbortRequestConfig) {
  const url = getPendingUrl(config)
  // 如果在 pending 中存在当前请求标识，需要取消当前请求并删除条目
  const controller = pendingMap.get(url)
  if (controller) {
    controller.abort()
    pendingMap.delete(url)
  }
}

/**
 * @description: 清空所有 pending
 */
function removeAllPending() {
  pendingMap.forEach(controller => {
    if (controller) {
      controller.abort()
    }
  })
  pendingMap.clear()
}

/**
 * 匹配 url 取消请求
 * @param url 字符串或字符串数组
 */
function cancelRequest(url: string | string[]) {
  const urlList = Array.isArray(url) ? url : [url]
  const keys = pendingMap.keys()
  for (const _url of urlList) {
    const mapKeys = keys.filter(item => item.indexOf(_url) > -1)
    for (const key of mapKeys) {
      pendingMap.get(key)?.abort()
      pendingMap.delete(key)
    }
  }
}

/**
 * 取消所有请求
 * @param params
 */
function cancelAllRequest() {
  removeAllPending()
}

function getPendingMap() {
  return pendingMap
}

export { addPending, removePending, removeAllPending, cancelRequest, cancelAllRequest, getPendingMap }
