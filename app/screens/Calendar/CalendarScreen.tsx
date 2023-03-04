/* eslint-disable react-native/no-inline-styles */
import { format, isSameDay } from "date-fns"
import { observer } from "mobx-react-lite"
import React, { FC, useState } from "react"
import { ActivityIndicator, View, ViewStyle } from "react-native"
import { CalendarList } from "react-native-calendars"
import { MarkedDates } from "react-native-calendars/src/types"
import { CALENDAR_DATE_FORMAT } from "~/constants"
import { useStores } from "~/models"
import { AppStackScreenProps } from "~/navigators"
import { colors } from "~/theme"
import { useHeader } from "~/utils/useHeader"

interface CalendarProps extends AppStackScreenProps<"CalendarScreen"> {}

export const CalendarScreen: FC<CalendarProps> = observer(function CalendarScreen(_props) {
  const { navigation, route } = _props
  const {
    todoStore: { todos },
  } = useStores()
  const { date, onSelect } = route.params
  const [visible, setVisible] = useState(false)
  const [selectedDates, setSelectedDates] = useState<Date[]>([date])

  useHeader(
    {
      titleTx: "calendar.title",
      leftIcon: "back",
      rightTx: "common.select",
      onLeftPress: navigation.goBack,
      onRightPress: () => {
        onSelect(selectedDates[0])
        navigation.goBack()
      },
    },
    [selectedDates],
  )

  const todosMarkedDates = todos.reduce<MarkedDates>((a, e) => {
    const isSelected = selectedDates.some((val) => isSameDay(val, e.updatedAt))
    a[format(e.updatedAt, CALENDAR_DATE_FORMAT)] = {
      marked: true,
      dotColor: colors.primary,
      ...(isSelected && { selected: true, selectedColor: colors.primary }),
    }
    return a
  }, {})

  return (
    <View style={container}>
      {!visible && <ActivityIndicator />}
      <CalendarList
        onVisibleMonthsChange={() => {
          setVisible(true)
        }}
        // Max amount of months allowed to scroll to the past. Default = 50
        pastScrollRange={50}
        // Max amount of months allowed to scroll to the future. Default = 50
        futureScrollRange={50}
        // Enable or disable scrolling of calendar list
        scrollEnabled={true}
        // Enable or disable vertical scroll indicator. Default = false
        showScrollIndicator={true}
        style={{ opacity: visible ? 1 : 0 }}
        markedDates={todosMarkedDates}
        theme={{
          dayTextColor: colors.white,
          textDisabledColor: "blue",
          todayTextColor: colors.tint,
          calendarBackground: colors.background,
          monthTextColor: colors.white,
          textDayFontWeight: "600",
          textMonthFontWeight: "600",
        }}
        onDayPress={(day) => {
          setSelectedDates([new Date(day.timestamp)])
        }}
      />
    </View>
  )
})

const container: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background,
}
