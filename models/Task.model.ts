import { v4 as uuidv4 } from "uuid"

export class Task {
  id: string
  title: string
  description: string
  user: string

  static tasks: Task[] = []

  constructor(title: string, description: string, user: string) {
    this.id = uuidv4()
    this.title = title
    this.description = description
    this.user = user
    if (!title) {
      throw new Error("title is required.")
    }
    if (!description) {
      throw new Error("description is required.")
    }
    if (!user) {
      throw new Error("user is required.")
    }
  }

  save(): void {
    Task.tasks.push(this)
  }

  // Static method to find a task by its ID
  static findById(taskId: string): Task | null {
    const task = this.tasks.find((task) => task.id === taskId)
    if (!task) {
      throw new Error("Task not found.")
    }
    return task
  }

  // find all tasks of user by user id
  static findAllByUser(user: { id: string }): Task[] {
    return this.tasks.filter((task) => task.user === user.id)
  }
}

export type TaskDocument = {
  id: string
  title: string
  description: string
  user: string
}
