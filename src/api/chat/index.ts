import http from '@/http'
import type { ChatRequestType, ChatResponseType } from './types'
import type { OnReady, OnStream } from '@/http/types'

/**
 * Fetch 请求，chat对话内容
 * @param data data
 * @param onReady 回调函数，请求响应成功，准备流式输出
 * @param onStream 回调函数，开启 stream 流式响应并回调函数
 * @returns `Promise<ChatResponseType>`
 */
const chatApi = (data: ChatRequestType, onReady: OnReady<ChatResponseType>, onStream: OnStream): Promise<ChatResponseType> => {
  return http.fetchPostChat('/chat', data, { onReady, onStream })
}

/**
 * 取消请求
 * @returns
 */
function chatCancelRequest() {
  return http.cancelRequest('/chat')
}

export { chatApi, chatCancelRequest }
