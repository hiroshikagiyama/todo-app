import { type Dispatch } from "react"
import * as React from "react"

type TodoSearchProps = {
  searchText: string
  setSearchText: Dispatch<React.SetStateAction<string>>
}

export const TodoSearch = (props: TodoSearchProps) => {
  return (
    <div className="todo-search-area">
      <label>
        検索
        <input
          type="text"
          value={props.searchText}
          onChange={(e) => props.setSearchText(e.target.value)}
          placeholder="Todoを検索..."
          className="search-input"
        />
      </label>
    </div>
  )
}
