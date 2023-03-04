import { getRoot, Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { TaskPriotityEnum } from "~/types"
import { withSetPropAction } from "../helpers/withSetPropAction"

export const TodoModel = types
  .model("Todo")
  .props({
    title: "",
    description: "",
    uuid: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    completed: false,
    priority: TaskPriotityEnum.LOW,
  })
  .actions(withSetPropAction)
  .actions((store) => ({
    toggle() {
      store.completed = !store.completed
    },
    update(params: { title: string; description: string; priority: TaskPriotityEnum }) {
      store.title = params.title
      store.description = params.description
      store.priority = params.priority
    },
    remove() {
      getRoot<any>(store).todoStore.removeTodo(store)
    },
  }))

export interface Todo extends Instance<typeof TodoModel> {}
export interface TodoSnapshotOut extends SnapshotOut<typeof TodoModel> {}
export interface TodoSnapshotIn extends SnapshotIn<typeof TodoModel> {}
