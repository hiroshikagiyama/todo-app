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

  describe("タスク入力フィールドのテスト", () => {
    describe("レンダリング時の要素の表示テスト", () => {
      it("アプリのタイトルが表示される", async () => {
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
    })

    describe("機能のテスト", () => {
      it("優先度のプルダウン選択肢に「高」「中」「低」が表示される", async () => {
        const prioritySelect = screen.getByRole("combobox", { name: "優先度" })
        await userEvent.click(prioritySelect)

        expect(within(prioritySelect).getByText("高")).toBeInTheDocument()
        expect(within(prioritySelect).getByText("中")).toBeInTheDocument()
        expect(within(prioritySelect).getByText("低")).toBeInTheDocument()
      })

      it("優先度のプルダウン選択肢の初期値は、value = '1' になっており、 '0','1','2' が選択できる", async () => {
        const prioritySelect = screen.getByRole("combobox", { name: "優先度" })

        expect(prioritySelect).toHaveValue("1")

        await userEvent.selectOptions(prioritySelect, "0")
        expect(prioritySelect).toHaveValue("0")

        await userEvent.selectOptions(prioritySelect, "1")
        expect(prioritySelect).toHaveValue("1")

        await userEvent.selectOptions(prioritySelect, "2")
        expect(prioritySelect).toHaveValue("2")
      })

      it("期限の日付欄には、初期値で今日の日付が表示され、日付を変更すると、変更した日付が表示される", async () => {
        const dueDateInput = screen.getByLabelText("期限")

        expect(dueDateInput).toHaveValue("2025-06-01")

        await userEvent.clear(dueDateInput)

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

      it("タスクの入力欄に全角・半角スーペースのみが入力されていれば、登録ボタンは、無効になる", async () => {
        const taskInput = screen.getByRole("textbox", { name: "タスク" })
        const addButton = screen.getByRole("button", { name: "登録" })

        await userEvent.clear(taskInput)
        await userEvent.type(taskInput, "　　　　")

        expect(addButton).toBeDisabled()

        await userEvent.clear(taskInput)
        await userEvent.type(taskInput, "     ")

        expect(addButton).toBeDisabled()
      })

      it("タスクを入力後、登録ボタンをクリックすると、登録できる", async () => {
        const taskInput = screen.getByRole("textbox", { name: "タスク" })
        const addButton = screen.getByRole("button", { name: "登録" })

        await userEvent.type(taskInput, "新規タスク")
        await userEvent.click(addButton)

        expect(screen.getByText("[中] 新規タスク")).toBeInTheDocument()
      })

      it("タスクの先頭・末尾に全角・半角スーペースがあると、スペースが除去されて、登録できる", async () => {
        const taskInput = screen.getByRole("textbox", { name: "タスク" })
        const addButton = screen.getByRole("button", { name: "登録" })

        await userEvent.type(taskInput, "　　新規 タスク  ")
        await userEvent.click(addButton)

        expect(screen.getByText("[中] 新規 タスク")).toBeInTheDocument()
      })

      it("タスク登録後に、タスク入力欄、優先度プルダウン、期限選択がリセットされる", async () => {
        const taskInput = screen.getByRole("textbox", { name: "タスク" }) as HTMLInputElement
        const prioritySelect = screen.getByRole("combobox", { name: "優先度" })
        const dueInput = screen.getByLabelText("期限") as HTMLInputElement

        await userEvent.type(taskInput, "新規タスク")
        await userEvent.selectOptions(prioritySelect, "0")
        await userEvent.click(screen.getByRole("button", { name: "登録" }))

        expect(taskInput.value).toBe("")
        expect(prioritySelect).toHaveValue("1")
        expect(dueInput.value).toBe("2025-06-01")
      })

      it("入力されたタスクの先頭と末尾に、全角・半角スペースがあれば除去して、登録される", async () => {
        const taskInput = screen.getByRole("textbox", { name: "タスク" })
        const addButton = screen.getByRole("button", { name: "登録" })

        await userEvent.type(taskInput, "　　テスト　タスク1　　")
        await userEvent.click(addButton)

        expect(screen.getByText("[中] テスト タスク1")).toBeInTheDocument()

        await userEvent.type(taskInput, "   テスト タスク2   ")
        await userEvent.click(addButton)

        expect(screen.getByText("[中] テスト タスク2")).toBeInTheDocument()
      })
    })
  })

  describe("検索フィールドのテスト", () => {
    describe("レンダリング時の要素の表示テスト", () => {
      it("検索の入力欄とラベルとプレースホルダーが表示される", () => {
        const searchInput = screen.getByRole("textbox", { name: "検索" })
        expect(searchInput).toBeInTheDocument()
        expect(searchInput).toHaveAttribute("placeholder", "Todoを検索...")
      })
    })

    describe("機能のテスト", () => {
      it("検索で入力した文字に含まれたタスクがフィルターされて表示される", async () => {
        await userEvent.type(screen.getByRole("textbox", { name: "検索" }), "todo1")
        const todoList = screen.getByRole("list")

        expect(await within(todoList).findByText("[中] todo1")).toBeInTheDocument()
        expect(screen.queryByText("[高] todo2")).not.toBeInTheDocument()
        expect(screen.queryByText("[低] todo4")).not.toBeInTheDocument()
      })
    })
  })

  describe("タスク表示フィールドのテスト", () => {
    describe("レンダリング時の要素の表示テスト", () => {
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
    })

    describe("機能のテスト", () => {
      it("Todo表示切替えボタンをクリックすると、ボタンのタイトルが「完了したTodoを表示」・「未完了のTodoを表示」の交互に切り替わる", async () => {
        await userEvent.click(screen.getByRole("button", { name: "完了したTodoを表示" }))
        expect(screen.queryByRole("button", { name: "完了したTodoを表示" })).not.toBeInTheDocument()
        expect(screen.getByRole("button", { name: "未完了のTodoを表示" })).toBeInTheDocument()

        await userEvent.click(screen.getByRole("button", { name: "未完了のTodoを表示" }))
        expect(screen.getByRole("button", { name: "完了したTodoを表示" })).toBeInTheDocument()
        expect(screen.queryByRole("button", { name: "未完了のTodoを表示" })).not.toBeInTheDocument()
      })

      it("Todo表示切替えボタンをクリックすると、Todoリストのタイトルが「未完了のTodo」・「完了したTodo」の交互に切り替わる", async () => {
        await userEvent.click(screen.getByRole("button", { name: "完了したTodoを表示" }))
        expect(screen.getByRole("heading", { name: "完了したTodo", level: 2 })).toBeInTheDocument()

        await userEvent.click(screen.getByRole("button", { name: "未完了のTodoを表示" }))
        expect(screen.getByRole("heading", { name: "未完了のTodo", level: 2 })).toBeInTheDocument()
      })

      it("「完了したTodoを表示」のが表示されている状態で、Todo表示切替えボタンをクリックすると、完了したTodoのみが表示される", async () => {
        await userEvent.click(screen.getByRole("button", { name: "完了したTodoを表示" }))

        expect(screen.getByText("[低] todo3")).toBeInTheDocument()

        expect(screen.queryByText("[中] todo1")).not.toBeInTheDocument()
        expect(screen.queryByText("[高] todo2")).not.toBeInTheDocument()
        expect(screen.queryByText("[低] todo4")).not.toBeInTheDocument()
      })

      it("「未完了のTodoを表示」のが表示されている状態で、Todo表示切替えボタンをクリックすると、未完了のTodoのみが表示される", async () => {
        await userEvent.click(screen.getByRole("button", { name: "完了したTodoを表示" }))
        await userEvent.click(screen.getByRole("button", { name: "未完了のTodoを表示" }))

        expect(screen.getByText("[中] todo1")).toBeInTheDocument()
        expect(screen.getByText("[高] todo2")).toBeInTheDocument()
        expect(screen.getByText("[低] todo4")).toBeInTheDocument()

        expect(screen.queryByText("[低] todo3")).not.toBeInTheDocument()
      })

      it("タスクの優先度「高」「中」「低」の順番で並んで表示される", async () => {
        const taskList = screen.getAllByRole("listitem")

        expect(taskList[0]).toHaveTextContent("[高] todo2")
        expect(taskList[1]).toHaveTextContent("[中] todo1")
        expect(taskList[2]).toHaveTextContent("[低] todo4")
      })

      it("タスクの優先度が同じ場合、タスク名の昇順で並んで表示される", async () => {
        const taskInput = screen.getByRole("textbox", { name: "タスク" })
        const prioritySelect = screen.getByRole("combobox", { name: "優先度" })
        const addButton = screen.getByRole("button", { name: "登録" })

        await userEvent.type(taskInput, "zzzz")
        await userEvent.selectOptions(prioritySelect, "2")
        await userEvent.click(addButton)
        await userEvent.type(taskInput, "aaaa")
        await userEvent.selectOptions(prioritySelect, "2")
        await userEvent.click(addButton)
        await userEvent.type(taskInput, "いいいい")
        await userEvent.selectOptions(prioritySelect, "1")
        await userEvent.click(addButton)
        await userEvent.type(taskInput, "ああああ")
        await userEvent.selectOptions(prioritySelect, "1")
        await userEvent.click(addButton)
        await userEvent.type(taskInput, "日本語")
        await userEvent.selectOptions(prioritySelect, "0")
        await userEvent.click(addButton)

        const taskList = screen.getAllByRole("listitem")

        expect(taskList[0]).toHaveTextContent("[高] aaaa")
        expect(taskList[1]).toHaveTextContent("[高] todo2")
        expect(taskList[2]).toHaveTextContent("[高] zzzz")
        expect(taskList[3]).toHaveTextContent("[中] todo1")
        expect(taskList[4]).toHaveTextContent("[中] ああああ")
        expect(taskList[5]).toHaveTextContent("[中] いいいい")
        expect(taskList[6]).toHaveTextContent("[低] todo4")
        expect(taskList[7]).toHaveTextContent("[低] 日本語")
      })

      it("未完了のタスクが0件のときメッセージ表示される", async () => {
        for (const btn of screen.getAllByRole("button", { name: "削除" })) {
          await userEvent.click(btn)
        }

        expect(screen.getByText("Todoがありません。新しいTodoを追加してください。")).toBeInTheDocument()
      })

      it("完了のタスクが0件のときメッセージ表示される", async () => {
        await userEvent.click(screen.getByRole("button", { name: "完了したTodoを表示" }))
        for (const btn of screen.getAllByRole("button", { name: "削除" })) {
          await userEvent.click(btn)
        }

        expect(screen.getByText("完了したTodoはありません。")).toBeInTheDocument()
      })

      it.each([
        { taskText: "今日のタスク", dueDate: "2025-06-01", expectText: "🟠 今日" },
        { taskText: "明日のタスク", dueDate: "2025-06-02", expectText: "🟡 明日" },
        { taskText: "期限切れタスク", dueDate: "2025-05-30", expectText: "❌ 期限切れ" },
        { taskText: "来月のタスク", dueDate: "2025-07-01", expectText: "🟢 2025-07-01" },
      ])("期限が taskText（$dueDate）のとき、$expectText を表示する", async ({ taskText, dueDate, expectText }) => {
        for (const btn of screen.getAllByRole("button", { name: "削除" })) {
          await userEvent.click(btn)
        }

        const input = screen.getByRole("textbox", { name: "タスク" })
        const dueDateInput = screen.getByLabelText("期限")
        const addButton = screen.getByRole("button", { name: "登録" })

        await userEvent.type(input, taskText)
        await userEvent.clear(dueDateInput)
        await userEvent.type(dueDateInput, dueDate)
        await userEvent.click(addButton)

        const addedTodoItems = within(screen.getByRole("list")).getByRole("listitem")
        expect(addedTodoItems).toHaveTextContent(expectText)
      })

      it("未完了のタスクには、「完了」「削除」のボタンが見える", async () => {
        const todoList = screen.getAllByRole("listitem")
        const buttons = within(todoList[0]).getAllByRole("button")
        const completeButton = within(todoList[0]).getByRole("button", { name: "完了" })
        const deleteButton = within(todoList[0]).getByRole("button", { name: "削除" })

        expect(buttons).length(2)
        expect(completeButton).toBeInTheDocument()
        expect(deleteButton).toBeInTheDocument()
      })

      it("完了のタスクには、「再開」「削除」のボタンが見える", async () => {
        await userEvent.click(screen.getByRole("button", { name: "完了したTodoを表示" }))
        const todoList = screen.getAllByRole("listitem")
        const buttons = within(todoList[0]).getAllByRole("button")
        const restartButton = within(todoList[0]).getByRole("button", { name: "再開" })
        const deleteButton = within(todoList[0]).getByRole("button", { name: "削除" })

        expect(buttons).length(2)
        expect(restartButton).toBeInTheDocument()
        expect(deleteButton).toBeInTheDocument()
      })

      it("未完了のタスクを完了にできる", async () => {
        const beforeListItemCount = screen.getAllByRole("listitem").length
        const completeButtons = screen.getAllByRole("button", { name: "完了" })

        expect(screen.getByText(/todo2/)).toBeInTheDocument()

        await userEvent.click(completeButtons[0])
        const afterListItemCount = screen.getAllByRole("listitem").length

        expect(screen.queryByText(/todo2/)).not.toBeInTheDocument()
        expect(afterListItemCount).toBe(beforeListItemCount - 1)
      })

      it("タスクを完了すると、完了済みのタスクで見れる", async () => {
        const completeButtons = screen.getAllByRole("button", { name: "完了" })
        await userEvent.click(completeButtons[0])
        await userEvent.click(screen.getByRole("button", { name: "完了したTodoを表示" }))

        expect(screen.getByText(/todo2/)).toBeInTheDocument()
      })

      it("完了したタスクを再開できる", async () => {
        await userEvent.click(screen.getByRole("button", { name: "完了したTodoを表示" }))
        const restartButton = screen.getByRole("button", { name: "再開" })

        expect(screen.getByText(/todo3/)).toBeInTheDocument()

        await userEvent.click(restartButton)

        expect(screen.queryByText(/todo3/)).not.toBeInTheDocument()
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
    })
  })
})
