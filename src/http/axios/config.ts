import axios, { AxiosError, type AxiosResponse } from 'axios'
import type { CustomAxiosConfig, CustomAxiosInterceptorsConfig } from '../types'
import { addPending, removePending } from '../helper/abortController'
import { ResultEnum } from '../../enums/httpEnum'
import { checkStatus } from '../helper/checkStatus'
import router from '@/router'

/** 默认baseUrl */
const PATH_URL = import.meta.env.VITE_API_BASEURL

/**
 * 默认配置
 */
const defaultConfig: CustomAxiosConfig = {
  /** 基本路径 */
  baseURL: PATH_URL,
  /** 请求超时时间 */
  timeout: ResultEnum.TIMEOUT as number
}

/**
 * axios 请求实例
 */
const axiosInstance = axios.create(defaultConfig)

/**
 * @description 请求拦截器
 * 客户端发送请求 -> [请求拦截器] -> 服务器
 */
axiosInstance.interceptors.request.use(
  (config: CustomAxiosInterceptorsConfig) => {
    // 重复请求不需要取消，在 api 服务中通过指定的第三个参数: { cancel: false } 来控制
    config.cancel ??= true
    config.cancel && addPending(config)

    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

/**
 * @description 响应拦截器
 *  服务器换返回信息 -> [拦截统一处理] -> 客户端JS获取到信息
 */
axiosInstance.interceptors.response.use(
  (response: AxiosResponse & { config: CustomAxiosConfig }) => {
    const { data, config } = response

    removePending(config)
    // 全局错误信息拦截（防止下载文件的时候返回数据流，没有 code 直接报错）
    if (data.code && data.code !== ResultEnum.SUCCESS) {
      checkStatus(data.code, data.message)
      return Promise.reject(data)
    }
    // 成功请求（在页面上除非特殊情况，否则不用处理失败逻辑）
    return data
  },
  async (error: AxiosError) => {
    const { response } = error
    // 请求超时，没有 response
    if (error.message.indexOf('timeout') !== -1) ElMessage.error('请求超时！请您稍后重试')
    // 网络错误单独判断，没有 response
    if (error.message.indexOf('Network Error') !== -1) ElMessage.error('网络错误！请您稍后重试')
    // 根据服务器响应的错误状态码，做不同的处理
    if (response) checkStatus(response.status)
    // 服务器结果都没有返回(可能服务器错误可能客户端断网)，断网处理:可以跳转到断网页面
    if (!window.navigator.onLine) router.replace('/500')
    return Promise.reject(error)
  }
)

export default axiosInstance
