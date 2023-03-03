import { format, isSameDay } from "date-fns"
import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { getDaysOfAWeek } from "~/utils/common.utils"
import { Todo, TodoModel } from "./TodoModel"

export const TodoStoreModel = types
  .model("TodoStore")
  .props({
    todos: types.array(TodoModel),
  })
  .views((store) => ({
    focusWeekTodos(day: Date) {
      const daysOfWeek = getDaysOfAWeek(day)
      const todosOfWeek = daysOfWeek.map((d) => {
        return {
          uuid: new Date(d).toISOString(),
          todos: store.todos.filter((e) => isSameDay(e.updatedAt, d) && !e.completed),
        }
      }, {})
      return todosOfWeek
    },
  }))
  .actions((store) => ({
    addTask(todo: Todo) {
      store.todos.push(todo)
    },
    completeTask(todo: Todo) {
      todo.setProp("completed", true)
    },
  }))

export interface TodoStore extends Instance<typeof TodoStoreModel> {}
export interface TodoStoreSnapshot extends SnapshotOut<typeof TodoStoreModel> {}
