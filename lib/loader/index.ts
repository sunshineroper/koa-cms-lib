import type Application from 'koa'
import Router from 'koa-router'
import { readFile } from '../utils/util'
import { config } from '../config'
const baseDir = config.getItem('baseDir') || process.cwd()
export class Loader {
  app: Application
  constructor(app: Application) {
    this.app = app
    this.loadApi(app)
  }

  public loadApi(app: Application) {
    const files = readFile(baseDir + config.getItem('apiDir'))
    const mainRouter = new Router()
    for (const file of files) {
      const extension = file.substring(file.lastIndexOf('.'), file.length)
      if (extension === '.js') {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const mod = require(file)
        if (mod instanceof Router) {
          mainRouter.use(mod.routes()).use(mod.allowedMethods())
        }
        else {
          const keys = Object.keys(mod)
          if (!mod.disableLoading) {
            for (const key of keys) {
              const val = mod[key]
              if (val instanceof Router)
                mainRouter.use(val.routes()).use(val.allowedMethods())
            }
          }
        }
      }
    }
    app.use(mainRouter.routes()).use(mainRouter.allowedMethods())
  }
}
