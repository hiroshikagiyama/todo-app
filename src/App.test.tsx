import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import TodoApp from "./App.tsx"

describe("TodoAppのテスト", () => {
  beforeEach(() => {
    vi.setSystemTime(new Date(2025, 5, 1))
    render(<TodoApp />)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("ラベルと入力欄が正しく表示される", () => {
    expect(screen.getByRole("textbox", { name: "タスク" })).toBeInTheDocument()
    expect(screen.getByRole("combobox", { name: "優先度" })).toBeInTheDocument()
    expect(screen.getByLabelText("期限")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "登録" })).toBeInTheDocument()
  })

  it("見出しと未完了のTodoリストが存在する", async () => {
    expect(screen.getByRole("heading", { name: "タスク管理アプリ", level: 1 })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: /未完了のTodo$/, level: 2 })).toBeInTheDocument()
    expect(screen.getByRole("list")).toBeInTheDocument()
    expect(screen.getAllByRole("listitem").length).toBe(3)
  })

  it("検索入力と切り替えボタンが存在する", () => {
    expect(screen.getByRole("textbox", { name: "検索" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /Todoを表示$/ })).toBeInTheDocument()
  })

  it("完了済みTodoが切替で表示される", async () => {
    await userEvent.click(screen.getByRole("button", { name: "完了したTodoを表示" }))

    expect(await screen.findByText("[低] todo3")).toBeInTheDocument()
  })

  it("タスク入力欄、優先度のドロップダウン、期限のドロップダウンに入力していない時、初期値が入っている", () => {
    expect(screen.getByRole("textbox", { name: "タスク" })).toHaveTextContent("")
    expect(screen.getByRole("combobox", { name: "優先度" })).toHaveTextContent("中")
    expect(screen.getByLabelText("期限")).toHaveValue("2025-06-01")
  })

  it("タスクを入力後、登録ボタンをクリックすると、未完了のタスクとして見える", async () => {
    vi.setSystemTime(new Date(2025, 5, 1))

    const input = screen.getByRole("textbox", { name: "タスク" })
    const prioritySelect = screen.getByRole("combobox", { name: "優先度" })
    const dueDateInput = screen.getByLabelText("期限")
    const addButton = screen.getByRole("button", { name: "登録" })
    await userEvent.type(input, "新規タスク")
    await userEvent.selectOptions(prioritySelect, "2")
    await userEvent.clear(dueDateInput)
    await userEvent.type(dueDateInput, "2025-06-30")
    await userEvent.click(addButton)

    expect(screen.getByText("[高] 新規タスク")).toBeInTheDocument()
    expect(screen.getByText(/🟢2025-06-30/)).toBeInTheDocument()
  })

  it("タスク追加後に入力フィールドがリセットされる", async () => {
    vi.setSystemTime(new Date(2025, 5, 1))

    const taskInput = screen.getByRole("textbox", { name: "タスク" }) as HTMLInputElement
    const dueInput = screen.getByLabelText("期限") as HTMLInputElement
    await userEvent.type(taskInput, "新規タスク")
    await userEvent.selectOptions(screen.getByRole("combobox", { name: "優先度" }), "1")
    await userEvent.click(screen.getByRole("button", { name: "登録" }))

    expect(taskInput.value).toBe("")
    expect(dueInput.value).toBe("2025-06-01")
  })

  it("登録ボタンは、初期状態で無効になっている", () => {
    expect(screen.getByRole("button", { name: "登録" })).toBeDisabled()
  })

  it("空文字タスクは登録されない", async () => {
    await userEvent.type(screen.getByRole("textbox", { name: "タスク" }), "    ")

    expect(screen.getByRole("button", { name: "登録" })).toBeDisabled()
  })

  it("formatDueDateLabel で期限に対応した「 今日、明日、期限切れ、または日付」を表示する", async () => {
    vi.setSystemTime(new Date(2025, 4, 20))

    for (const btn of screen.getAllByRole("button", { name: "削除" })) {
      await userEvent.click(btn)
    }

    const input = screen.getByRole("textbox", { name: "タスク" })
    const dueDateInput = screen.getByLabelText("期限")
    const addButton = screen.getByRole("button", { name: "登録" })
    await userEvent.type(input, "今日のタスク")
    await userEvent.clear(dueDateInput)
    await userEvent.type(dueDateInput, "2025-05-20")
    await userEvent.click(addButton)
    await userEvent.type(input, "明日のタスク")
    await userEvent.clear(dueDateInput)
    await userEvent.type(dueDateInput, "2025-05-21")
    await userEvent.click(addButton)
    await userEvent.type(input, "期限切れタスク")
    await userEvent.clear(dueDateInput)
    await userEvent.type(dueDateInput, "2025-04-30")
    await userEvent.click(addButton)
    await userEvent.type(input, "来月のタスク")
    await userEvent.clear(dueDateInput)
    await userEvent.type(dueDateInput, "2025-06-30")
    await userEvent.click(addButton)
    const addedTodoItems = within(screen.getByRole("list")).getAllByRole("listitem")

    expect(addedTodoItems[0]).toHaveTextContent(/🟠今日/)
    expect(addedTodoItems[1]).toHaveTextContent(/🟡明日/)
    expect(addedTodoItems[2]).toHaveTextContent(/❌期限切れ/)
    expect(addedTodoItems[3]).toHaveTextContent(/🟢2025-06-30/)
  })

  it("検索で入力した文字に含まれたタスクをフィルターされる", async () => {
    await userEvent.type(screen.getByRole("textbox", { name: "検索" }), "todo1")
    const todoList = screen.getByRole("list")

    expect(await within(todoList).findByText("[中] todo1")).toBeInTheDocument()
    expect(screen.queryByText("[高] todo2")).not.toBeInTheDocument()
    expect(screen.queryByText("[低] todo4")).not.toBeInTheDocument()
  })

  it("タスクを完了できる", async () => {
    const beforeListItemCount = screen.getAllByRole("listitem").length
    const completeButtons = screen.getAllByRole("button", { name: "完了" })
    await userEvent.click(completeButtons[0])
    const afterListItemCount = screen.getAllByRole("listitem").length

    expect(afterListItemCount).toBe(beforeListItemCount - 1)
  })

  it("タスクを完了すると、完了済みのタスクで見れる", async () => {
    const completeButtons = screen.getAllByRole("button", { name: "完了" })
    await userEvent.click(completeButtons[0])
    await userEvent.click(screen.getByRole("button", { name: "完了したTodoを表示" }))

    expect(screen.getByText(/todo2/)).toBeInTheDocument()
  })

  it("タスクを再開できる", async () => {
    await userEvent.click(screen.getByRole("button", { name: "完了したTodoを表示" }))
    const restartButton = screen.getByRole("button", { name: "再開" })
    await userEvent.click(restartButton)

    expect(screen.queryByRole("button", { name: "再開" })).not.toBeInTheDocument()
  })

  it("タスクを再開すると、未完了のタスクで見れる", async () => {
    await userEvent.click(screen.getByRole("button", { name: "完了したTodoを表示" }))
    const restartButton = screen.getByRole("button", { name: "再開" })
    await userEvent.click(restartButton)
    await userEvent.click(screen.getByRole("button", { name: "未完了のTodoを表示" }))

    expect(screen.getByText(/todo3/)).toBeInTheDocument()
  })

  it("タスクを削除できる", async () => {
    const beforeListItemCount = screen.getAllByRole("listitem").length
    await userEvent.click(screen.getAllByRole("button", { name: "削除" })[0])
    const afterListItemCount = screen.getAllByRole("listitem").length

    expect(afterListItemCount).toBe(beforeListItemCount - 1)
  })

  it("未完了が0件のときメッセージ表示", async () => {
    for (const btn of screen.getAllByRole("button", { name: "完了" })) {
      await userEvent.click(btn)
    }

    expect(screen.getByText("Todoがありません。新しいTodoを追加してください。")).toBeInTheDocument()
  })
})
