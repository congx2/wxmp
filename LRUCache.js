const wm = new WeakMap()

const isDate = value => {
  return (
    !!value &&
    typeof value === 'object' &&
    Object.prototype.toString.call(value).slice(8, -1) === 'Date'
  )
}
const getExpiresTimestamp = date => {
  let dt = null
  const type = typeof date
  if (type === 'string') {
    if (/^\d+$/) {
      dt = new Date(Number(date))
    } else {
      dt = new Date(date.replace(/-/g, '/'))
    }
  } else if (type === 'number') {
    dt = new Date(date)
  } else if (isDate(date)) {
    dt = new Date(date.getTime())
  }
  return dt ? dt.getTime() : NaN
}

const isExpired = timestamp => {
  const date = new Date(timestamp)
  const time = date.getTime()
  return Number.isNaN(time) ? false : Date.now() - time >= 0
}

/**
 *
 * @param { LRUCache } ctx
 * @returns { MemoryCache | StorageCache }
 */
const getStorage = ctx => {
  const state = wm.get(ctx)
  return state.instance
}

const getCache = ctx => {
  try {
    const storage = getStorage(ctx)
    const cache = storage.get()
    return Array.isArray(cache) ? cache : []
  } catch (error) {
    return []
  }
}

class MemoryCache {
  constructor() {
    const cache = []
    wm.set(this, cache)
  }

  get() {
    try {
      const cache = wm.get(this)
      return Array.isArray(cache) ? cache : []
    } catch (error) {
      console.log('MemoryCache get error:')
      console.error(error)
      return []
    }
  }

  set(value) {
    try {
      const cache = Array.isArray(value) ? value : []
      wm.set(this, cache)
    } catch (error) {
      console.log('MemoryCache set error:')
      console.error(error)
    }
  }

  clear() {
    try {
      this.set([])
    } catch (error) {
      console.log('MemoryCache set error:')
      console.error(error)
    }
  }
}

class StorageCache {
  constructor(storageName) {
    const state = { storageName }
    wm.set(this, state)
  }

  get() {
    try {
      const state = wm.get(this)
      const cache = wx.getStorageSync(state.storageName)
      return Array.isArray(cache) ? cache : []
    } catch (error) {
      console.log('StorageCache get error:')
      console.error(error)
      return []
    }
  }

  set(value) {
    try {
      const state = wm.get(this)
      const nextCache = Array.isArray(value) ? value : []
      wx.setStorageSync(state.storageName, nextCache)
    } catch (error) {
      console.log('StorageCache set error:')
      console.error(error)
    }
  }

  clear() {
    try {
      const state = wm.get(this)
      wx.removeStorageSync(state.storageName)
    } catch (error) {
      console.log('StorageCache clear error:')
      console.error(error)
    }
  }
}

class LRUCache {
  constructor(options) {
    const {
      size = 100,
      mode = LRUCache.MODE.MEMORY,
      storageName = ''
    } = options || {}
    const instanceMap = new Map([
      [LRUCache.MODE.MEMORY, [MemoryCache]],
      [LRUCache.MODE.STORAGE, [StorageCache, storageName]]
    ])
    const conf = instanceMap.get(mode)
    if (!conf) {
      throw TypeError(`Unsupported mode: "${mode}".`)
    }
    const [Ctor, ...args] = conf
    const storage = new Ctor(...args)
    const state = { size, mode, storage }
    wm.set(this, state)
  }

  get MODE() {
    const modes = { MEMORY: 'Memory', STORAGE: 'Storage' }
    return Object.assign(Object.create(null), modes)
  }

  size() {
    return getCache(this).length
  }

  get(name) {
    try {
      const cache = getCache(this)
      const index = cache.findIndex(item => item.name === String(name))
      if (index === -1) {
        return null
      }
      const target = cache.splice(index, 1)[0]
      !isExpired(target.expires) && cache.unshift(target)
      getStorage(this).set(cache)
      return target
    } catch (error) {
      console.log('LRUCache get error:')
      console.error(error)
      return null
    }
  }

  set(name, value, expires) {
    try {
      const { size } = wm.get(ctx)
      const cache = getCache(this)
      const expiresTime = getExpiresTimestamp(expires)
      const index = cache.findIndex(item => item.name === String(name))
      const nextCache = { name: String(name), value }
      if (!Number.isNaN(expiresTime)) {
        nextCache.expires = expiresTime
      }
      index !== -1 && cache.splice(index, 1)
      !isExpired(nextCache.expires) && cache.unshift(nextCache)
      cache.length > size && cache.splice(size, cache.length - size)
      getStorage(this).set(cache)
    } catch (error) {
      console.log('LRUCache set error:')
      console.error(error)
      return null
    }
  }

  remove(name) {
    try {
      const cache = getCache(this)
      const index = cache.findIndex(item => item.name === String(name))
      index !== -1 && cache.splice(index, 1)
    } catch (error) {
      console.log('LRUCache remove error:')
      console.error(error)
      return null
    }
  }

  clear() {
    try {
      getStorage(this).clear()
    } catch (error) {
      console.log('LRUCache clear error:')
      console.error(error)
    }
  }

  toString() {
    try {
      const cache = getCache(this)
      return JSON.stringify(cache)
    } catch (error) {
      console.log('LRUCache toString error:')
      console.error(error)
      return JSON.stringify([])
    }
  }

  toJSON() {
    try {
      const cache = getCache(this)
      return JSON.parse(JSON.stringify(cache))
    } catch (error) {
      console.log('LRUCache toJSON error:')
      console.error(error)
      return []
    }
  }
}

export default LRUCache
