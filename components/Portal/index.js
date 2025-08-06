import { createPortal } from 'react-dom'

const getNode = node => {
  if (typeof node === 'undefined' || node === null) {
    return document.body
  }
  if (typeof node === 'string') {
    return document.querySelector(node)
  }
  const types = [Node.ELEMENT_NODE, Node.DOCUMENT_FRAGMENT_NODE]
  return node && types.includes(node.nodeType) ? node : null
}

const isReactKey = key => {
  const types = ['string', 'number', 'bigint']
  return types.includes(typeof key)
}

const Portal = props => {
  const { children, container, id } = props
  const root = getNode(container)
  if (!root) {
    return null
  }
  const args = isReactKey(id) ? [children, root, id] : [children, root]
  return createPortal.apply(null, args)
}

export default Portal
