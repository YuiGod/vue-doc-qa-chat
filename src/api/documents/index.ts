import type { CustomAxiosConfig } from '@/http/types'
import type { DocParamsType, ResponseDocPageType } from './types'
import http from '@/http'

const docPageApi = (params: DocParamsType) => {
  return http.get<ResponseDocPageType>('/documents/page', params)
}

const docAddApi = (data: FormData, config?: CustomAxiosConfig) => {
  return http.post<string>('/documents/add', data, config)
}

const docEditApi = (data: FormData, config?: CustomAxiosConfig) => {
  return http.put<string>('/documents/update', data, config)
}

const docDeleteApi = (id: string) => {
  return http.delete<string>('/documents/delete', { id: id })
}

const docDownloadApi = (id: string) => {
  return http.download('/documents/download', { id: id })
}

/**
 * 文档全部向量化 Api
 * @param config axios config配置
 */
const docVectorAllApi = (config?: CustomAxiosConfig) => {
  return http.get<string>('/documents/vector-all', undefined, config)
}

export { docPageApi, docAddApi, docEditApi, docDeleteApi, docDownloadApi, docVectorAllApi }
