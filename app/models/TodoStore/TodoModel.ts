import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
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
  })
  .actions(withSetPropAction)
  .actions((store) => ({
    toggle() {
      store.completed = !store.completed
    },
    update(title: string, description: string) {
      store.title = title
      store.description = description
    },
  }))

export interface Todo extends Instance<typeof TodoModel> {}
export interface TodoSnapshotOut extends SnapshotOut<typeof TodoModel> {}
export interface TodoSnapshotIn extends SnapshotIn<typeof TodoModel> {}
