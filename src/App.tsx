import { useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { format, isToday, isTomorrow } from "date-fns"
import "./App.scss"
import type { DisplayMode, Todo, Priority } from "./types.ts"
import { initialTodos } from "./initialTodos.ts"

export default function TodoApp() {
  const todayDate = format(new Date(), "yyyy-MM-dd")
  const PRIORITY_LABELS = ["低", "中", "高"] as const

  const [todos, setTodos] = useState<Todo[]>(initialTodos)
  const [newTodoText, setNewTodoText] = useState("")
  const [priority, setPriority] = useState<Priority>(1)
  const [displayMode, setDisplayMode] = useState<DisplayMode>("active")
  const [searchText, setSearchText] = useState("")
  const [dueDate, setDueDate] = useState(todayDate)

  const addTodo = () => {
    if (!newTodoText.trim()) return
    const newTodo: Todo = {
      id: uuidv4(),
      todoText: newTodoText,
      completed: false,
      priority,
      dueDateMs: new Date(dueDate).getTime(),
    }
    setTodos((prevTodos) => [...prevTodos, newTodo])
    resetInputFields()
  }

  const updateTodo = (id: string, updates: Partial<Todo>) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, ...updates } : todo)))
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const compareTodoByPriorityAndText = (a: Todo, b: Todo) => {
    const priorityDiff = b.priority - a.priority
    return priorityDiff !== 0 ? priorityDiff : a.todoText.localeCompare(b.todoText)
  }

  const getFilteredTodos = (): Todo[] => {
    return todos
      .filter((todo) => (displayMode === "active" ? !todo.completed : todo.completed))
      .filter((todo) => todo.todoText.toLowerCase().includes(searchText.toLowerCase()))
      .sort(compareTodoByPriorityAndText)
  }

  const resetInputFields = () => {
    setNewTodoText("")
    setPriority(1)
    setDueDate(todayDate)
  }

  const formatDueDateLabel = (date: Date) => {
    if (isToday(date)) return "🟠今日"
    if (isTomorrow(date)) return "🟡明日"
    if (date < new Date()) return "❌期限切れ"
    return `🟢${format(date, "yyyy-MM-dd")}`
  }

  const isAddDisabled = !newTodoText.trim() || !dueDate

  return (
    <div className="todo-app">
      <h1>タスク管理アプリ</h1>
      <div className="todo-input-area">
        <label>
          タスク
          <input
            type="text"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            placeholder="新しいTodoを入力..."
            className="todo-input"
          />
        </label>
        <label>
          優先度
          <select
            value={priority}
            onChange={(e) => setPriority(Number(e.target.value) as Priority)}
            className="priority-select"
          >
            <option value="2">高</option>
            <option value="1">中</option>
            <option value="0">低</option>
          </select>
        </label>
        <label>
          期限
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="due-date-input" />
        </label>
        <button onClick={addTodo} className="add-button" disabled={isAddDisabled}>
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
        {getFilteredTodos().length === 0 ? (
          <p className="empty-message">
            {displayMode === "active"
              ? "Todoがありません。新しいTodoを追加してください。"
              : "完了したTodoはありません。"}
          </p>
        ) : (
          <ul className="todo-list">
            {getFilteredTodos().map((todo) => (
              <li key={todo.id} className={`todo-item priority-${priority}`}>
                <span className="todo-text">
                  [{PRIORITY_LABELS[todo.priority]}] {todo.todoText}
                  <span className="due-date-label"> - {formatDueDateLabel(new Date(todo.dueDateMs))}</span>
                </span>
                <div className="todo-actions">
                  <button
                    onClick={() => updateTodo(todo.id, { completed: !todo.completed })}
                    className="complete-button"
                  >
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
    </div>
  )
}
