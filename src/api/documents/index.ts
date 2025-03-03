import type { CustomAxiosConfig, ResultData } from '@/http/types'
import type { DocParamsType, ResponseDocPageType } from './types'
import http from '@/http'

const docPageApi = (params: DocParamsType): Promise<ResultData<ResponseDocPageType>> => {
  return http.get('/documents/pageDoc', params)
}

const docAddApi = (data: FormData, config?: CustomAxiosConfig): Promise<ResultData<string>> => {
  return http.post('/documents/addDoc', data, config)
}

const docEditApi = (data: FormData, config?: CustomAxiosConfig): Promise<ResultData<string>> => {
  return http.put('/documents/editDoc', data, config)
}

const docDeleteApi = (id: string): Promise<ResultData<string>> => {
  return http.delete('/documents/delDoc', { id: id })
}

const docReadApi = (id: string): Promise<Blob> => {
  return http.get('/documents/read', { id: id })
}

const docVectorAllApi = (config?: CustomAxiosConfig): Promise<ResultData<string>> => {
  return http.get('/documents/vector-all', undefined, config)
}

export { docPageApi, docAddApi, docEditApi, docDeleteApi, docReadApi, docVectorAllApi }
