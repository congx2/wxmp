const commands = {
  add: {
    desc: 'Add a new package.',
    validator: (command, pkg) => {
      return command.toLowerCase() === 'add' && pkg.trim().length > 0
    }
  },
  remove: {
    desc: 'Delete an existing package.',
    validator: (command, pkg) => {
      return command.toLowerCase() === 'remove' && pkg.trim().length > 0
    }
  }
}

const genCommandDescs = map => {
  const commands = Object.keys(map)
  const maxSize = Math.max.apply(null, commands.map(item => item.length))
  const gen = command => {
    const space = new Array(maxSize + 2 - command.length).fill(' ').join('')
    const { desc } = map[command]
    return ['  - ', command, space, desc].join('')
  }
  return commands.map(gen)
}

const tips = [
  'Usage: npm run pkg <command> <package_name>',
  'command:',
  ...genCommandDescs(commands),
  'Example: npm run pkg add test-pkg'
].join('\n')

export const commandValidator = (command, ...args) => {
  const { validator } = commands[command] || {}
  if (typeof validator === 'function') {
    return validator(command, ...args)
  }
  return false
}

export const help = () => {
  console.log(tips)
}

