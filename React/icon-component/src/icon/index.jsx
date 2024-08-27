import React, { forwardRef } from "react";
import classNames from "classnames";
import "./index.scss"

export const getSize = (size) =>{
  if(Array.isArray(size) && size.length === 2){
    return size
  }
  const width = size || '1em'
  const height = size || '1em'

  return [width, height]
}

// Icon组件
export const Icon = forwardRef((props, ref)=>{
  const {
    style,
    className,
    spin,
    size = '1em',
    children,
    ...rest
  } = props

  const [width, height] = getSize(size)
  const cs = classNames(
    'icon',
    {
      'icon-spin': spin
    },
    className
  )
  return (
    <svg ref={ref} style={style} width={width} height={height} className={cs} fill="currentColor" {...rest}>
      { children }
    </svg>
  )
})