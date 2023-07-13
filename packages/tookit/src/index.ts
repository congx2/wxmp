/**
 * @since 2023-07-13 23:52:31
 */

export const getStringTag = (value: unknown): string => {
  return Object.prototype.toString.call(value).slice(8, -1)
}

export const hasOwnKey = (obj: object, key: PropertyKey): boolean => {
  return Object.prototype.hasOwnProperty.call(obj, key)
}

export const isObject = (value: unknown): boolean => {
  if (value === null) {
    return false
  }
  const type = typeof value
  return type === 'object' || type === 'function'
}

export const isPlainObject = (value: unknown): boolean => {
  return getStringTag(value) === 'Object'
}

