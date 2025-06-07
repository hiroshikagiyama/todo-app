import { type Dispatch } from "react"
import * as React from "react"

type Field2Props = {
  search: string
  setSearch: Dispatch<React.SetStateAction<string>>
}

export const Field2 = (props: Field2Props) => {
  return (
    <div className="todo-search-area">
      <label>
        検索
        <input
          type="text"
          value={props.search}
          onChange={(e) => props.setSearch(e.target.value)}
          placeholder="Todoを検索..."
          className="search-input"
        />
      </label>
    </div>
  )
}
