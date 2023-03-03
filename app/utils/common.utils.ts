import { addDays, startOfWeek } from "date-fns"

export const getDaysOfAWeek = (day: Date) => {
  const startDayOfWeek = startOfWeek(day)
  return Array(7)
    .fill(null)
    .map((_, index) => {
      return addDays(startDayOfWeek, index)
    })
}
