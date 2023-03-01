import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import { View, ViewStyle } from "react-native"
import { Text } from "~/components"
import { useStores } from "~/models"
import { AppStackScreenProps } from "~/navigators"
import { colors } from "~/theme"

interface HomeProps extends AppStackScreenProps<"HomeScreen"> {}

const HomeScreen: FC<HomeProps> = observer(function HomeScreen(_props) {
  const { navigation } = _props
  const {} = useStores()

  return (
    <View style={container}>
      <Text size="sm" text="TEST" />
    </View>
  )
})

export default HomeScreen

const container: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background,
}
