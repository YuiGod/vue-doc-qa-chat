/**
 * 生成 uuid
 * @returns
 */
export function generateUUID() {
  let timestamp = new Date().getTime()
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (timestamp + Math.random() * 16) % 16 | 0
    timestamp = Math.floor(timestamp / 16)
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
  return uuid
}
