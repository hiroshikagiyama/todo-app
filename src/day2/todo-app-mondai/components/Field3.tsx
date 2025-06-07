import type { Mode, Priority, Todo } from "../types.ts"
import { format, isToday, isTomorrow } from "date-fns"
import { type Dispatch, useState } from "react"
import * as React from "react"

type Field3Props = {
  items: Todo[]
  setItems: Dispatch<React.SetStateAction<Todo[]>>
  search: string
  value: Priority
}

export const Field3 = (props: Field3Props) => {
  const [mode, setMode] = useState<Mode>("active")

  const change = (id: string, updates: Partial<Todo>) => {
    props.setItems(props.items.map((todo) => (todo.id === id ? { ...todo, ...updates } : todo)))
  }

  const filterAndSort = (): Todo[] => {
    return props.items
      .filter((item) => {
        if (mode === "active") {
          return !item.check
        } else {
          return item.check
        }
      })
      .filter((item) => {
        return item.item.toLowerCase().includes(props.search.toLowerCase())
      })
      .sort((a, b) => {
        return b.value - a.value !== 0 ? b.value - a.value : a.item.localeCompare(b.item)
      })
  }

  const transform = (date: Date) => {
    if (isToday(date)) {
      return "🟠 今日"
    } else {
      if (isTomorrow(date)) {
        return "🟡 明日"
      } else {
        if (date < new Date()) {
          return "❌ 期限切れ"
        } else {
          return `🟢 ${format(date, "yyyy-MM-dd")}`
        }
      }
    }
  }

  const del = (id: string) => {
    props.setItems(props.items.filter((todo) => todo.id !== id))
  }

  return (
    <div className="todo-list-container">
      <div className="todo-list-header-container">
        <h2 className="list-title">{mode === "active" ? "未完了のTodo" : "完了したTodo"}</h2>
        <button onClick={() => setMode(mode === "active" ? "completed" : "active")} className="toggle-button">
          {mode === "active" ? "完了したTodoを表示" : "未完了のTodoを表示"}
        </button>
      </div>
      {filterAndSort().length === 0 ? (
        <p className="empty-message">
          {mode === "active" ? "Todoがありません。新しいTodoを追加してください。" : "完了したTodoはありません。"}
        </p>
      ) : (
        <ul className="todo-list">
          {filterAndSort().map((todo) => (
            <li key={todo.id} className={`todo-item priority-${props.value}`}>
              <div className="todo-wrapper">
                <span className="todo-text">
                  [{["低", "中", "高"][todo.value]}] {todo.item}
                </span>
                <span className="due-date-label"> {transform(new Date(todo.date))}</span>
              </div>
              <div className="todo-actions">
                <button onClick={() => change(todo.id, { check: !todo.check })} className="complete-button">
                  {todo.check ? "再開" : "完了"}
                </button>
                <button onClick={() => del(todo.id)} className="delete-button">
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
