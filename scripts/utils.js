
import path from 'path'
import fs from 'fs'
import { promisify } from 'util'
import { fileURLToPath } from 'url'
import { spawn, exec } from 'node:child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const dateFormat = (date, format = 'YYYY-MM-DD hh:mm:ss') => {
  if (typeof date === 'string') {
    date = date.replace(/-/g, '/').replace(/(\.\w+)$/, '')
  }
  const dt = new Date(date)
  const time = dt.getTime()
  if (Number.isNaN(time)) {
    return format
  }
  const map = {
    'YYYY': dt.getFullYear(),
    'MM': (`${dt.getMonth() + 1}`).padStart(2, '0'),
    'DD': (`${dt.getDate()}`).padStart(2, '0'),
    'hh': (`${dt.getHours()}`).padStart(2, '0'),
    'mm': (`${dt.getMinutes()}`).padStart(2, '0'),
    'ss': (`${dt.getSeconds()}`).padStart(2, '0'),
    'ts': time
  }
  return Object.keys(map).reduce((acc, key) => {
    const reg = new RegExp(key, 'g')
    return acc.replace(reg, () => map[key])
  }, typeof format === 'string' ? format : 'YYYY-MM-dd hh:mm:ss')
}

export const getAbsolutePath = (filename = '') => {
  return path.join(__dirname, '..', filename)
}

export const exist = (filepath) => {
  return fs.existsSync(filepath)
}

export const usePromise = () => {
  let resolver
  let rejector
  const promise = new Promise((r, j) => {
    resolver = r
    rejector = j
  })
  return [promise, resolver, rejector]
}


export const readFile = filepath => {
  return promisify(fs.readFile)(filepath, 'utf-8')
}

export const writeFile = (filepath, data) => {
  return promisify(fs.writeFile)(filepath, data, 'utf-8')
}

export const spawnShell = (args) => {
  return spawn(...args)
}

export const execShell = (command, options) => {
  const [promise, resolve, reject] = usePromise()
  const config = Object.assign({
    cwd: process.cwd(),
    encoding: 'utf-8'
  }, options || {})
  exec(command, config, (e, stdout) => e ? reject(e) : resolve(stdout))
  return promise
}
