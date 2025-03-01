import type { CustomAxiosConfig, ResultData } from '@/http/types'
import type { DocParamsType, ResponseDocPageType } from './types'
import http from '@/http'

const docPageApi = (params: DocParamsType): Promise<ResultData<ResponseDocPageType>> => {
  return http.get('/documentQA/queryDoc', params)
}

const docAddApi = (data: FormData, config?: CustomAxiosConfig): Promise<ResultData<string>> => {
  return http.post('/documentQA/addDoc', data, config)
}

const docEditApi = (data: FormData, config?: CustomAxiosConfig): Promise<ResultData<string>> => {
  return http.post('/documentQA/editDoc', data, config)
}

const docDeleteApi = (data: string): Promise<ResultData<string>> => {
  return http.post('/documentQA/delDoc', data)
}

export { docPageApi, docAddApi, docEditApi, docDeleteApi }
