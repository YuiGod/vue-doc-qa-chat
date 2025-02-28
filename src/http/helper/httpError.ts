/**
 * 自定义 http 请求 Error
 * @param code 状态码
 * @param message 错误消息
 */
class HttpError extends Error {
  /** 状态码 */
  code: number
  /** 错误消息 */
  message: string
  /**
   * 自定义 http 请求 Error
   * @param code 状态码
   * @param message 错误消息
   */
  constructor(code: number, message: string) {
    super(message)
    this.code = code
    this.message = message
  }
}

export default HttpError
