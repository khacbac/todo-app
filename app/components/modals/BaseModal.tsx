import React from "react"
import { ViewStyle } from "react-native"
import Modal, { ModalProps } from "react-native-modal"

type IProps = Partial<ModalProps>
export const BaseModal: React.FC<IProps> = ({
  style,
  backdropOpacity,
  animationIn,
  animationOut,
  children,
  ...props
}) => {
  return (
    <Modal
      style={[$container, style]}
      animationIn={animationIn || "fadeInUp"}
      animationOut={animationOut || "slideOutDown"}
      backdropOpacity={0.6 || backdropOpacity}
      {...props}
    >
      {children}
    </Modal>
  )
}

const $container: ViewStyle = { margin: 0 }
