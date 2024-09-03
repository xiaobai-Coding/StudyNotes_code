import React from "react";

export const ConfigContext = React.createContext({})
export function ConfigProvider(props) {
  const {
    space,
    children
  } = props

  return <ConfigContext.Provider value={{ space }}>{children}</ConfigContext.Provider>
}