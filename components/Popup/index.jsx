import { useEffect, useRef, useState, isValidElement } from 'react'
import styles from './index.module.less'
import { classes } from '../../utils/index'

const isNon = value => {
  return value === null || typeof value === 'undefined'
}

const Node = (props) => {
  const { as: Tag, node, ...rest } = props
  if (isNon(node)) {
    return null
  }
  if (isValidElement(node)) {
    return node
  }
  return Tag ? <Tag {...rest}>{node}</Tag> : node
}

const Popup = props => {
  const {
    portal,
    show,
    title,
    subtitle,
    header,
    maxHeight,
    children,
    onOpened,
    onClose,
    onClosed,
  } = props
  const [render, setRender] = useState(false)
  const popupRef = useRef(null)



  useEffect(() => {
    if (show) {
      setRender(true)
    }
  }, [show])

  useEffect(() => {
    if (!render) {
      return
    }
    const popup = popupRef.current
    const handler = (e) => {
      if (e.animationName === styles.slideUp) {
        onOpened && onOpened()
      }
      if (e.animationName === styles.slideDown) {
        setRender(false)
        onClosed && onClosed()
      }
    }
    popup.addEventListener('animationend', handler)
    return () => {
      popup.removeEventListener('animationend', handler)
    }
  }, [render])

  const close = () => {
    onClose && onClose()
  }



  const Header = () => {
      if (!isNon(header) || header === false) {
        return isValidElement(header) ? header : <div className={styles.header}>{header}</div>
      }
      const Title = () => {
        if (isNon(title)) {
          return null
        }
        if (isValidElement(title)) {
          return title
        }
        return <div className={styles.title}>{title}</div>
      }
      const Subtitle = () => {
        if (isNon(subtitle)) {
          return null
        }
        if (isValidElement(subtitle)) {
          return subtitle
        }
        return <div className={styles.subtitle}>{subtitle}</div>
      }
      return (
        <div className={styles.header}>
          <Title />
          <Subtitle />
        </div>
      )
  }


  return render && (
    <div className={classes(styles.popup, show && styles.show)}>
      <div className={styles.mask} onClick={close}></div>
      <div ref={popupRef} className={styles.body}>
        <Header />
        <div>123</div>
        {children}
      </div>
    </div>
  )
}

export default Popup
