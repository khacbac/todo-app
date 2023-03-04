import { useNavigation } from "@react-navigation/native"
import { useState } from "react"
import { Todo } from "~/models/TodoStore"
import { AppStackProps } from "~/navigators"

const useHomeScreen = () => {
  const navigation = useNavigation<AppStackProps<"AddNewTodo">>()
  const [focusDay, setFocusDay] = useState(new Date())

  const gotoAddNewTodo = () => {
    navigation.navigate("AddNewTodo", { focusDay })
  }

  const gotoEditTodo = (task: Todo) => {
    navigation.navigate("AddNewTodo", { task })
  }

  return { gotoAddNewTodo, gotoEditTodo, states: { focusDay, setFocusDay } }
}

export default useHomeScreen
