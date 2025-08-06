import { isValidElement, memo } from 'react'

const isNon = value => {
  return typeof value === 'undefined' || value === null
}

const ReactNodeElement = props => {
  const { as: Tag, ignoreNaN = true, node, children, ...rest } = props
  const render = node => {
    if (isNon(node)) {
      return null
    }
    if (isValidElement(node)) {
      return node
    }
    if (ignoreNaN && Number.isNaN(node)) {
      return null
    }
    const text = Number.isNaN(node) ? `${node}` : node
    return Tag ? <Tag {...rest}>{text}</Tag> : <>{text}</>
  }
  return render(children) || render(node)
}

export default memo(ReactNodeElement)
