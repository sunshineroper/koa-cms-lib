import type Application from 'koa'
import KoaRouter from 'koa-router'
import { readFile } from '../utils/util'
import { config } from '../config'
const baseDir = config.getItem('baseDir') || process.cwd()
export class Loader {
  app: Application
  constructor(app: Application) {
    this.app = app
  }

  public loadApi(app: Application) {
    const files = readFile(baseDir + config.getItem('apiDir'))
    const mainRouter = new KoaRouter()
    for (const file of files) {
      const extension = file.substring(file.lastIndexOf('.'), file.length)
      if (extension === '.js') {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const mod = require(file)
        if (mod instanceof KoaRouter)
          mainRouter.use(mod.routes()).use(mod.allowedMethods())
      }
    }
    app.use(mainRouter.roues()).use(mainRouter.allowedMethods())
  }
}
