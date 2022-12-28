export const getValidatorPropertykeys = (instance, filterFunc) => {
  const keys = Reflect.ownKeys(instance)
  const names = keys.filter(filterFunc)
  return names
}
