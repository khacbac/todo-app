import { Dimensions } from "react-native"
import { colors } from "~/theme"
import { TaskPriotityEnum } from "~/types"

export const WINDOW_WIDTH = Dimensions.get("window").width

export const DEFAULT_DATE_FORMAT = "dd-MM-y"
export const CALENDAR_DATE_FORMAT = "y-MM-dd"

export const PRIORITY = {
  LOW: TaskPriotityEnum.LOW,
  MEDIUM: TaskPriotityEnum.MEDIUM,
  HIGH: TaskPriotityEnum.HIGH,
  IMPORTANT: TaskPriotityEnum.IMPORTANT,
}

export const PRIORITIES = [
  {
    title: `Priority ${TaskPriotityEnum.IMPORTANT}`,
    priority: TaskPriotityEnum.IMPORTANT,
    color: colors.tint,
  },
  {
    title: `Priority ${TaskPriotityEnum.HIGH}`,
    priority: TaskPriotityEnum.HIGH,
    color: colors.palette.accent500,
  },
  {
    title: `Priority ${TaskPriotityEnum.MEDIUM}`,
    priority: TaskPriotityEnum.MEDIUM,
    color: colors.palette.secondary300,
  },
  {
    title: `Priority ${TaskPriotityEnum.LOW}`,
    priority: TaskPriotityEnum.LOW,
    color: colors.white,
  },
]
