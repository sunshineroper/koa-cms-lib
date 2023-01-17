import { HttpException } from '../exception'
import { HttpStatus } from '../enums'
import { isFunction } from '../utils/util'
import { config } from '../config'
import type { CodeMessage } from '../types'
export const onError = (err, ctx) => {
  ctx.type = 'application/json'
  const codeMessage = config.getItem('codeMessage') as CodeMessage

  if (codeMessage && !isFunction(codeMessage.getMessage)) {
    codeMessage.getMessage = function (code: number) {
      return this[code]
    }
  }
  if (err instanceof HttpException) {
    ctx.status = err.status || HttpStatus.INTERNAL_SERVER_ERROR
    ctx.body = JSON.stringify({
      code: err.code,
      message: err.message,
      request: `${ctx.method} ${ctx.path}`,
    })
  }
  else {
    ctx.status = HttpStatus.INTERNAL_SERVER_ERROR
    ctx.body = JSON.stringify({
      code: 9999,
      message: codeMessage.getMessage(9999),
      request: `${ctx.method} ${ctx.path}`,
    })
  }
}
