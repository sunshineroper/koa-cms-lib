import type Application from 'koa'
import type { HttpException } from '../exception/http-exception'
import { Success } from '../exception/http-exception'
export const success = (app: Application) => {
  app.context.success = function (ex?: HttpException) {
    const t = this || this as unknown as Record<string, any>
    t.type = 'application/json'
    const success = new Success(ex)
    t.body = {
      code: success.code,
      message: success.message,
      url: `${t.method} ${t.url} `,
    }
    t.status = success.status
  }
}
