export const isString = (val): val is string => typeof val === 'string'
export const isInt = (val): val is number => typeof val === 'number'
export const isFunction = (val): val is Function => typeof val === 'function'
export const getValidatorPropertykeys = (instance, filterFunc) => {
  const keys = Reflect.ownKeys(instance)
  const names: string[] = keys.filter(filterFunc)
  return names
}
