import { isFunction, isInt, isString } from '../utils/'
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
  status = 500
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
    else if (isString(ex)) {
      this.message = ex
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
  status = HttpStatus.NOT_FOUND
  code = 10030
  message = codeMessage.getMessage(this.code)
  constructor(ex?: any) {
    super()
    this.exceptionHandler(ex)
  }
}

export class MethodNotAllowed extends HttpException {
  status = HttpStatus.METHOD_NOT_ALLOWED
  code = 10080
  message = codeMessage.getMessage(this.code)
  constructor(ex?: any) {
    super()
    this.exceptionHandler(ex)
  }
}

export class Success extends HttpException {
  status = HttpStatus.CREATED
  code = 0
  message = codeMessage.getMessage(this.code)
  constructor(ex?: any) {
    super()
    this.exceptionHandler(ex)
  }
}
