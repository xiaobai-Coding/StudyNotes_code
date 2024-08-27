import React, {forwardRef} from "react";
import { Icon } from "./index"

export function createIcon(optins){
  const {content, viewBox = '0 0 1024 1024'} = optins

  return forwardRef((props, ref)=>{
    return (
      <Icon ref={ref} viewBox={viewBox} {...props}>
        {content}
      </Icon>
    )
  })
}