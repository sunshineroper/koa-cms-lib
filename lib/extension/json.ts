import type Application from 'koa'
import { set } from 'lodash'
import { HttpException } from '../exception/http-exception'
export const json = (app: Application) => {
  app.context.json = function (obj: any) {
    const t = this || this as unknown as Record<string, any>
    t.type = 'application/json'
    let data = Object.create(null)
    if (obj instanceof HttpException) {
      set(data, `${t.method} ${t.url} `)
      t.success = obj.status
    }
    else { data = obj }
    t.body = JSON.stringify(data)
  }
}
