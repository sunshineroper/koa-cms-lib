export const isString = (val): val is string => typeof val === 'string'

export const getValidatorPropertykeys = (instance, filterFunc) => {
  const keys = Reflect.ownKeys(instance)
  const names: string[] = keys.filter(filterFunc)
  return names
}
