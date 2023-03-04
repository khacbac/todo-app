/* eslint-disable react-native/no-inline-styles */
import { format } from "date-fns"
import { observer } from "mobx-react-lite"
import React, { FC, useMemo, useState } from "react"
import { ActivityIndicator, View, ViewStyle } from "react-native"
import { CalendarList } from "react-native-calendars"
import { MarkedDates } from "react-native-calendars/src/types"
import { Button } from "~/components"
import { CALENDAR_DATE_FORMAT } from "~/constants"
import { useStores } from "~/models"
import { AppStackScreenProps } from "~/navigators"
import { colors, spacing } from "~/theme"
import { useHeader } from "~/utils/useHeader"
import { useSafeAreaInsetsStyle } from "~/utils/useSafeAreaInsetsStyle"

interface CalendarProps extends AppStackScreenProps<"CalendarScreen"> {}

export const CalendarScreen: FC<CalendarProps> = observer(function CalendarScreen(_props) {
  const { navigation, route } = _props
  const today = new Date()
  const {
    todoStore: { todos },
  } = useStores()
  const $todayContainer = useSafeAreaInsetsStyle(["bottom"])
  const { date, onSelect } = route.params
  const [visible, setVisible] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>(date)

  useHeader(
    {
      titleTx: "calendar.title",
      leftIcon: "back",
      rightTx: "common.select",
      onLeftPress: navigation.goBack,
      onRightPress: () => {
        onSelect(selectedDate)
        navigation.goBack()
      },
    },
    [selectedDate],
  )

  const todosMarkedDates = useMemo(() => {
    const todosMarkerDates = todos.reduce<MarkedDates>((a, e) => {
      a[format(e.updatedAt, CALENDAR_DATE_FORMAT)] = {
        marked: true,
        dotColor: colors.primary,
      }
      return a
    }, {})
    const selectedDateFormat = format(selectedDate, CALENDAR_DATE_FORMAT)
    const selectedMarkerDates = {
      [selectedDateFormat]: {
        selected: true,
        selectedColor: colors.primary,
      },
    }
    if (todosMarkerDates[selectedDateFormat]) {
      todosMarkerDates[selectedDateFormat] = {
        ...todosMarkerDates[selectedDateFormat],
        ...selectedMarkerDates[selectedDateFormat],
      }
    } else {
      todosMarkerDates[selectedDateFormat] = selectedMarkerDates[selectedDateFormat]
    }
    return todosMarkerDates
  }, [todos, selectedDate])

  const onSelectToday = () => {
    onSelect(today)
    navigation.goBack()
  }

  return (
    <View style={container}>
      {!visible && <ActivityIndicator />}
      <View style={$fill}>
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
            todayTextColor: colors.tint,
            calendarBackground: colors.background,
            monthTextColor: colors.white,
            textDayFontWeight: "600",
            textMonthFontWeight: "600",
          }}
          onDayPress={(day) => {
            setSelectedDate(new Date(day.timestamp))
          }}
        />
      </View>
      <View style={[$todayContainer, $todayWrapper]}>
        <Button
          text="Today"
          preset="free"
          textStyle={{ color: colors.primary, fontSize: 18 }}
          style={$todayBtn}
          onPress={onSelectToday}
        />
      </View>
    </View>
  )
})

const container: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background,
}

const $fill: ViewStyle = { flex: 1 }

const $todayWrapper: ViewStyle = {
  paddingHorizontal: spacing.medium,
  paddingTop: spacing.extraSmall,
}

const $todayBtn: ViewStyle = {
  marginBottom: spacing.extraSmall,
  borderWidth: 1,
  borderColor: colors.primary,
  paddingVertical: spacing.tiny,
  paddingHorizontal: spacing.tiny,
}
