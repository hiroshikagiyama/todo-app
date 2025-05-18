import { useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { format, isToday, isTomorrow } from "date-fns"
import "./App.scss"
import type { DisplayMode, Priority, PriorityInfo, Todo } from "./types.ts"
import { initial } from "./initial.ts"

export default function TodoApp() {
  const priorityInfo: Record<Priority, PriorityInfo> = {
    high: { order: 0, label: "高" },
    medium: { order: 1, label: "中" },
    low: { order: 2, label: "低" },
  }

  const [items, setItems] = useState<Todo[]>(initial)
  const [text, setText] = useState<string>("")
  const [priority, setPriority] = useState<Priority>("medium")
  const [limit, setLimit] = useState<string>(format(new Date(), "yyyy-MM-dd"))
  const [mode, setMode] = useState<DisplayMode>("active")
  const [flagId, setFlagId] = useState<string | null>(null)
  const [change, setChange] = useState<string>("")
  const [search, setSearch] = useState<string>("")

  const addTodoItemAndResetInputFields = () => {
    if (!text.trim()) return
    const newTodo: Todo = {
      id: uuidv4(),
      title: text,
      status: false,
      priority,
      date: new Date(limit).getTime(),
    }
    setItems([...items, newTodo])
    setText("")
    setPriority("medium")
    setLimit(format(new Date(), "yyyy-MM-dd"))
  }

  const getPriorityInformationObjectBasedOnPriority = (priority: Priority): PriorityInfo => {
    return priorityInfo[priority]
  }

  const generateDeadlineDisplayTextBasedOnProvidedDate = (date: Date) => {
    if (isToday(date)) return "🟠今日"
    if (isTomorrow(date)) return "🟡明日"
    if (date < new Date()) return "❌期限切れ"
    return `🟢${format(date, "yyyy-MM-dd")}`
  }

  const filteredTodos = items
    .filter((todo) => (mode === "active" ? !todo.status : todo.status))
    .map((todo) => {
      todo.title = todo.title.toLowerCase()
      return todo
    })
    .filter((todo) => todo.title.includes(search.toLowerCase()))
    .sort((a, b) => {
      const orderA = getPriorityInformationObjectBasedOnPriority(a.priority).order
      const orderB = getPriorityInformationObjectBasedOnPriority(b.priority).order
      const result = orderA - orderB
      return result !== 0 ? result : a.title.localeCompare(b.title)
    })

  return (
    <div className="todo-app">
      <h1>タスク管理アプリ</h1>
      <div className="todo-input-area">
        <label>
          タスク
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addTodoItemAndResetInputFields()
              }
            }}
            placeholder="新しいTodoを入力..."
            className="todo-input"
          />
        </label>
        <label>
          優先度
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className="priority-select"
          >
            <option value="high">高</option>
            <option value="medium">中</option>
            <option value="low">低</option>
          </select>
        </label>
        <label>
          期限
          <input
            type="date"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            className="due-date-input"
          />
        </label>
        <button
          onClick={addTodoItemAndResetInputFields}
          className="add-button"
          disabled={!text.trim()}
        >
          登録
        </button>
      </div>

      <div className="todo-search-area">
        <label>
          検索
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Todoを検索..."
            className="search-input"
          />
        </label>
        <div className="toggle-button-wrapper">
          <button
            onClick={() => setMode(mode === "active" ? "completed" : "active")}
            className="toggle-button"
          >
            {mode === "active" ? "完了したTodoを表示" : "未完了のTodoを表示"}
          </button>
        </div>
      </div>

      <div className="todo-list-container">
        <h2 className="list-title">{mode === "active" ? "未完了のTodo" : "完了したTodo"}</h2>
        {filteredTodos.length === 0 ? (
          <p className="empty-message">
            {mode === "active"
              ? "Todoがありません。新しいTodoを追加してください。"
              : "完了したTodoはありません。"}
          </p>
        ) : (
          <ul className="todo-list">
            {filteredTodos.map(({ id, title, status, priority, date }) => (
              <li key={id} className={`todo-item priority-${priority}`}>
                {flagId === id ? (
                  <input
                    value={change}
                    onChange={(e) => setChange(e.target.value)}
                    onBlur={() => {
                      const editedItemIndex = items.findIndex((item) => item.id === id)
                      const newItems = items.map((item, index) => {
                        if (index === editedItemIndex) {
                          item.title = change
                        }
                        return item
                      })
                      setItems(newItems)
                      setFlagId(null)
                      setChange("")
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const editedItemIndex = items.findIndex((item) => item.id === id)
                        const newItems = items.map((item, index) => {
                          if (index === editedItemIndex) {
                            item.title = change
                          }
                          return item
                        })
                        setItems(newItems)
                        setFlagId(null)
                        setChange("")
                      }
                    }}
                    autoFocus
                  />
                ) : (
                  <span className="todo-text">
                    [{getPriorityInformationObjectBasedOnPriority(priority).label}] {title}
                    <span className="due-date-label">
                      {" "}
                      - {generateDeadlineDisplayTextBasedOnProvidedDate(new Date(date))}
                    </span>
                  </span>
                )}
                <div className="todo-actions">
                  {!status && flagId !== id && (
                    <button
                      onClick={() => {
                        setFlagId(id)
                        setChange(text)
                      }}
                      className="edit-button"
                    >
                      編集
                    </button>
                  )}
                  {!status && (
                    <button
                      onClick={() => {
                        const editedItemIndex = items.findIndex((item) => item.id === id)
                        const newItems = items.map((item, index) => {
                          if (index === editedItemIndex) {
                            item.status = true
                          }
                          return item
                        })
                        setItems(newItems)
                        setFlagId(null)
                        setChange("")
                      }}
                      className="complete-button"
                    >
                      完了
                    </button>
                  )}
                  {status && (
                    <button
                      onClick={() => {
                        const editedItemIndex = items.findIndex((item) => item.id === id)
                        const newItems = items.map((item, index) => {
                          if (index === editedItemIndex) {
                            item.status = false
                          }
                          return item
                        })
                        setItems(newItems)
                        setFlagId(null)
                        setChange("")
                      }}
                      className="complete-button"
                    >
                      再開
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setItems(items.filter((todo) => todo.id !== id))
                    }}
                    className="delete-button"
                  >
                    削除
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
