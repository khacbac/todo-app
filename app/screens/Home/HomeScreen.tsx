import { format, isSameDay } from "date-fns"
import { observer } from "mobx-react-lite"
import React, { FC, useRef } from "react"
import {
  FlatList,
  ListRenderItem,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native"
import { Button, Text, Toggle } from "~/components"
import { DEFAULT_DATE_FORMAT, WINDOW_WIDTH } from "~/constants"
import { useStores } from "~/models"
import { Todo } from "~/models/TodoStore"
import { AppStackScreenProps } from "~/navigators"
import { colors, spacing } from "~/theme"
import { useSafeAreaInsetsStyle } from "~/utils/useSafeAreaInsetsStyle"
import useHomeScreen from "./useHomeScreen"

interface HomeProps extends AppStackScreenProps<"HomeScreen"> {}

const HomeScreen: FC<HomeProps> = observer(function HomeScreen(_props) {
  const {
    todoStore: { completeTask, focusWeekTodos },
  } = useStores()
  const $containerSafeArea = useSafeAreaInsetsStyle(["top"])
  const $buttonSafeArea = useSafeAreaInsetsStyle(["bottom"])
  const horizontalScrollRef = useRef<FlatList>()

  const {
    gotoAddNewTodo,
    states: { focusDay, setFocusDay },
  } = useHomeScreen()

  const weekTodos = focusWeekTodos(focusDay)
  const initIndex = weekTodos.findIndex((e) => isSameDay(new Date(e.uuid), focusDay))

  const renderItem: ListRenderItem<Todo> = ({ item }) => {
    return (
      <View style={$itemWrapper}>
        <Toggle
          value={item.completed}
          onValueChange={() => {
            completeTask(item)
          }}
          variant="radio"
        />
        <View style={$itemContentWrapper}>
          <Text text={`${item.title}`} size="sm" weight="semiBold" />
          <Text text={`${item.description}`} size="xxs" numberOfLines={2} weight="normal" />
        </View>
      </View>
    )
  }

  const renderHeader = () => {
    return (
      <View style={$headerWrapper}>
        {weekTodos.map((dt, i) => {
          const day = new Date(dt.uuid)
          const isFocus = isSameDay(focusDay, day)
          return (
            <TouchableOpacity
              activeOpacity={0.8}
              key={String(i)}
              style={[$headerItemWrapper, isFocus && $headerItemFocusWrapper]}
              onPress={() => {
                setFocusDay(day)
                horizontalScrollRef.current?.scrollToIndex({ animated: false, index: i })
              }}
            >
              <Text text={format(day, "EEE")} weight="semiBold" />
              <Text text={format(day, "d")} style={$headerDayText} />
            </TouchableOpacity>
          )
        })}
      </View>
    )
  }

  return (
    <View style={[$container, $containerSafeArea]}>
      {renderHeader()}
      <View style={$separator} />
      <FlatList
        ref={horizontalScrollRef}
        data={weekTodos}
        horizontal
        pagingEnabled
        initialScrollIndex={initIndex}
        getItemLayout={(data, index) => ({
          length: WINDOW_WIDTH,
          offset: WINDOW_WIDTH * index,
          index,
        })}
        renderItem={({ item }) => {
          return (
            <View style={{ width: WINDOW_WIDTH }}>
              <Text
                text={format(new Date(item.uuid), DEFAULT_DATE_FORMAT)}
                style={$focusDayText}
                weight="medium"
              />
              <FlatList
                data={item.todos}
                renderItem={renderItem}
                keyExtractor={(_, index) => String(index)}
                contentContainerStyle={$contentContainerStyle}
                ItemSeparatorComponent={() => <View style={$itemSeparator} />}
              />
            </View>
          )
        }}
        keyExtractor={(item) => String(item.uuid)}
        onMomentumScrollEnd={(e) => {
          const { x } = e.nativeEvent.contentOffset
          const index = Math.floor(x / WINDOW_WIDTH)
          const item = weekTodos.find((_, i) => i === index)
          if (item) {
            setFocusDay(new Date(item.uuid))
          }
        }}
      />
      <View style={[$buttonSafeArea, $buttonWrapper]}>
        <Button tx="home.addTaskBtn" style={$button} onPress={gotoAddNewTodo} />
      </View>
    </View>
  )
})

export default HomeScreen

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background,
}

const $headerWrapper: ViewStyle = {
  flexDirection: "row",
  paddingHorizontal: spacing.medium,
  paddingVertical: spacing.extraSmall,
}

const $headerItemWrapper: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: colors.background,
  borderRadius: 16,
  paddingVertical: 8,
}
const $headerItemFocusWrapper: ViewStyle = {
  ...$headerItemWrapper,
  backgroundColor: colors.tint,
}

const $contentContainerStyle: ViewStyle = {
  paddingTop: spacing.medium,
  paddingHorizontal: spacing.medium,
}

const $itemSeparator: ViewStyle = {
  height: 0.5,
  backgroundColor: colors.border,
  marginLeft: 40,
}

const $itemWrapper: ViewStyle = {
  flexDirection: "row",
  paddingVertical: spacing.small,
}

const $itemContentWrapper: ViewStyle = {
  borderRadius: 16,
  flex: 1,
  marginLeft: spacing.small,
}

const $buttonWrapper: ViewStyle = { position: "absolute", bottom: 0, left: 16, right: 16 }
const $button: ViewStyle = {
  marginBottom: spacing.extraSmall,
}

const $separator: ViewStyle = {
  height: 0.5,
  backgroundColor: colors.separator,
  marginHorizontal: spacing.medium,
  marginTop: spacing.extraSmall,
  marginBottom: spacing.tiny,
}

const $focusDayText: TextStyle = {
  marginTop: spacing.extraSmall,
  alignSelf: "center",
  color: colors.tint,
}

const $headerDayText: TextStyle = { marginTop: spacing.tiny }
