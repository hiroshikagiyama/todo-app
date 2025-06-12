import { useState } from "react"
import "../App.scss"
import type { Priority, Todo } from "./types.ts"
import { initialTodos } from "./initialTodos.ts"
import { Field1 } from "./components/Field1.tsx"
import { Field2 } from "./components/Field2.tsx"
import { Field3 } from "./components/Field3.tsx"

export default function TodoApp() {
  const [items, setItems] = useState<Todo[]>(initialTodos)
  const [value, setValue] = useState<Priority>(1)
  const [search, setSearch] = useState("")

  return (
    <div className="todo-app-wrapper" style={{ height: "fit-content", borderRadius: "3%" }}>
      <div className="todo-app">
        <h1>タスク管理アプリ</h1>
        <Field1 value={value} setValue={setValue} setItems={setItems} />
        <Field2 search={search} setSearch={setSearch} />
        <Field3 items={items} setItems={setItems} search={search} value={value} />
      </div>
    </div>
  )
}
