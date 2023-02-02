export const codeMessage = {
  getMessage(code: number) {
    return this[code]
  },
  9999: '服务器未知错误',
  10000: '未携带令牌',
  10001: 'access令牌过期',
  10002: 'refresh令牌过期',
  10003: 'access令牌损坏',
  10004: 'refresh令牌损坏',
  10030: '参数错误',
  10070: '禁止操作',
}
