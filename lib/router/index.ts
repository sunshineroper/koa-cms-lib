import Router from 'koa-router'
import type { IMiddleware, IRouterOptions } from 'koa-router'
import { get } from 'lodash'
import { isBoolean } from '../utils/util'
export const routeMetaInfo = new Map()
interface TypeOptions extends IRouterOptions {
  mountpermission?
  module?: string | undefined
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
    super(options)
    if (options) {
      this.mountpermission = options.mountpermission
      this.module = get(options, 'module', '')
      this.prefix = get(options, 'prefix', '')
    }
  }

  permission(permission: boolean, mount?: boolean): TypeMeta {
    return {
      permission,
      module: this.module,
      mount: isBoolean(mount) ? mount : this.mountpermission,
    }
  }

  sGet(name: string, path: string | RegExp, meta: TypeMeta | IMiddleware, ...middleware: IMiddleware[]) {
    if ('mount' in meta && meta.mount) {
      const endpoint = `GET ${path}`
      routeMetaInfo.set(endpoint, { permission: meta.permission, module: meta.module, mount: meta.mount })
      this.get(name, path, ...middleware)
    }
    else if (!('mount' in meta)) {
      this.get(name, path, meta, ...middleware)
    }
    else { this.get(name, path, ...middleware) }
  }

  sPut(name: string, path: string | RegExp, meta: TypeMeta | IMiddleware, ...middleware: IMiddleware[]) {
    if ('mount' in meta && meta.mount) {
      const endpoint = `PUT ${path}`
      routeMetaInfo.set(endpoint, { permission: meta.permission, module: meta.module, mount: meta.mount })
      this.put(name, path, ...middleware)
    }
    else if (!('mount' in meta)) {
      this.put(name, path, meta, ...middleware)
    }
    else { this.put(name, path, ...middleware) }
  }

  sDelete(name: string, path: string | RegExp, meta: TypeMeta | IMiddleware, ...middleware: IMiddleware[]) {
    if ('mount' in meta && meta.mount) {
      const endpoint = `DELETE ${path}`
      routeMetaInfo.set(endpoint, { permission: meta.permission, module: meta.module, mount: meta.mount })
      this.delete(name, path, ...middleware)
    }
    else if (!('mount' in meta)) {
      this.delete(name, path, meta, ...middleware)
    }
    else {
      this.delete(name, path, ...middleware)
    }
  }

  sPost(name: string, path: string | RegExp, meta: TypeMeta | IMiddleware, ...middleware: IMiddleware[]) {
    if ('mount' in meta && meta.mount) {
      const endpoint = `POST ${path}`
      routeMetaInfo.set(endpoint, { permission: meta.permission, module: meta.module, mount: meta.mount })
      this.post(name, path, ...middleware)
    }
    else if (!('mount' in meta)) {
      this.post(name, path, meta, ...middleware)
    }
    else { this.post(name, path, ...middleware) }
  }

  sOptions(name: string, path: string | RegExp, meta: TypeMeta | IMiddleware, ...middleware: IMiddleware[]) {
    if ('mount' in meta && meta.mount) {
      const endpoint = `OPTIONS ${path}`
      routeMetaInfo.set(endpoint, { permission: meta.permission, module: meta.module, mount: meta.mount })
      this.options(name, path, ...middleware)
    }
    else if (!('mount' in meta)) {
      this.options(name, path, meta, ...middleware)
    }
    else { this.options(name, path, ...middleware) }
  }
}
