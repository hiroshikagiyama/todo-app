import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import App from "./App.tsx"

describe("TodoAppのテスト", () => {
  beforeEach(() => {
    vi.setSystemTime(new Date(2025, 5, 1))
    render(<App />)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("アプリの見出しが表示される", async () => {
    expect(screen.getByRole("heading", { name: "タスク管理アプリ", level: 1 })).toBeInTheDocument()
  })

  it("タスクの入力欄とラベルとプレースホルダーが表示される", () => {
    const taskInput = screen.getByRole("textbox", { name: "タスク" })
    expect(taskInput).toBeInTheDocument()
    expect(taskInput).toHaveAttribute("placeholder", "新しいTodoを入力...")
  })

  it("優先度のプルダウンとラベルが表示される", () => {
    expect(screen.getByRole("combobox", { name: "優先度" })).toBeInTheDocument()
  })

  it("期限の日付選択とラベルが表示される", () => {
    const dueDateInput = screen.getByLabelText("期限")
    expect(dueDateInput).toBeInTheDocument()
    expect((dueDateInput as HTMLInputElement).type).toBe("date")
  })

  it("登録ボタンが表示される", () => {
    expect(screen.getByRole("button", { name: "登録" })).toBeInTheDocument()
  })

  it("検索の入力欄とラベルとプレースホルダーが表示される", () => {
    const searchInput = screen.getByRole("textbox", { name: "検索" })
    expect(searchInput).toBeInTheDocument()
    expect(searchInput).toHaveAttribute("placeholder", "Todoを検索...")
  })

  it("Todoリスト表示切替ボタンが表示される", () => {
    expect(screen.getByRole("button", { name: "完了したTodoを表示" })).toBeInTheDocument()
  })

  it("「未完了のTodo」の文字が表示される", async () => {
    expect(screen.getByRole("heading", { name: "未完了のTodo", level: 2 })).toBeInTheDocument()
  })

  it("未完了のTodoが３つ表示される", async () => {
    expect(screen.getByRole("list")).toBeInTheDocument()
    expect(screen.getAllByRole("listitem").length).toBe(3)
  })

  it("完了済みTodoが切替で表示される", async () => {
    await userEvent.click(screen.getByRole("button", { name: "完了したTodoを表示" }))

    expect(await screen.findByText("[低] todo3")).toBeInTheDocument()
  })

  it("タスクの入力欄に文字を入力すると、入力した文字が反映される", async () => {
    const taskInput = screen.getByRole("textbox", { name: "タスク" })
    await userEvent.type(taskInput, "テストタスク")

    expect(taskInput).toHaveValue("テストタスク")
  })

  it("優先度のプルダウン選択肢に「高」「中」「低」が表示される", async () => {
    const prioritySelect = screen.getByRole("combobox", { name: "優先度" })
    await userEvent.click(prioritySelect)

    expect(within(prioritySelect).getByText("高")).toBeInTheDocument()
    expect(within(prioritySelect).getByText("中")).toBeInTheDocument()
    expect(within(prioritySelect).getByText("低")).toBeInTheDocument()
  })

  it("優先度のプルダウン選択肢は、初期値のvalueが 1 を持ち、「高」「中」「低」を選択すると、対応するvalueを持つ", async () => {
    const prioritySelect = screen.getByRole("combobox", { name: "優先度" })

    expect(prioritySelect).toHaveValue("1")

    await userEvent.selectOptions(prioritySelect, "2")
    expect(prioritySelect).toHaveValue("2")

    await userEvent.selectOptions(prioritySelect, "1")
    expect(prioritySelect).toHaveValue("1")

    await userEvent.selectOptions(prioritySelect, "0")
    expect(prioritySelect).toHaveValue("0")
  })

  it("期限の日付欄には、初期値で今日の日付が表示され、選択をすると、選択した日付が表示される", async () => {
    const dueDateInput = screen.getByLabelText("期限")
    expect(dueDateInput).toHaveValue("2025-06-01")

    await userEvent.clear(dueDateInput)

    expect(dueDateInput).not.toHaveValue("2025-06-20")

    await userEvent.type(dueDateInput, "2025-06-20")
    expect(screen.getByLabelText("期限")).toHaveValue("2025-06-20")
  })

  it("タスクの入力欄が１文字も入力されていなければ、登録ボタンは、無効になる", async () => {
    const taskInput = screen.getByRole("textbox", { name: "タスク" })
    await userEvent.clear(taskInput)
    expect(screen.getByRole("button", { name: "登録" })).toBeDisabled()
  })

  it("タスクの入力欄が１文字以上入力されていれば、登録ボタンは、有効になる", async () => {
    const taskInput = screen.getByRole("textbox", { name: "タスク" })
    await userEvent.type(taskInput, "テストタスク")
    expect(screen.getByRole("button", { name: "登録" })).toBeEnabled()
  })

  it.skip("タスクの入力欄に入力された文字の先頭と末尾に、全角・半角スペースがあれば除去する", async () => {
    const taskInput = screen.getByRole("textbox", { name: "タスク" })

    await userEvent.type(taskInput, "　テスト　タスク　")
    expect(taskInput).toHaveValue("テスト　タスク")

    await userEvent.type(taskInput, " テスト タスク ")
    expect(taskInput).toHaveValue("テスト タスク")
  })

  it("検索の入力欄に文字を入力すると、入力した文字が反映される", async () => {
    const searchInput = screen.getByRole("textbox", { name: "検索" })
    await userEvent.type(searchInput, "search")

    expect(searchInput).toHaveValue("search")
  })

  it("タスクを入力後、登録ボタンをクリックすると、未完了のタスクとして見える", async () => {
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
    const taskInput = screen.getByRole("textbox", { name: "タスク" }) as HTMLInputElement
    const dueInput = screen.getByLabelText("期限") as HTMLInputElement
    await userEvent.type(taskInput, "新規タスク")
    await userEvent.selectOptions(screen.getByRole("combobox", { name: "優先度" }), "1")
    await userEvent.click(screen.getByRole("button", { name: "登録" }))

    expect(taskInput.value).toBe("")
    expect(dueInput.value).toBe("2025-06-01")
  })

  it("formatDueDateLabel で期限に対応した「 今日、明日、期限切れ、または日付」を表示する", async () => {
    for (const btn of screen.getAllByRole("button", { name: "削除" })) {
      await userEvent.click(btn)
    }

    const input = screen.getByRole("textbox", { name: "タスク" })
    const dueDateInput = screen.getByLabelText("期限")
    const addButton = screen.getByRole("button", { name: "登録" })
    await userEvent.type(input, "今日のタスク")
    await userEvent.clear(dueDateInput)
    await userEvent.type(dueDateInput, "2025-06-01")
    await userEvent.click(addButton)
    await userEvent.type(input, "明日のタスク")
    await userEvent.clear(dueDateInput)
    await userEvent.type(dueDateInput, "2025-06-02")
    await userEvent.click(addButton)
    await userEvent.type(input, "期限切れタスク")
    await userEvent.clear(dueDateInput)
    await userEvent.type(dueDateInput, "2025-05-30")
    await userEvent.click(addButton)
    await userEvent.type(input, "来月のタスク")
    await userEvent.clear(dueDateInput)
    await userEvent.type(dueDateInput, "2025-07-01")
    await userEvent.click(addButton)
    const addedTodoItems = within(screen.getByRole("list")).getAllByRole("listitem")

    expect(addedTodoItems[0]).toHaveTextContent(/🟠今日/)
    expect(addedTodoItems[1]).toHaveTextContent(/🟡明日/)
    expect(addedTodoItems[2]).toHaveTextContent(/❌期限切れ/)
    expect(addedTodoItems[3]).toHaveTextContent(/🟢2025-07-01/)
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
