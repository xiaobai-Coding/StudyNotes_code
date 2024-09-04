import { useEffect, useRef, useState } from "react";

const Lazyload = (props) =>{
  const containerRef = useRef(null)
  const [visible, setVisible] = useState(false)
  const elementObserver = useRef()
  const {
      className = '',
      style,
      offset = 0,
      width,
      onContentVisible,
      placeholder,
      height,
      children
  } = props
  function lazyLoadHandler(entries){
    const [entry] = entries
    const { isIntersecting } = entry
    if(isIntersecting){
      setVisible(true)
      onContentVisible?.()

      const node = containerRef.current
      if(node && node instanceof HTMLElement){
        elementObserver.current.unobserve(node)
      }
    }
  }
  useEffect(()=>{
    const options = {
      rootMargin: typeof offset === 'number' ? `${offset}px` : offset || '0px',
      threshold: 0
    }
    elementObserver.current = new IntersectionObserver(lazyLoadHandler, options)
    const node = containerRef.current
    if(node instanceof HTMLElement){
      elementObserver.current.observe(node)
    }

    return ()=>{
      if(node && node instanceof HTMLElement){
        elementObserver.current.unobserve(node)
      }
    }
  }, [])
return <div ref={containerRef} className={className} style={style}>
  {visible ? props.children : placeholder}
</div>
}

export default Lazyload