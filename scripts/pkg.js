
import { getAbsolutePath, exist, execShell, writeFile, dateFormat } from './utils.js'
import { commandValidator, help } from './help.js'
import config from './config.js'

const getPkgName = pkg => {
  return `packages/${pkg}`
}

const pipe = commands => {
  let promise = Promise.resolve()
  while(commands.length) {
    promise = promise.then(commands.shift())
  }
  return promise
}

const addPackage = pkg => {
  const dirName = getPkgName(pkg)
  const dirPath = getAbsolutePath(dirName)
  if (exist(dirPath)) {
    return Promise.reject(new Error(`Error: package "${dirName}" already exist.`))
  }
  const commands = [
    () => execShell(`npm init -w ${dirName} --scope=${config.scope} -y`),
    () => execShell(`mkdir ${dirPath}/src`),
    () => writeFile(`${dirPath}/src/index.ts`, `/**\n * @since ${dateFormat(Date.now())}\n */\n`),
    () => writeFile(`${dirPath}/README.md`, `# package ${pkg}`),
    () => Promise.resolve(`add package "${dirName}" successfully.`).then(console.log)
  ]
  return pipe(commands).catch(console.error)
}

const removePackage = pkg => {
  const dirName = getPkgName(pkg)
  const dirPath = getAbsolutePath(dirName)
  if (!exist(dirPath)) {
    return Promise.resolve(`Tips: The package "${dirName}" does not exist.`).then(console.log)
  }
  const commands = [
    () => execShell(`rm -rf ${dirPath}`),
    () => Promise.resolve(`Package "${dirName}" has been removed`).then(console.log)
  ]
  return pipe(commands).catch(console.error)
}

const valide = (command, pkg) => {
  const helpInfo = [
    '[Tips]: The command format is as follows:\n',
    'npm run pkg [command] [PackageName]\n',
    'command:',
    '  - add  add a new package.',
    '  - remove  delete an existing package.',
    ''
  ].join('\n')
  const showHelp = () => {
    console.info(helpInfo)
    return false
  }
  const commands = ['add', 'remove']
  if (commands.indexOf(command) === -1) {
    return showHelp()
  }
  if (!pkg) {
    return showHelp()
  }
  return true
}


const apply = args => {
  const [command, pkg] = args
  if (!commandValidator(command, pkg)) {
    return help()
  }
  switch (command.toLowerCase()) {
    case 'add':
      return addPackage(pkg)
    case 'remove':
      return removePackage(pkg)
  }
}

apply(process.argv.slice(2))

