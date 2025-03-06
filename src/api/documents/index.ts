import type { CustomAxiosConfig } from '@/http/types'
import type { DocParamsType, ResponseDocPageType } from './types'
import http from '@/http'

const docPageApi = (params: DocParamsType) => {
  return http.get<ResponseDocPageType>('/documents/pageDoc', params)
}

const docAddApi = (data: FormData, config?: CustomAxiosConfig) => {
  return http.post<string>('/documents/addDoc', data, config)
}

const docEditApi = (data: FormData, config?: CustomAxiosConfig) => {
  return http.put<string>('/documents/editDoc', data, config)
}

const docDeleteApi = (id: string) => {
  return http.delete<string>('/documents/delDoc', { id: id })
}

const docReadApi = (id: string) => {
  return http.download('/documents/read', { id: id })
}

/**
 * 文档全部向量化 Api
 * @param config axios config配置
 */
const docVectorAllApi = (config?: CustomAxiosConfig) => {
  return http.get<string>('/documents/vector-all', undefined, config)
}

export { docPageApi, docAddApi, docEditApi, docDeleteApi, docReadApi, docVectorAllApi }
