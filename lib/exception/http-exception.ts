import { isFunction, isInt } from '../utils/'
import { HttpStatus } from '../enums'
import { config } from '../config'
import type { CodeMessage } from '../types'
const codeMessage = config.getItem('codeMessage') as CodeMessage

if (codeMessage && !isFunction(codeMessage.getMessage)) {
  codeMessage.getMessage = function (code: number) {
    return this[code]
  }
}
interface ex {
  code?: number
  message?: any
}
export class HttpException extends Error {
  code = 9999
  stauts = 500
  constructor() {
    super()
  }

  exceptionHandler(ex: number | ex) {
    if (isInt(ex)) {
      this.code = ex
      this.message = codeMessage.getMessage(ex)
    }
    else if (ex && ex.code) {
      const code = ex.code
      this.code = code
      this.message = codeMessage.getMessage(code)
    }
    else if (ex && ex.message) {
      this.message = ex.message
    }
  }
}

export class NotFound extends HttpException {
  stauts = HttpStatus.BAD_REQUEST
  code = 10070
  message = codeMessage.getMessage(this.code)
  constructor(ex?: any) {
    super()
    this.exceptionHandler(ex)
  }
}

export class ParamtersException extends HttpException {
  stauts = HttpStatus.NOT_FOUND
  code = 10030
  message = codeMessage.getMessage(this.code)
  constructor(ex?: any) {
    super()
    this.exceptionHandler(ex)
  }
}