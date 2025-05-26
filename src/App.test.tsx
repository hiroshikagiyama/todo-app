import { render, screen } from "@testing-library/react"
import TodoApp from "./App.tsx"

describe("TodoApp", () => {
  it("renders initial state correctly", () => {
    render(<TodoApp />)
    expect(screen.getByText("タスク管理アプリ")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "登録" })).toBeDisabled()
    expect(screen.getByLabelText("タスク")).toBeInTheDocument()
    expect(screen.getByLabelText("優先度")).toBeInTheDocument()
    expect(screen.getByLabelText("期限")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Todoを検索...")).toBeInTheDocument()
    expect(screen.getByText("未完了のTodo")).toBeInTheDocument()
  })
})
