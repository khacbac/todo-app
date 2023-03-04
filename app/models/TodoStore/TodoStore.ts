import { isSameDay } from "date-fns"
import { destroy, Instance, SnapshotOut, types } from "mobx-state-tree"
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
    getTodos(day: Date) {
      return (
        store.todos
          .filter((e) => isSameDay(e.updatedAt, day) && !e.completed)
          // sort by title
          .sort((a, b) => {
            const nameA = a.title.toUpperCase()
            const nameB = b.title.toUpperCase()
            if (nameA < nameB) {
              return -1
            }
            if (nameA > nameB) {
              return 1
            }
            return 0
          })
          // sort by priority
          .sort((a, b) => a.priority - b.priority)
      )
    },
  }))
  .actions((store) => ({
    addTask(todo: Todo) {
      store.todos.push(todo)
    },
    removeTodo(task) {
      destroy(task)
    },
  }))

export interface TodoStore extends Instance<typeof TodoStoreModel> {}
export interface TodoStoreSnapshot extends SnapshotOut<typeof TodoStoreModel> {}
