import { format } from "date-fns"
import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import {
  FlatList,
  ListRenderItem,
  ListRenderItemInfo,
  TextStyle,
  View,
  ViewStyle,
} from "react-native"
import { Text } from "~/components"
import { DEFAULT_DATE_FORMAT, WINDOW_WIDTH } from "~/constants"
import { useStores } from "~/models"
import { Todo } from "~/models/TodoStore"
import { colors, spacing } from "~/theme"
import { useSafeAreaInsetsStyle } from "~/utils/useSafeAreaInsetsStyle"
import { TodoItem } from "./TodoItem"

type TodoItemProps = ListRenderItemInfo<Date>

export const TodoList: FC<TodoItemProps> = observer(function TodoList(_props) {
  const { item } = _props
  const $scrollSafeArea = useSafeAreaInsetsStyle(["bottom"])
  const {
    todoStore: { getTodos, getStatistics },
  } = useStores()

  const statistics = getStatistics(item)

  const $scrollStyle: ViewStyle[] = [
    $contentContainerStyle,
    { paddingBottom: (+$scrollSafeArea?.paddingBottom || 0) + 70 },
  ]

  const renderItem: ListRenderItem<Todo> = (props) => {
    return <TodoItem {...props} />
  }

  return (
    <View style={{ width: WINDOW_WIDTH }}>
      <View style={$topHeader}>
        <Text text={format(item, DEFAULT_DATE_FORMAT)} style={$focusDayText} weight="medium" />
        <View style={$statisticsWrapper}>
          <Text text={`${statistics.completed}/${statistics.total}`} weight="semiBold" />
        </View>
      </View>

      <FlatList
        data={getTodos(item)}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.uuid}-${index}`}
        contentContainerStyle={$scrollStyle}
        ItemSeparatorComponent={() => <View style={$itemSeparator} />}
      />
    </View>
  )
})

const $contentContainerStyle: ViewStyle = {
  paddingTop: spacing.medium,
  paddingHorizontal: spacing.medium,
}

const $topHeader: ViewStyle = {
  alignItems: "center",
  marginTop: spacing.extraSmall,
}

const $statisticsWrapper: ViewStyle = {
  position: "absolute",
  right: spacing.medium,
}

const $itemSeparator: ViewStyle = {
  height: 0.5,
  backgroundColor: colors.border,
  marginLeft: 40,
}

const $focusDayText: TextStyle = {
  alignSelf: "center",
  color: colors.tint,
}
