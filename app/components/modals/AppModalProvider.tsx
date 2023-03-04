import React from "react"
import { AppActionSheet } from "./AppActionSheet"
import { modalManager } from "./ModalManager"

export const AppModalProvider: React.FC<any> = ({ children }) => {
  return (
    <>
      {children}
      <AppActionSheet ref={modalManager.getActionSheetRef()} />
    </>
  )
}
