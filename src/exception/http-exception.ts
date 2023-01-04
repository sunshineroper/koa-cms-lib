import { isInt } from '../utils/'
import { HttpStatus } from '../enums/http-enums'
const codeMessage = {
  getMessage(code: number) {
    return this[code]
  },
  9999: '服务器未知错误',
  10070: '禁止操作',
}
interface ex {
  code?: number
  message?: string
}
export class HttpException extends Error {
  code = 9999
  number = 500
  stauts: number
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
  constructor(ex?: number | ex) {
    super()
    this.stauts = HttpStatus.NOT_FOUND
    this.code = 10070
    this.message = codeMessage.getMessage(this.code)
    this.exceptionHandler(ex)
  }
}
