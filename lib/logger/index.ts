import { ConsoleTransport, Logger } from 'egg-logger'
import type Application from 'koa'
import { get } from 'lodash'
import { config } from '../config'
import { FileTransport } from './fileTransports'
export const logger = new Logger({})
const loggerConfig = config.getItem('logger')
logger.set('console', new ConsoleTransport({
  level: 'DEBUG',
}))

if (get(loggerConfig, 'file', false)) {
  logger.set('file', new FileTransport({
    dir: get(loggerConfig, 'dir', '/logs'),
    level: get('loggerConfig', 'level', 'debug'),
    size: get(loggerConfig, 'limit', 1024 * 1024 * 5),
  }))
}

export const logging = (app: Application) => {
  app.context.logger = logger
}
