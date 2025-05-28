import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import TodoApp from "./App.tsx"

vi.mock("../initialTodos.ts", () => ({
  initialTodos: [
    {
      id: "1",
      todoText: "初期タスクZ",
      completed: false,
      priority: 0,
      dueDateMs: new Date("2025-01-01T00:00:00Z").getTime(),
    },
    {
      id: "2",
      todoText: "初期タスクA",
      completed: false,
      priority: 2,
      dueDateMs: new Date("2025-01-02T00:00:00Z").getTime(),
    },
    {
      id: "3",
      todoText: "初期タスクB",
      completed: true,
      priority: 1,
      dueDateMs: new Date("2024-12-31T00:00:00Z").getTime(),
    },
  ],
}))

describe("TodoApp – カバレッジ100% + 表示要素検証", () => {
  beforeEach(() => {
    render(<TodoApp />)
  })

  afterEach(() => {})

  it("ラベルと入力欄が正しく表示される", () => {
    expect(screen.getByRole("textbox", { name: "タスク" })).toBeInTheDocument()
    expect(screen.getByRole("combobox", { name: "優先度" })).toBeInTheDocument()
    expect(screen.getByLabelText("期限")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "登録" })).toBeInTheDocument()
  })

  it("見出しとリスト構造が存在する", async () => {
    expect(screen.getByRole("heading", { name: "タスク管理アプリ", level: 1 })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: /Todo$/, level: 2 })).toBeInTheDocument()
    expect(screen.getByRole("list")).toBeInTheDocument()

    const listItems = screen.getAllByRole("listitem")
    const visibleItems = listItems.filter((item) => item.offsetParent !== null)
    expect(visibleItems.length).toBe(2)
  })

  it("検索入力と切り替えボタンが存在する", () => {
    expect(screen.getByRole("textbox", { name: "検索" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /Todoを表示$/ })).toBeInTheDocument()
  })

  it("完了済みTodoが切替で表示される", async () => {
    await userEvent.click(screen.getByRole("button", { name: "完了したTodoを表示" }))
    expect(await screen.findByText("[中] 初期タスクB")).toBeInTheDocument()
  })

  it("検索でフィルターされる", async () => {
    await userEvent.type(screen.getByRole("textbox", { name: "検索" }), "Z")
    expect(await screen.findByText("初期タスクZ")).toBeInTheDocument()
    expect(screen.queryByText("初期タスクA")).not.toBeInTheDocument()
  })

  it("formatDueDateLabel: 今日、明日、期限切れ、未来", async () => {
    await waitFor(() => {
      expect(screen.getByText((_, el) => el?.textContent?.includes("🟠今日") ?? false)).toBeInTheDocument()
      expect(screen.getByText((_, el) => el?.textContent?.includes("🟡明日") ?? false)).toBeInTheDocument()
    })

    await userEvent.click(screen.getByRole("button", { name: "完了したTodoを表示" }))
    expect(await screen.findByText((_, el) => el?.textContent?.includes("❌期限切れ") ?? false)).toBeInTheDocument()

    await userEvent.click(screen.getByRole("button", { name: "未完了のTodoを表示" }))
    await userEvent.type(screen.getByRole("textbox", { name: "タスク" }), "未来タスク")
    await userEvent.clear(screen.getByLabelText("期限"))
    await userEvent.type(screen.getByLabelText("期限"), "2025-02-01")
    await userEvent.click(screen.getByRole("button", { name: "登録" }))
    expect(await screen.findByText((_, el) => el?.textContent?.includes("🟢2025-02-01") ?? false)).toBeInTheDocument()
  })

  it("タスク追加後に入力フィールドがリセットされる", async () => {
    const taskInput = screen.getByRole("textbox", { name: "タスク" }) as HTMLInputElement
    const dueInput = screen.getByLabelText("期限") as HTMLInputElement
    await userEvent.type(taskInput, "新規タスク")
    await userEvent.selectOptions(screen.getByRole("combobox", { name: "優先度" }), "1")
    await userEvent.click(screen.getByRole("button", { name: "登録" }))
    expect(taskInput.value).toBe("")
    expect(dueInput.value).toBe("2025-01-01")
  })

  it("空文字タスクは登録されない", async () => {
    await userEvent.type(screen.getByRole("textbox", { name: "タスク" }), "    ")
    expect(screen.getByRole("button", { name: "登録" })).toBeDisabled()
  })

  it("タスクを完了・再開できる", async () => {
    const completeButtons = screen.getAllByRole("button", { name: "完了" })
    await userEvent.click(completeButtons[0])
    await userEvent.click(screen.getByRole("button", { name: "再開" }))
    expect(screen.getByRole("button", { name: "完了" })).toBeInTheDocument()
  })

  it("タスクを削除できる", async () => {
    const before = screen.getAllByRole("listitem").length
    await userEvent.click(screen.getAllByRole("button", { name: "削除" })[0])
    const after = screen.getAllByRole("listitem").length
    expect(after).toBe(before - 1)
  })

  it("未完了が0件のときメッセージ表示", async () => {
    for (const btn of screen.getAllByRole("button", { name: "完了" })) {
      await userEvent.click(btn)
    }
    expect(screen.getByText("Todoがありません。新しいTodoを追加してください。")).toBeInTheDocument()
  })
})
