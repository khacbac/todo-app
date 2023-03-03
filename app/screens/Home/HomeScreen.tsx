import { addDays, addHours, format, isSameDay, startOfDay, startOfWeek } from "date-fns"
import { observer } from "mobx-react-lite"
import React, { FC, useRef } from "react"
import {
  Dimensions,
  FlatList,
  ListRenderItem,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native"
import { Button, Text, Toggle } from "~/components"
import { useStores } from "~/models"
import { Todo } from "~/models/TodoStore"
import { AppStackScreenProps } from "~/navigators"
import { colors, spacing } from "~/theme"
import { useSafeAreaInsetsStyle } from "~/utils/useSafeAreaInsetsStyle"
import useHomeScreen from "./useHomeScreen"

interface HomeProps extends AppStackScreenProps<"HomeScreen"> {}

const WINDOW_WIDTH = Dimensions.get("window").width
const getDaysOfThisWeek = () => {
  const startDayOfWeek = startOfWeek(new Date())
  return Array(7)
    .fill(null)
    .map((_, index) => {
      return addDays(startDayOfWeek, index)
    })
}

const HomeScreen: FC<HomeProps> = observer(function HomeScreen(_props) {
  const { navigation } = _props
  const {
    todoStore: { todos, focusWeekTodos },
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
        <Toggle value={true} onValueChange={() => {}} variant="radio" />
        <View style={$itemContentWrapper}>
          <Text text={`${item.title}`} />
        </View>
      </View>
    )
  }

  const renderHeader = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: spacing.medium,
          paddingVertical: spacing.extraSmall,
        }}
      >
        {weekTodos.map((dt, i) => {
          const day = new Date(dt.uuid)
          const isFocus = isSameDay(focusDay, day)
          return (
            <TouchableOpacity
              activeOpacity={0.8}
              key={String(i)}
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: isFocus ? "red" : colors.background,
                borderRadius: 16,
                paddingVertical: 8,
              }}
              onPress={() => {
                setFocusDay(day)
                horizontalScrollRef.current?.scrollToIndex({ animated: true, index: i })
              }}
            >
              <Text text={format(day, "EEE")} />
              <Text text={format(day, "d")} />
            </TouchableOpacity>
          )
        })}
      </View>
    )
  }

  return (
    <View style={[$container, $containerSafeArea]}>
      {renderHeader()}
      <View
        style={{
          height: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          marginHorizontal: spacing.medium,
          marginTop: spacing.extraSmall,
          marginBottom: spacing.tiny,
        }}
      />
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
        keyExtractor={(_, index) => String(index)}
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
        <Button text="Add New Todo" style={$button} onPress={gotoAddNewTodo} />
      </View>
    </View>
  )
})

export default HomeScreen

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background,
}

const $contentContainerStyle: ViewStyle = {
  paddingTop: spacing.medium,
  paddingHorizontal: spacing.medium,
}

const $itemSeparator: ViewStyle = {
  height: 1,
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
