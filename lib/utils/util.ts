import fs from 'fs'
export const isString = (val): val is string => typeof val === 'string'
export const isInt = (val): val is number => typeof val === 'number'
export const isFunction = (val): val is Function => typeof val === 'function'
export const isNotEmpty = (val: unknown): boolean => {
  return val !== '' && val !== null && val !== undefined
}
export const isBoolean = (val): val is boolean => typeof val === 'boolean'
export const getValidatorPropertykeys = (instance, filterFunc) => {
  const keys = Reflect.ownKeys(instance)
  const names: string[] = keys.filter(filterFunc)
  return names
}

export const getValidatorMethodsName = (obj, filterFunc) => {
  const methodNames = new Set()
  // eslint-disable-next-line no-cond-assign
  while ((obj = Reflect.getPrototypeOf(obj))) {
    const keys = Reflect.ownKeys(obj)
    keys.forEach(k => methodNames.add(k))
  }
  return Array.from(methodNames.values()).filter(filterFunc)
}
export const readFile = (dir) => {
  let res: string[] = []
  const files = fs.readdirSync(dir)
  for (const file of files) {
    const name = `${dir}/${file}`
    if (fs.statSync(name).isDirectory()) {
      const temp = readFile(name)
      res = res.concat(temp)
    }
    else {
      res.push(name)
    }
  }
  return res
}
