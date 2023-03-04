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
import { Button, Icon, Text } from "~/components"
import { WINDOW_WIDTH } from "~/constants"
import { AppStackScreenProps } from "~/navigators"
import { colors, spacing } from "~/theme"
import { getDaysOfAWeek } from "~/utils/common.utils"
import { useSafeAreaInsetsStyle } from "~/utils/useSafeAreaInsetsStyle"
import { TodoList } from "./components"
import useHomeScreen from "./useHomeScreen"

interface HomeProps extends AppStackScreenProps<"HomeScreen"> {}

const HomeScreen: FC<HomeProps> = observer(function HomeScreen(_props) {
  const $containerSafeArea = useSafeAreaInsetsStyle(["top"])
  const $buttonSafeArea = useSafeAreaInsetsStyle(["bottom"])
  const horizontalScrollRef = useRef<FlatList>()

  const {
    gotoAddNewTodo,
    gotoCalendar,
    states: { focusDay, setFocusDay },
  } = useHomeScreen()

  const daysOfWeek = getDaysOfAWeek(focusDay)
  const initIndex = daysOfWeek.findIndex((e) => isSameDay(e, focusDay))

  const renderHeader = () => {
    return (
      <>
        <TouchableOpacity style={$calendarIconBtn} onPress={gotoCalendar}>
          <Icon icon="settings" size={24} />
        </TouchableOpacity>
        <View style={$headerWrapper}>
          {daysOfWeek.map((day, i) => {
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
      </>
    )
  }

  const renderItem: ListRenderItem<Date> = (props) => {
    return <TodoList {...props} />
  }

  return (
    <View style={[$container, $containerSafeArea]}>
      {renderHeader()}
      <View style={$separator} />
      <FlatList
        ref={horizontalScrollRef}
        data={daysOfWeek}
        horizontal
        pagingEnabled
        initialScrollIndex={initIndex}
        getItemLayout={(data, index) => ({
          length: WINDOW_WIDTH,
          offset: WINDOW_WIDTH * index,
          index,
        })}
        renderItem={renderItem}
        keyExtractor={(item) => item}
        onMomentumScrollEnd={(e) => {
          const { x } = e.nativeEvent.contentOffset
          const index = Math.floor(x / WINDOW_WIDTH)
          const item = daysOfWeek.find((_, i) => i === index)
          if (item) {
            setFocusDay(item)
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

const $headerDayText: TextStyle = { marginTop: spacing.tiny }

const $calendarIconBtn: ViewStyle = {
  alignSelf: "flex-end",
  marginRight: spacing.medium,
  marginVertical: spacing.extraSmall,
}
