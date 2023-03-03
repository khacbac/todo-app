import { format } from "date-fns"
import { observer } from "mobx-react-lite"
import React, { FC, useState } from "react"
import { TextStyle, View, ViewStyle } from "react-native"
import { TextField } from "~/components"
import { DEFAULT_DATE_FORMAT } from "~/constants"
import { useStores } from "~/models"
import { TodoModel } from "~/models/TodoStore"
import { AppStackScreenProps } from "~/navigators"
import { colors, spacing } from "~/theme"
import { useHeader } from "~/utils/useHeader"

interface AddNewTodoProps extends AppStackScreenProps<"AddNewTodo"> {}

const AddNewTodoScreen: FC<AddNewTodoProps> = observer(function AddNewTodoScreen(_props) {
  const { navigation, route } = _props
  const { focusDay } = route.params
  const {
    todoStore: { addTask },
  } = useStores()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  useHeader(
    {
      title: format(focusDay, DEFAULT_DATE_FORMAT),
      leftTx: "common.cancel",
      rightTx: "common.add",
      safeAreaEdges: [],
      onLeftPress: navigation.goBack,
      onRightPress: () => {
        if (title) {
          const todo = TodoModel.create({
            title,
            description,
            uuid: Date.now().toString(),
            createdAt: focusDay,
            updatedAt: focusDay,
          })
          addTask(todo)
          navigation.goBack()
        }
      },
    },
    [title, description],
  )

  return (
    <View style={container}>
      <View style={$inputSection}>
        <TextField placeholder="title" inputWrapperStyle={$inputWrapper} onChangeText={setTitle} />
        <View style={$indicator} />
        <TextField
          placeholder="description"
          inputWrapperStyle={$inputWrapper}
          multiline
          style={$descriptionInput}
          onChangeText={setDescription}
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
