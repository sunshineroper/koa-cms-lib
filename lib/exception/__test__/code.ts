export const codeMessage = {
  getMessage(code: number) {
    return this[code]
  },
  9999: '服务器未知错误',
  10030: '参数错误',
  10070: '禁止操作',
}
