/* eslint-disable react-native/no-inline-styles */
import { format } from "date-fns"
import { observer } from "mobx-react-lite"
import React, { FC, useRef, useState } from "react"
import { TextStyle, View, ViewStyle } from "react-native"
import { Button, Icon, TextField } from "~/components"
import { ActionType, AppActionSheet, AppActionSheetType } from "~/components/modals"
import { DEFAULT_DATE_FORMAT, PRIORITIES } from "~/constants"
import { useStores } from "~/models"
import { TodoModel } from "~/models/TodoStore"
import { AppStackScreenProps } from "~/navigators"
import { colors, spacing } from "~/theme"
import { TaskPriotityEnum } from "~/types"
import { useHeader } from "~/utils/useHeader"

interface AddNewTodoProps extends AppStackScreenProps<"AddNewTodo"> {}

const AddNewTodoScreen: FC<AddNewTodoProps> = observer(function AddNewTodoScreen(_props) {
  const { navigation, route } = _props
  const { focusDay, task } = route.params
  const actionSheet = useRef<AppActionSheetType>()
  const {
    todoStore: { addTask },
  } = useStores()
  const [title, setTitle] = useState(task?.title || "")
  const [description, setDescription] = useState(task?.description || "")
  const [priority, setPriority] = useState<TaskPriotityEnum>(task?.priority || TaskPriotityEnum.LOW)

  const openActionsMenu = async () => {
    const actions = PRIORITIES.map<ActionType>((val) => {
      return {
        buttonProps: {
          text: val.title,
          textStyle: {
            color: val.color,
          },
        },
      }
    })
    const index = await actionSheet.current.show({ actions })
    switch (index) {
      case 0:
        setPriority(TaskPriotityEnum.IMPORTANT)
        break
      case 1:
        setPriority(TaskPriotityEnum.HIGH)
        break
      case 2:
        setPriority(TaskPriotityEnum.MEDIUM)
        break
      case 3:
        setPriority(TaskPriotityEnum.LOW)
        break
      default:
        break
    }
  }

  useHeader(
    {
      title: format(task?.updatedAt || focusDay, DEFAULT_DATE_FORMAT),
      leftTx: "common.cancel",
      rightTx: task ? "common.update" : "common.add",
      safeAreaEdges: [],
      onLeftPress: navigation.goBack,
      onRightPress: () => {
        if (title) {
          if (task) {
            task.update({ title, description, priority })
            navigation.goBack()
            return
          }
          const todo = TodoModel.create({
            title,
            description,
            priority,
            uuid: Date.now().toString(),
            createdAt: focusDay,
            updatedAt: focusDay,
          })
          addTask(todo)
          navigation.goBack()
        }
      },
    },
    [title, description, priority],
  )

  const renderPriority = () => {
    const item = PRIORITIES.find((e) => e.priority === priority)
    if (!item) {
      return null
    }
    return (
      <View style={$priorityContainer}>
        <Button
          text={item.title}
          preset="free"
          textStyle={{ color: item.color }}
          onPress={openActionsMenu}
          style={$priorityBtn}
          RightAccessory={() => (
            <Icon
              icon="caretLeft"
              style={{ transform: [{ rotate: "-90deg" }], marginTop: -2, marginLeft: 4 }}
              size={24}
              color={item.color}
            />
          )}
        />
        {task && (
          <Button
            tx="common.delete"
            preset="free"
            textStyle={{ color: colors.error }}
            onPress={() => {
              task.remove()
              navigation.goBack()
            }}
            style={$priorityBtn}
          />
        )}
      </View>
    )
  }

  return (
    <View style={container}>
      <View style={$inputSection}>
        <TextField
          placeholderTx="addNewTask.titlePlh"
          inputWrapperStyle={$inputWrapper}
          onChangeText={setTitle}
          style={$input}
          autoFocus
          value={title}
        />
        <View style={$indicator} />
        <TextField
          placeholderTx="addNewTask.descriptionPlh"
          inputWrapperStyle={$inputWrapper}
          multiline
          style={$descriptionInput}
          onChangeText={setDescription}
          value={description}
        />
      </View>
      {renderPriority()}
      <AppActionSheet ref={actionSheet} />
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
  marginTop: spacing.extraSmall,
}

const $inputWrapper: ViewStyle = {
  borderWidth: 0,
  borderRadius: 0,
}

const $indicator: ViewStyle = {
  backgroundColor: colors.separator,
  height: 0.5,
}

const $input: TextStyle = { marginHorizontal: 0 }

const $descriptionInput: TextStyle = { ...$input, maxHeight: 150, fontSize: 16 }

const $priorityContainer: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  marginTop: spacing.extraSmall,
  justifyContent: "space-between",
}

const $priorityBtn: ViewStyle = {}
