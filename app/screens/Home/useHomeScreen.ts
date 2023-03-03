import { useNavigation } from "@react-navigation/native"
import { useState } from "react"
import { useStores } from "~/models"
import { AppStackProps } from "~/navigators"

const useHomeScreen = () => {
  const navigation = useNavigation<AppStackProps<"AddNewTodo">>()
  const [focusDay, setFocusDay] = useState(new Date())

  const {
    todoStore: { todos },
  } = useStores()

  console.log("BACHK_____ todos : ", todos)

  const gotoAddNewTodo = () => {
    navigation.navigate("AddNewTodo", { focusDay })
  }

  return { gotoAddNewTodo, states: { focusDay, setFocusDay } }
}

export default useHomeScreen
