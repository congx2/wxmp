
const tips = [
  '[Tips]: The command format is as follows:\n',
  'npm run pkg [command] [PackageName]\n',
  'command:',
  '  - add  add a new package.',
  '  - remove  delete an existing package.',
  ''
].join('\n')

const commandValidators = {
  add: (command, pkg) => {
    return command.toLowerCase() === 'add' && pkg.trim().length > 0
  },
  remove: (command, pkg) => {
    return command.toLowerCase() === 'remove' && pkg.trim().length > 0
  },
  default: () => false
}

export const commandValidator = (command, ...args) => {
  const validator = commandValidators[command]
  if (typeof validator === 'function') {
    return validator(command, ...args)
  }
  return commandValidators.default(command, ...args)
}

export const help = () => {
  console.log(tips)
}

