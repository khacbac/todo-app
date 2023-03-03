import { addDays, addHours, endOfWeek, format, isSameDay, startOfDay, startOfWeek } from "date-fns"
import { observer } from "mobx-react-lite"
import React, { FC, useRef, useState } from "react"
import {
  Dimensions,
  FlatList,
  ListRenderItem,
  ScrollView,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native"
import { Agenda } from "react-native-calendars"
import { Button, Text } from "~/components"
import { useStores } from "~/models"
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

const getHousesOfADayStrings = () => {
  const startOfADay = startOfDay(new Date())
  return Array(24)
    .fill(null)
    .map((_, index) => {
      return format(addHours(startOfADay, index), "HH:mm")
    })
}

const HomeScreen: FC<HomeProps> = observer(function HomeScreen(_props) {
  const { navigation } = _props
  const {} = useStores()
  const $containerSafeArea = useSafeAreaInsetsStyle(["top"])
  const $buttonSafeArea = useSafeAreaInsetsStyle(["bottom"])
  const [focusDay, setFocusDay] = useState(new Date())
  const horizontalScrollRef = useRef<FlatList>()

  const { gotoAddNewTodo } = useHomeScreen()

  const days = getDaysOfThisWeek()

  const renderItem: ListRenderItem<any> = ({ item, index }) => {
    return (
      <View style={$itemWrapper}>
        <View
          style={{
            width: 24,
            height: 24,
            borderWidth: 1,
            borderRadius: 24,
            borderColor: colors.white,
          }}
        />
        <View style={$itemContentWrapper}>
          <Text text={`Task ${index}`} />
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
        {days.map((day, i) => {
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
        data={days}
        horizontal
        pagingEnabled
        renderItem={() => {
          return (
            <View style={{ width: Dimensions.get("window").width }}>
              <FlatList
                data={Array(10).fill(null)}
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
          const item = days.find((_, i) => i === index)
          if (item) {
            setFocusDay(item)
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
