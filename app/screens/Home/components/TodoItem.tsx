/* eslint-disable react-native/no-inline-styles */
import { useNavigation } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import { TouchableOpacity, View, ViewStyle, ListRenderItemInfo } from "react-native"
import { Text, Toggle } from "~/components"
import { Todo } from "~/models/TodoStore"
import { AppStackProps } from "~/navigators"
import { spacing } from "~/theme"
import { getPriorityColor } from "~/utils/common.utils"

type TodoItemProps = ListRenderItemInfo<Todo>

export const TodoItem: FC<TodoItemProps> = observer(function TodoItem(_props) {
  const { item } = _props
  const navigation = useNavigation<AppStackProps<"HomeScreen">>()

  const gotoEditTodo = () => {
    navigation.navigate("AddNewTodo", { task: item })
  }

  return (
    <TouchableOpacity style={$itemWrapper} onPress={gotoEditTodo}>
      <Toggle
        value={item.completed}
        onValueChange={() => {
          item.toggle()
        }}
        variant="radio"
      />
      <View style={$itemContentWrapper}>
        <Text
          text={`${item.title}`}
          size="sm"
          weight="semiBold"
          style={{
            color: getPriorityColor(item),
            ...(item.completed && {
              textDecorationLine: "line-through",
              textDecorationColor: getPriorityColor(item),
            }),
          }}
        />
        <Text
          text={`${item.description}`}
          size="xxs"
          numberOfLines={2}
          weight="normal"
          style={{
            ...(item.completed && {
              textDecorationLine: "line-through",
            }),
          }}
        />
      </View>
    </TouchableOpacity>
  )
})

const $itemWrapper: ViewStyle = {
  flexDirection: "row",
  paddingVertical: spacing.small,
}

const $itemContentWrapper: ViewStyle = {
  borderRadius: 16,
  flex: 1,
  marginLeft: spacing.small,
}
