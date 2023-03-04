import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import { View, ViewStyle } from "react-native"
import { Text } from "~/components"
import { useStores } from "~/models"
import { AppStackScreenProps } from "~/navigators"
import { colors } from "~/theme"
import { useHeader } from "~/utils/useHeader"

interface CalendarProps extends AppStackScreenProps<"CalendarScreen"> {}

export const CalendarScreen: FC<CalendarProps> = observer(function CalendarScreen(_props) {
  const { navigation } = _props
  const {} = useStores()

  useHeader({ titleTx: "calendar.title", leftIcon: "back", onLeftPress: navigation.goBack })

  return <View style={container}></View>
})

const container: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background,
}
