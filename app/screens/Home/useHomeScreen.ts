import { useNavigation } from "@react-navigation/native"
import { useState } from "react"
import { AppStackProps } from "~/navigators"

const useHomeScreen = () => {
  const navigation = useNavigation<AppStackProps<"AddNewTodo">>()
  const [focusDay, setFocusDay] = useState(new Date())

  const gotoAddNewTodo = () => {
    navigation.navigate("AddNewTodo", { focusDay })
  }

  const gotoCalendar = () => {
    navigation.navigate("CalendarScreen")
  }

  return { gotoAddNewTodo, gotoCalendar, states: { focusDay, setFocusDay } }
}

export default useHomeScreen
