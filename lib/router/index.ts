import type { IMiddleware } from 'koa-router'
import Router from 'koa-router'
import { get } from 'lodash'

export const routeMetaInfo = new Map()
interface TypeOptions {
  mountpermission?
  module?: string | undefined
  prefix?
}
interface TypeMeta {
  mount: boolean
  permission: boolean
  module: string
}

export class SRouter extends Router {
  mountpermission = true
  module = ''
  constructor(options?: TypeOptions) {
    super()
    if (options) {
      this.mountpermission = options.mountpermission
      this.module = get(options, 'module', '')
      this.prefix = get(options, 'prefix', '')
    }
  }

  sGet(name: string, path: string | RegExp, meta: TypeMeta | IMiddleware, ...middleware: IMiddleware[]) {
    if ('mount' in meta) {
      if (meta.mount) {
        const endpoint = `GET ${name}`
        routeMetaInfo.set(endpoint, { permission: meta.permission, module: meta.module })
      }
    }
    else {
      this.get(name, path, meta, ...middleware)
    }
  }

  sPut(name: string, path: string | RegExp, meta: TypeMeta | IMiddleware, ...middleware: IMiddleware[]) {
    if ('mount' in meta) {
      if (meta.mount) {
        const endpoint = `PUT ${name}`
        routeMetaInfo.set(endpoint, { permission: meta.permission, module: meta.module })
      }
    }
    else {
      this.put(name, path, meta, ...middleware)
    }
  }

  sDelete(name: string, path: string | RegExp, meta: TypeMeta | IMiddleware, ...middleware: IMiddleware[]) {
    if ('mount' in meta) {
      if (meta.mount) {
        const endpoint = `DELETE ${name}`
        routeMetaInfo.set(endpoint, { permission: meta.permission, module: meta.module })
      }
    }
    else {
      this.delete(name, path, meta, ...middleware)
    }
  }

  sPost(name: string, path: string | RegExp, meta: TypeMeta | IMiddleware, ...middleware: IMiddleware[]) {
    if ('mount' in meta) {
      if (meta.mount) {
        const endpoint = `POST ${name}`
        routeMetaInfo.set(endpoint, { permission: meta.permission, module: meta.module })
      }
    }
    else {
      this.post(name, path, meta, ...middleware)
    }
  }

  sOptions(name: string, path: string | RegExp, meta: TypeMeta | IMiddleware, ...middleware: IMiddleware[]) {
    if ('mount' in meta) {
      if (meta.mount) {
        const endpoint = `OPTIONS ${name}`
        routeMetaInfo.set(endpoint, { permission: meta.permission, module: meta.module })
      }
    }
    else {
      this.options(name, path, meta, ...middleware)
    }
  }
}
