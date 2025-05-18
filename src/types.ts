export type Priority = "high" | "medium" | "low"
export type PriorityOrder = 0 | 1 | 2
export type PriorityInfo = {
  order: PriorityOrder
  label: string
}

export type DisplayMode = "active" | "completed"
export type Todo = {
  id: string
  title: string
  status: boolean
  priority: Priority
  date: number
}
