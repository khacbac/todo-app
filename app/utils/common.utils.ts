import { addDays, startOfWeek } from "date-fns"
import { ColorValue } from "react-native"
import { PRIORITIES } from "~/constants"
import { Todo } from "~/models/TodoStore"
import { colors } from "~/theme"

export const getDaysOfAWeek = (day: Date) => {
  const startDayOfWeek = startOfWeek(day)
  return Array(7)
    .fill(null)
    .map((_, index) => {
      return addDays(startDayOfWeek, index)
    })
}

export const getPriorityColor = (task: Todo): ColorValue => {
  return PRIORITIES.find((e) => e.priority === task.priority)?.color || colors.white
}
