import type { Priority, Todo } from "../types.ts"
import { v4 as uuidv4 } from "uuid"
import { type Dispatch, useState } from "react"
import { format } from "date-fns"
import * as React from "react"

type TodoInputProps = {
  priority: Priority
  setPriority: Dispatch<React.SetStateAction<Priority>>
  setTodos: Dispatch<React.SetStateAction<Todo[]>>
}

export const TodoInput = (props: TodoInputProps) => {
  const todayDate = format(new Date(), "yyyy-MM-dd")

  const [newTodoText, setNewTodoText] = useState("")
  const [dueDate, setDueDate] = useState(todayDate)

  const addTodo = () => {
    const trimmedNewTodoText = newTodoText.trim()
    if (!trimmedNewTodoText) return
    const newTodo: Todo = {
      id: uuidv4(),
      todoText: trimmedNewTodoText,
      completed: false,
      priority: props.priority,
      dueDateMs: new Date(dueDate).getTime(),
    }
    props.setTodos((prevTodos) => [...prevTodos, newTodo])
    resetInputFields()
  }

  const resetInputFields = () => {
    setNewTodoText("")
    props.setPriority(1)
    setDueDate(todayDate)
  }

  return (
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
          value={props.priority}
          onChange={(e) => props.setPriority(Number(e.target.value) as Priority)}
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
      <button onClick={addTodo} className="add-button" disabled={!newTodoText.trim()}>
        登録
      </button>
    </div>
  )
}
