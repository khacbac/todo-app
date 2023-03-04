import { createRef, RefObject } from "react"
import { AppActionSheetType } from "./AppActionSheet"

class ModalManager {
  private appActionSheet: RefObject<AppActionSheetType>

  constructor() {
    this.appActionSheet = createRef<AppActionSheetType>()
  }

  public getActionSheetRef = () => this.appActionSheet
  public getActionSheet = () => this.appActionSheet.current
}

export const modalManager = new ModalManager()
