import http from '@/http'
import type { ChatSessionRequestType, ChatSessionResponseType } from './types'
import type { CustomAxiosConfig } from '@/http/types'

/**
 * 获取会话列表
 * @returns list
 */
const chatSessionsApi = () => {
  return http.get<ChatSessionResponseType[]>('/session/list')
}

/**
 * 添加会话记录，post
 * @param data data 参数
 * @returns 记录信息
 */
const chatSessionsAddApi = (data: ChatSessionRequestType) => {
  return http.post<ChatSessionResponseType>('/session/add', data)
}

/**
 * 修改会话记录，put
 * @param data data 参数
 * @param config axios config配置
 * @returns 记录信息
 */
const chatSessionsEditApi = (data: ChatSessionRequestType, config?: CustomAxiosConfig) => {
  return http.put<ChatSessionResponseType>('/session/update', data, config)
}

/**
 * 删除会话记录，delete
 * @param id 会话id
 */
const chatSessionsDeleteApi = (id: string) => {
  return http.delete<string>('/session/delete', { id: id })
}

export { chatSessionsApi, chatSessionsAddApi, chatSessionsEditApi, chatSessionsDeleteApi }
