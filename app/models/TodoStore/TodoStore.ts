import { format, isSameDay } from "date-fns"
import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { getDaysOfAWeek } from "~/utils/common.utils"
import { Todo, TodoModel } from "./TodoModel"

export const TodoStoreModel = types
  .model("TodoStore")
  .props({
    todos: types.array(TodoModel),
    // today
    focusDay: new Date(),
  })
  .views((store) => ({
    focusWeekTodos(day: Date) {
      const daysOfWeek = getDaysOfAWeek(day)
      const todosOfWeek = daysOfWeek.map((d) => {
        return {
          uuid: new Date(d).toISOString(),
          todos: store.todos.filter((e) => isSameDay(e.updatedAt, d)),
        }
      }, {})
      return todosOfWeek
    },
  }))
  .actions((store) => ({
    addTodo(todo: Todo) {
      store.todos.push(todo)
    },
    setFocusDay(day: Date) {
      store.focusDay = day
    },
  }))

export interface TodoStore extends Instance<typeof TodoStoreModel> {}
export interface TodoStoreSnapshot extends SnapshotOut<typeof TodoStoreModel> {}
