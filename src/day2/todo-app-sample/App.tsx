import { useState } from "react"
import "../../App.scss"
import type { Priority, Todo } from "./types.ts"
import { initialTodos } from "./initialTodos.ts"
import { TodoInput } from "./components/TodoInput.tsx"
import { TodoSearch } from "./components/TodoSearch.tsx"
import { TodoList } from "./components/TodoList.tsx"

export default function App() {
  const [todos, setTodos] = useState<Todo[]>(initialTodos)
  const [priority, setPriority] = useState<Priority>(1)
  const [searchText, setSearchText] = useState("")

  return (
    <div className="todo-app-wrapper">
      <div className="todo-app">
        <h1>タスク管理アプリ</h1>
        <TodoInput priority={priority} setPriority={setPriority} setTodos={setTodos} />
        <TodoSearch searchText={searchText} setSearchText={setSearchText} />
        <TodoList todos={todos} setTodos={setTodos} searchText={searchText} priority={priority} />
      </div>
    </div>
  )
}
