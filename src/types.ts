export type DisplayMode = "active" | "completed"

// 0 = 低, 1 = 中, 2 = 高
export type Priority = 0 | 1 | 2

export type Todo = {
  id: string
  todoText: string
  completed: boolean
  priority: Priority
  dueDateMs: number
}
