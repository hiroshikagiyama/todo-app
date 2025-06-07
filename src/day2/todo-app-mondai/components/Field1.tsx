import type { Priority, Todo } from "../types.ts"
import { v4 as uuidv4 } from "uuid"
import { type Dispatch, useState } from "react"
import { format } from "date-fns"
import * as React from "react"

type Field1Props = {
  value: Priority
  setValue: Dispatch<React.SetStateAction<Priority>>
  setItems: Dispatch<React.SetStateAction<Todo[]>>
}

export const Field1 = (props: Field1Props) => {
  const [newItem, setNewItem] = useState("")
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"))

  const add = () => {
    const data: Todo = {
      id: uuidv4(),
      item: newItem.trim(),
      check: false,
      value: props.value,
      date: new Date(date).getTime(),
    }
    props.setItems((prevItems) => [...prevItems, data])
    reset()
  }

  const reset = () => {
    setNewItem("")
    props.setValue(1)
    setDate(format(new Date(), "yyyy-MM-dd"))
  }

  return (
    <div className="todo-input-area">
      <label>
        タスク
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="新しいTodoを入力..."
          className="todo-input"
        />
      </label>
      <label>
        優先度
        <select
          value={props.value}
          onChange={(e) => props.setValue(Number(e.target.value) as Priority)}
          className="priority-select"
        >
          <option value="2">高</option>
          <option value="1">中</option>
          <option value="0">低</option>
        </select>
      </label>
      <label>
        期限
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="due-date-input" />
      </label>
      <button onClick={add} className="add-button" disabled={!newItem.trim()}>
        登録
      </button>
    </div>
  )
}
