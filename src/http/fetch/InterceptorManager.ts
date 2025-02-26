/**
 * 定义拦截器的接口
 */
interface Interceptor<T> {
  onFulfilled?: (value: T) => T | Promise<T>
  onRejected?: (error: any) => any
}

/**
 * 拦截器管理类，用于管理多个拦截器
 */
class InterceptorManager<T> {
  private handlers: Array<Interceptor<T> | null>

  constructor() {
    this.handlers = []
  }

  /**
   * 向管理器列表添加新的拦截器
   * @param interceptor 拦截器
   * @returns
   */
  use(interceptor: Interceptor<T>) {
    this.handlers.push(interceptor)
    return this.handlers.length - 1
  }

  /**
   * 向管理器列表删除拦截器
   * @param id use() 返回的id
   */
  eject(id: number) {
    if (this.handlers[id]) {
      this.handlers[id] = null
    }
  }

  /**
   * 删除所有的拦截器
   */
  clear() {
    if (this.handlers) {
      this.handlers = []
    }
  }

  /**
   * 遍历并执行所有的拦截器
   * @param fn 执行函数，参数为拦截器
   */
  forEach(fn: (interceptor: Interceptor<T>) => void) {
    for (const interceptor of this.handlers) {
      if (interceptor) {
        fn(interceptor)
      }
    }
  }
}

export default InterceptorManager
