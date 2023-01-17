import { NotFound } from '../exception/http-exception'
export const Logger = async (ctx, next) => {
  const now = new Date()
  try {
    await next()
    const ms = +new Date() - +now
    // eslint-disable-next-line no-console
    console.log(`[${ctx.method} -> ${ctx.url}] from: ${ctx.ip} consts ${ms}ms`)
    if (ctx.status === 404)
      ctx.app.emit('error', new NotFound(), ctx)
  }
  catch (error) {
    ctx.app.emit('error', error, ctx)
  }
}
