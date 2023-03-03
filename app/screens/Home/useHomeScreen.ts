import { useNavigation } from "@react-navigation/native"
import { AppStackProps } from "~/navigators"

const useHomeScreen = () => {
  const navigation = useNavigation<AppStackProps<"AddNewTodo">>()

  const gotoAddNewTodo = () => {
    navigation.navigate("AddNewTodo")
  }

  return { gotoAddNewTodo }
}

export default useHomeScreen
