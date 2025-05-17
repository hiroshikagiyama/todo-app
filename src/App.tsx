import { useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { format, isToday, isTomorrow } from "date-fns"
import "./App.scss"
import type { DisplayMode, Priority, PriorityInfo, Todo } from "./types.ts"
import { initialTodos } from "./initialTodos.ts"

export default function TodoApp() {
  const todayDate = () => format(new Date(), "yyyy-MM-dd")

  const priorityInfo: Record<Priority, PriorityInfo> = {
    high: { order: 0, label: "高" },
    medium: { order: 1, label: "中" },
    low: { order: 2, label: "低" },
  }

  const [todos, setTodos] = useState<Todo[]>(initialTodos)
  const [inputText, setInputText] = useState("")
  const [priority, setPriority] = useState<Priority>("medium")
  const [dueDate, setDueDate] = useState(todayDate())
  const [displayMode, setDisplayMode] = useState<DisplayMode>("active")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingText, setEditingText] = useState("")
  const [searchText, setSearchText] = useState("")

  const handleAdd = () => {
    if (!inputText.trim() || !priority || !dueDate) return
    const newTodo: Todo = {
      id: uuidv4(),
      todoText: inputText,
      completed: false,
      priority,
      dueDateMs: new Date(dueDate).getTime(),
    }
    setTodos([...todos, newTodo])
    setInputText("")
    setPriority("medium")
    setDueDate(todayDate())
  }

  const updateTodo = (id: string, updates: Partial<Todo>) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, ...updates } : todo)))
  }

  const handleEditStart = (id: string, text: string) => {
    setEditingId(id)
    setEditingText(text)
  }

  const handleEditSave = (id: string) => {
    updateTodo(id, { todoText: editingText })
    setEditingId(null)
    setEditingText("")
  }

  const getPriorityInfo = (priority: Priority): PriorityInfo => {
    return priorityInfo[priority]
  }

  const getDueLabel = (date: Date) => {
    if (isToday(date)) return "🟠今日"
    if (isTomorrow(date)) return "🟡明日"
    if (date < new Date()) return "❌期限切れ"
    return `🟢${format(date, "yyyy-MM-dd")}`
  }

  const sortOrderAndTodoText = (a: Todo, b: Todo) => {
    const orderA = getPriorityInfo(a.priority).order
    const orderB = getPriorityInfo(b.priority).order
    const diff = orderA - orderB
    return diff !== 0 ? diff : a.todoText.localeCompare(b.todoText)
  }

  const filteredTodos = todos
    .filter((todo) => (displayMode === "active" ? !todo.completed : todo.completed))
    .filter((todo) => todo.todoText.toLowerCase().includes(searchText.toLowerCase()))
    .sort(sortOrderAndTodoText)

  const isAddDisabled = !inputText.trim() || !priority || !dueDate

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  return (
    <div className="todo-app">
      <h1>タスク管理アプリ</h1>
      <div className="todo-input-area">
        <label>
          タスク
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAdd()
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
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="due-date-input"
          />
        </label>
        <button onClick={handleAdd} className="add-button" disabled={isAddDisabled}>
          登録
        </button>
      </div>

      <div className="todo-search-area">
        <label>
          検索
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Todoを検索..."
            className="search-input"
          />
        </label>
        <div className="toggle-button-wrapper">
          <button
            onClick={() => setDisplayMode(displayMode === "active" ? "completed" : "active")}
            className="toggle-button"
          >
            {displayMode === "active" ? "完了したTodoを表示" : "未完了のTodoを表示"}
          </button>
        </div>
      </div>

      <div className="todo-list-container">
        <h2 className="list-title">{displayMode === "active" ? "未完了のTodo" : "完了したTodo"}</h2>
        {filteredTodos.length === 0 ? (
          <p className="empty-message">
            {displayMode === "active"
              ? "Todoがありません。新しいTodoを追加してください。"
              : "完了したTodoはありません。"}
          </p>
        ) : (
          <ul className="todo-list">
            {filteredTodos.map(({ id, todoText, completed, priority, dueDateMs }) => (
              <li key={id} className={`todo-item priority-${priority}`}>
                {editingId === id ? (
                  <input
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onBlur={() => handleEditSave(id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleEditSave(id)
                      }
                    }}
                    autoFocus
                  />
                ) : (
                  <span className="todo-text">
                    [{getPriorityInfo(priority).label}] {todoText}
                    <span className="due-date-label"> - {getDueLabel(new Date(dueDateMs))}</span>
                  </span>
                )}
                <div className="todo-actions">
                  {!completed && editingId !== id && (
                    <button onClick={() => handleEditStart(id, todoText)} className="edit-button">
                      編集
                    </button>
                  )}
                  {!completed && (
                    <button
                      onClick={() => updateTodo(id, { completed: true })}
                      className="complete-button"
                    >
                      完了
                    </button>
                  )}
                  {completed && (
                    <button
                      onClick={() => updateTodo(id, { completed: false })}
                      className="complete-button"
                    >
                      再開
                    </button>
                  )}
                  <button onClick={() => deleteTodo(id)} className="delete-button">
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
