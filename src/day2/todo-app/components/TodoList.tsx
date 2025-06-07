import type { DisplayMode, Priority, Todo } from "../../types.ts"
import { format, isToday, isTomorrow } from "date-fns"
import { type Dispatch, useState } from "react"
import * as React from "react"

type TodoListProps = {
  todos: Todo[]
  setTodos: Dispatch<React.SetStateAction<Todo[]>>
  searchText: string
  priority: Priority
}

export const TodoList = (props: TodoListProps) => {
  const PRIORITY_LABELS = ["低", "中", "高"] as const

  const [displayMode, setDisplayMode] = useState<DisplayMode>("active")

  const updateTodo = (id: string, updates: Partial<Todo>) => {
    props.setTodos(props.todos.map((todo) => (todo.id === id ? { ...todo, ...updates } : todo)))
  }

  const deleteTodo = (id: string) => {
    props.setTodos(props.todos.filter((todo) => todo.id !== id))
  }

  const compareTodoByPriorityAndText = (a: Todo, b: Todo) => {
    const priorityCompareValue = b.priority - a.priority
    return priorityCompareValue !== 0 ? priorityCompareValue : a.todoText.localeCompare(b.todoText)
  }

  const filterAndSortTodos = (): Todo[] => {
    return props.todos
      .filter((todo) => (displayMode === "active" ? !todo.completed : todo.completed))
      .filter((todo) => todo.todoText.toLowerCase().includes(props.searchText.toLowerCase()))
      .sort(compareTodoByPriorityAndText)
  }

  const formatDueDateLabel = (date: Date) => {
    if (isToday(date)) return "🟠 今日"
    if (isTomorrow(date)) return "🟡 明日"
    if (date < new Date()) return "❌ 期限切れ"
    return `🟢 ${format(date, "yyyy-MM-dd")}`
  }

  return (
    <div className="todo-list-container">
      <div className="todo-list-header-container">
        <h2 className="list-title">{displayMode === "active" ? "未完了のTodo" : "完了したTodo"}</h2>
        <button
          onClick={() => setDisplayMode(displayMode === "active" ? "completed" : "active")}
          className="toggle-button"
        >
          {displayMode === "active" ? "完了したTodoを表示" : "未完了のTodoを表示"}
        </button>
      </div>
      {filterAndSortTodos().length === 0 ? (
        <p className="empty-message">
          {displayMode === "active" ? "Todoがありません。新しいTodoを追加してください。" : "完了したTodoはありません。"}
        </p>
      ) : (
        <ul className="todo-list">
          {filterAndSortTodos().map((todo) => (
            <li key={todo.id} className={`todo-item priority-${props.priority}`}>
              <div className="todo-wrapper">
                <span className="todo-text">
                  [{PRIORITY_LABELS[todo.priority]}] {todo.todoText}
                </span>
                <span className="due-date-label"> {formatDueDateLabel(new Date(todo.dueDateMs))}</span>
              </div>
              <div className="todo-actions">
                <button onClick={() => updateTodo(todo.id, { completed: !todo.completed })} className="complete-button">
                  {todo.completed ? "再開" : "完了"}
                </button>
                <button onClick={() => deleteTodo(todo.id)} className="delete-button">
                  削除
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
