/**
 * @description: 校验网络请求状态码
 * @param {Number} status
 * @return void
 */

export const checkStatus = (status: number, msg?: string | boolean, isAlert: boolean = true) => {
  let message = ''
  switch (status) {
    case 0:
    case 20:
      message = '已取消请求。'
      ElMessage.warning(message)
      return {
        code: status,
        message: message
      }
    case 400:
      message = '请求失败！服务器没有进行新建或修改数据的操作。'
      break
    case 401:
      message = '登录失效！用户没有权限（令牌、用户名、密码错误）。'
      break
    case 403:
      message = '当前账号无权限访问！'
      break
    case 404:
      message = '你所访问的资源不存在！'
      break
    case 405:
      message = '请求方式错误！'
      break
    case 406:
      message = '请求的格式不可得。'
      break
    case 408:
      message = '请求超时！请您稍后重试'
      break
    case 500:
      message = '服务器发生错误，请检查服务器。'
      break
    case 502:
      message = '网关错误！'
      break
    case 503:
      message = '服务不可用，服务器暂时过载或维护。'
      break
    case 504:
      message = '网关超时！'
      break
    case 701:
      message = '流式响应失败，没有对应的回调处理！'
      break
    case 702:
      message = '流式响应失败，无响应数据！'
      break
    default:
      message = '请求失败！请联系管理员。'
  }
  if (typeof msg === 'string') {
    message = msg
  }

  if ((typeof msg === 'boolean' && msg === true && isAlert) || (typeof msg !== 'boolean' && isAlert)) {
    ElMessage.error(`状态码：${status}，${message}`)
  }

  return {
    code: status,
    message: message
  }
}
