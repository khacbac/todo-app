import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import { TextStyle, View, ViewStyle } from "react-native"
import { TextField } from "~/components"
import { useStores } from "~/models"
import { AppStackScreenProps } from "~/navigators"
import { colors, spacing } from "~/theme"
import { useHeader } from "~/utils/useHeader"

interface AddNewTodoProps extends AppStackScreenProps<"AddNewTodo"> {}

const AddNewTodoScreen: FC<AddNewTodoProps> = observer(function AddNewTodoScreen(_props) {
  const { navigation } = _props
  const {} = useStores()

  useHeader({
    title: "New Todo",
    leftTx: "common.cancel",
    rightTx: "common.add",
    safeAreaEdges: [],
    onLeftPress: navigation.goBack,
    // onRightPress: logout,
  })

  return (
    <View style={container}>
      <View style={$inputSection}>
        <TextField placeholder="title" inputWrapperStyle={$inputWrapper} />
        <View style={$indicator} />
        <TextField
          placeholder="description"
          inputWrapperStyle={$inputWrapper}
          multiline
          style={$descriptionInput}
        />
      </View>
    </View>
  )
})

export default AddNewTodoScreen

const container: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background,
  paddingHorizontal: 20,
}

const $inputSection: ViewStyle = {
  borderRadius: 8,
  overflow: "hidden",
  paddingHorizontal: spacing.extraSmall,
  backgroundColor: colors.warmGray700,
}

const $inputWrapper: ViewStyle = {
  borderWidth: 0,
  borderRadius: 0,
}

const $indicator: ViewStyle = {
  backgroundColor: colors.separator,
  height: 0.5,
}

const $descriptionInput: TextStyle = { maxHeight: 150 }
