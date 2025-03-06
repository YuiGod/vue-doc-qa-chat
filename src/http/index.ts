import axiosRequest from './axios/config'
import { fetchRequest } from './fetch/config'
import { cancelAllRequest, cancelRequest } from './helper/abortController'
import type { CustomAxiosConfig, FetchConfig, ResultData } from './types'

/**
 * @description 常用 http 请求，默认 Axios，Fetch前缀的函数使用 Fetch
 */
export default {
  /**
   * Axios get 请求
   * @param url url
   * @param params param 请求参数
   * @param config Axios config 配置
   * @returns `Promise<ResultData<T>>`
   */
  get<T>(url: string, params?: object, config: CustomAxiosConfig = {}): Promise<ResultData<T>> {
    return axiosRequest.get(url, { params, ...config })
  },
  /**
   * Axios post 请求
   * @param url url
   * @param data data 参数
   * @param config Axios config 配置
   * @returns `Promise<ResultData<T>>`
   */
  post<T>(url: string, data?: object | string, config: CustomAxiosConfig = {}): Promise<ResultData<T>> {
    return axiosRequest.post(url, data, config)
  },
  /**
   * Axios put 请求
   * @param url url
   * @param data data参数
   * @param config Axios config 配置
   * @returns `Promise<ResultData<T>>`
   */
  put<T>(url: string, data?: object, config: CustomAxiosConfig = {}): Promise<ResultData<T>> {
    return axiosRequest.put(url, data, config)
  },
  /**
   * Axios delete 请求
   * @param url url
   * @param data data 请求参数，通常是id
   * @param config Axios config 配置
   * @returns `Promise<ResultData<T>>`
   */
  delete<T>(url: string, data?: any, config: CustomAxiosConfig = {}): Promise<ResultData<T>> {
    return axiosRequest.delete(url, { data, ...config })
  },
  /**
   * Axios download 下载请求，responseType: blob
   * @param url url
   * @param data data 请求参数
   * @param config Axios config 配置
   * @returns `Promise<BlobPart>`
   */
  download(url: string, data?: object, config: CustomAxiosConfig = {}): Promise<BlobPart> {
    return axiosRequest.post(url, data, { ...config, responseType: 'blob' })
  },
  /**
   * Fetch get 请求
   * @param url url
   * @param params param 请求参数
   * @param config Fetch config 配置
   * @returns Promise
   */
  fetchGet<T>(url: string, params?: object, config: FetchConfig = {}): Promise<ResultData<T>> {
    return fetchRequest<ResultData<T>>(url, { params, ...config })
  },
  /**
   * Fetch get 请求
   * @param url url
   * @param params param 请求参数
   * @param config Fetch config 配置
   * @returns Promise
   */
  fetchPost<T>(url: string, data?: object, config: FetchConfig = {}): Promise<ResultData<T>> {
    return fetchRequest<ResultData<T>>(url, { method: 'POST', data, ...config })
  },
  /**
   * Fetch 对话 Post 请求，专门为 `Chat` 配置，启动流式响应
   * @param url url
   * @param params param 请求参数
   * @param config Fetch config 配置
   * @returns Promise
   */
  fetchPostChat<T>(url: string, data?: object, config: FetchConfig = {}): Promise<T> {
    return fetchRequest<T>(url, { method: 'POST', data, ...config })
  },
  /**
   * 匹配 url 取消请求
   * @param url 字符串或字符串数组
   * @returns
   */
  cancelRequest: (url: string | string[]) => {
    cancelRequest(url)
  },
  /**
   * 取消所有请求
   * @returns
   */
  cancelAllRequest: () => {
    cancelAllRequest()
  }
}
