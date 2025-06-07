import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import App from "./App.tsx"

const clearAllTasks = async () => {
  for (const btn of screen.getAllByRole("button", { name: "削除" })) {
    await userEvent.click(btn)
  }
}

const addTask = async (text: string, opts?: { priority?: string; due?: string }) => {
  if (opts?.due) {
    await userEvent.clear(screen.getByLabelText("期限"))
    await userEvent.type(screen.getByLabelText("期限"), opts.due)
  }
  if (opts?.priority) {
    await userEvent.selectOptions(screen.getByRole("combobox", { name: "優先度" }), opts.priority)
  }
  await userEvent.type(screen.getByRole("textbox", { name: "タスク" }), text)
  await userEvent.click(screen.getByRole("button", { name: "登録" }))
}

describe("TodoAppのテスト", () => {
  beforeEach(() => {
    vi.setSystemTime(new Date(2025, 5, 1))
    render(<App />)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe("初期表示", () => {
    it("アプリタイトルを表示する", () => {
      expect(screen.getByRole("heading", { name: "タスク管理アプリ", level: 1 })).toBeInTheDocument()
    })

    it("タスクの入力欄とラベルとプレースホルダーを表示する", () => {
      const taskInput = screen.getByRole("textbox", { name: "タスク" })
      expect(taskInput).toBeInTheDocument()
      expect(taskInput).toHaveAttribute("placeholder", "新しいTodoを入力...")
    })

    it("優先度のプルダウンとラベルを表示する", () => {
      expect(screen.getByRole("combobox", { name: "優先度" })).toBeInTheDocument()
    })

    it("期限入力欄とラベルを表示する", () => {
      const dueDateInput = screen.getByLabelText("期限")
      expect(dueDateInput).toBeInTheDocument()
      expect((dueDateInput as HTMLInputElement).type).toBe("date")
    })

    it("登録ボタンを表示する", () => {
      expect(screen.getByRole("button", { name: "登録" })).toBeInTheDocument()
    })

    it("検索の入力欄とラベルとプレースホルダーを表示する", () => {
      const searchInput = screen.getByRole("textbox", { name: "検索" })
      expect(searchInput).toBeInTheDocument()
      expect(searchInput).toHaveAttribute("placeholder", "Todoを検索...")
    })

    it("「未完了のTodo」の文字を表示する", () => {
      expect(screen.getByRole("heading", { name: "未完了のTodo", level: 2 })).toBeInTheDocument()
    })

    it("Todoリスト表示切替ボタンを表示する", () => {
      expect(screen.getByRole("button", { name: "完了したTodoを表示" })).toBeInTheDocument()
    })

    it("未完了のTodoが３つを表示する", () => {
      expect(screen.getByRole("list")).toBeInTheDocument()
      expect(screen.getAllByRole("listitem")).toHaveLength(3)
    })
  })
  describe("バリデーション", () => {
    it("優先度に「高」「中」「低」を含む", async () => {
      const prioritySelect = screen.getByRole("combobox", { name: "優先度" })
      await userEvent.click(prioritySelect)

      expect(within(prioritySelect).getByText("高")).toBeInTheDocument()
      expect(within(prioritySelect).getByText("中")).toBeInTheDocument()
      expect(within(prioritySelect).getByText("低")).toBeInTheDocument()
    })

    it("優先度の初期値は、value = '1' になっている", async () => {
      const prioritySelect = screen.getByRole("combobox", { name: "優先度" })

      expect(prioritySelect).toHaveValue("1")
    })

    it.each([
      { option: "低", value: "0" },
      { option: "中", value: "1" },
      { option: "高", value: "2" },
    ])("優先度の選択肢で $option を選択すると、valueが $value になる", async ({ value }) => {
      const prioritySelect = screen.getByRole("combobox", { name: "優先度" })
      await userEvent.selectOptions(prioritySelect, value)
      expect(prioritySelect).toHaveValue(value)
    })

    it("期限入力の初期値は、今日の日付で、変更すると、変更した日付を表示する", async () => {
      const dueDateInput = screen.getByLabelText("期限")

      expect(dueDateInput).toHaveValue("2025-06-01")

      await userEvent.clear(dueDateInput)

      await userEvent.type(dueDateInput, "2025-06-20")
      expect(dueDateInput).toHaveValue("2025-06-20")
    })

    it("タスク入力欄に１文字も入力されていなければ、登録ボタンは、無効になる", async () => {
      const taskInput = screen.getByRole("textbox", { name: "タスク" })
      const addButton = screen.getByRole("button", { name: "登録" })
      await userEvent.clear(taskInput)

      expect(addButton).toBeDisabled()
    })

    it("タスク入力欄に１文字以上入力されていれば、登録ボタンは、有効になる", async () => {
      const taskInput = screen.getByRole("textbox", { name: "タスク" })
      await userEvent.type(taskInput, "テストタスク")

      expect(screen.getByRole("button", { name: "登録" })).toBeEnabled()
    })

    it.each([{ taskText: "　　　　" }, { taskText: "     " }])(
      "タスク入力欄に $taskText が入力されていれば、登録ボタンは、無効になる",
      async ({ taskText }) => {
        const taskInput = screen.getByRole("textbox", { name: "タスク" })
        const addButton = screen.getByRole("button", { name: "登録" })

        await userEvent.clear(taskInput)
        await userEvent.type(taskInput, taskText)

        expect(addButton).toBeDisabled()
      },
    )
  })
  describe("登録処理", () => {
    it("タスクを入力後、登録ボタンをクリックすると、登録する", async () => {
      await addTask("新規タスク")

      expect(screen.getByText("[中] 新規タスク")).toBeInTheDocument()
    })

    it.each([
      { taskText: "　　テスト　タスク1　　", expectTaskText: "[中] テスト タスク1" },
      { taskText: "   テスト タスク2   ", expectTaskText: "[中] テスト タスク2" },
    ])(
      "タスクに $taskText が入力されると、前後の全角・半角スペースをば除去して、登録する",
      async ({ taskText, expectTaskText }) => {
        await addTask(taskText)

        expect(screen.getByText(expectTaskText)).toBeInTheDocument()
      },
    )

    it("タスク登録後に、タスク入力欄、優先度プルダウン、期限選択をリセットする", async () => {
      const taskInput = screen.getByRole("textbox", { name: "タスク" })
      const prioritySelect = screen.getByRole("combobox", { name: "優先度" })
      const dueDateInput = screen.getByLabelText("期限")

      await addTask("新規タスク", { priority: "0" })

      expect(taskInput).toHaveValue("")
      expect(prioritySelect).toHaveValue("1")
      expect(dueDateInput).toHaveValue("2025-06-01")
    })
  })
  describe("検索機能", () => {
    it("検索で入力した文字でフィルターされて表示する", async () => {
      await userEvent.type(screen.getByRole("textbox", { name: "検索" }), "todo1")
      const todoList = screen.getByRole("list")

      expect(await within(todoList).findByText("[中] todo1")).toBeInTheDocument()
      expect(screen.queryByText("[高] todo2")).not.toBeInTheDocument()
      expect(screen.queryByText("[低] todo4")).not.toBeInTheDocument()
    })
  })

  describe("表示切替", () => {
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

    it("「完了したTodoを表示」のが表示されている状態で、Todo表示切替えボタンをクリックすると、完了したTodoのみを表示する", async () => {
      await userEvent.click(screen.getByRole("button", { name: "完了したTodoを表示" }))

      expect(screen.getByText("[低] todo3")).toBeInTheDocument()

      expect(screen.queryByText("[中] todo1")).not.toBeInTheDocument()
      expect(screen.queryByText("[高] todo2")).not.toBeInTheDocument()
      expect(screen.queryByText("[低] todo4")).not.toBeInTheDocument()
    })

    it("「未完了のTodoを表示」のが表示されている状態で、Todo表示切替えボタンをクリックすると、未完了のTodoのみを表示する", async () => {
      await userEvent.click(screen.getByRole("button", { name: "完了したTodoを表示" }))
      await userEvent.click(screen.getByRole("button", { name: "未完了のTodoを表示" }))

      expect(screen.getByText("[中] todo1")).toBeInTheDocument()
      expect(screen.getByText("[高] todo2")).toBeInTheDocument()
      expect(screen.getByText("[低] todo4")).toBeInTheDocument()

      expect(screen.queryByText("[低] todo3")).not.toBeInTheDocument()
    })
  })

  describe("ソート順序", () => {
    it("タスクの優先度「高」「中」「低」の順番で並んで表示する", () => {
      const todoList = screen.getAllByRole("listitem")

      expect(todoList[0]).toHaveTextContent("[高] todo2")
      expect(todoList[1]).toHaveTextContent("[中] todo1")
      expect(todoList[2]).toHaveTextContent("[低] todo4")
    })

    it("タスクの優先度が同じ場合、タスク名の昇順で並んで表示する", async () => {
      await addTask("zzzz", { priority: "2" })
      await addTask("aaaa", { priority: "2" })
      await addTask("いいいい", { priority: "1" })
      await addTask("ああああ", { priority: "1" })
      await addTask("日本語", { priority: "0" })

      const todoList = screen.getAllByRole("listitem")

      expect(todoList[0]).toHaveTextContent("[高] aaaa")
      expect(todoList[1]).toHaveTextContent("[高] todo2")
      expect(todoList[2]).toHaveTextContent("[高] zzzz")
      expect(todoList[3]).toHaveTextContent("[中] todo1")
      expect(todoList[4]).toHaveTextContent("[中] ああああ")
      expect(todoList[5]).toHaveTextContent("[中] いいいい")
      expect(todoList[6]).toHaveTextContent("[低] todo4")
      expect(todoList[7]).toHaveTextContent("[低] 日本語")
    })
  })
  describe("期限ラベル表示", () => {
    it.each([
      { taskText: "今日のタスク", dueDate: "2025-06-01", expectText: "🟠 今日" },
      { taskText: "明日のタスク", dueDate: "2025-06-02", expectText: "🟡 明日" },
      { taskText: "期限切れタスク", dueDate: "2025-05-30", expectText: "❌ 期限切れ" },
      { taskText: "来月のタスク", dueDate: "2025-07-01", expectText: "🟢 2025-07-01" },
    ])("期限が taskText（$dueDate）のとき、$expectText を表示する", async ({ taskText, dueDate, expectText }) => {
      await clearAllTasks()
      await addTask(taskText, { due: dueDate })

      const addedTodoItems = within(screen.getByRole("list")).getByRole("listitem")
      expect(addedTodoItems).toHaveTextContent(expectText)
    })
  })

  describe("タスク操作", () => {
    it("未完了のタスクには、「完了」「削除」のボタンが見える", () => {
      const todoList = screen.getAllByRole("listitem")
      const buttons = within(todoList[0]).getAllByRole("button")
      const completeButton = within(todoList[0]).getByRole("button", { name: "完了" })
      const deleteButton = within(todoList[0]).getByRole("button", { name: "削除" })

      expect(buttons).toHaveLength(2)
      expect(completeButton).toBeInTheDocument()
      expect(deleteButton).toBeInTheDocument()
    })

    it("完了のタスクには、「再開」「削除」のボタンが見える", async () => {
      await userEvent.click(screen.getByRole("button", { name: "完了したTodoを表示" }))
      const todoList = screen.getAllByRole("listitem")
      const buttons = within(todoList[0]).getAllByRole("button")
      const restartButton = within(todoList[0]).getByRole("button", { name: "再開" })
      const deleteButton = within(todoList[0]).getByRole("button", { name: "削除" })

      expect(buttons).toHaveLength(2)
      expect(restartButton).toBeInTheDocument()
      expect(deleteButton).toBeInTheDocument()
    })

    it("完了ボタンをクリックすると、完了のタスクから1件減る", async () => {
      const beforeTodoList = screen.getAllByRole("listitem")
      await userEvent.click(screen.getAllByRole("button", { name: "完了" })[0])
      const afterTodoList = screen.getAllByRole("listitem")

      expect(afterTodoList).toHaveLength(beforeTodoList.length - 1)
      expect(screen.queryByText(/todo2/)).not.toBeInTheDocument()
    })

    it("完了ボタンをクリックすると、完了済みのタスクで見える", async () => {
      const completeButtons = screen.getAllByRole("button", { name: "完了" })
      await userEvent.click(completeButtons[0])
      await userEvent.click(screen.getByRole("button", { name: "完了したTodoを表示" }))

      expect(screen.getByText(/todo2/)).toBeInTheDocument()
    })

    it("再開ボタンをクリックすると、完了したタスクを再開する", async () => {
      await userEvent.click(screen.getByRole("button", { name: "完了したTodoを表示" }))
      const restartButton = screen.getByRole("button", { name: "再開" })

      expect(screen.getByText(/todo3/)).toBeInTheDocument()

      await userEvent.click(restartButton)

      expect(screen.queryByText(/todo3/)).not.toBeInTheDocument()
    })

    it("再開ボタンをクリックすると、未完了のタスクで見える", async () => {
      await userEvent.click(screen.getByRole("button", { name: "完了したTodoを表示" }))
      const restartButton = screen.getByRole("button", { name: "再開" })
      await userEvent.click(restartButton)
      await userEvent.click(screen.getByRole("button", { name: "未完了のTodoを表示" }))

      expect(screen.getByText(/todo3/)).toBeInTheDocument()
    })

    it("削除ボタンをクリックすると、タスクを削除する", async () => {
      const beforeTodoList = screen.getAllByRole("listitem")
      await userEvent.click(screen.getAllByRole("button", { name: "削除" })[0])
      const afterTodoList = screen.getAllByRole("listitem")

      expect(afterTodoList).toHaveLength(beforeTodoList.length - 1)
      expect(screen.queryByText(/todo2/)).not.toBeInTheDocument()
    })
  })

  describe("メッセージ表示", () => {
    it("未完了のタスクが0件のときメッセージを表示する", async () => {
      await clearAllTasks()

      expect(screen.getByText("Todoがありません。新しいTodoを追加してください。")).toBeInTheDocument()
    })

    it("完了のタスクが0件のときメッセージを表示する", async () => {
      await userEvent.click(screen.getByRole("button", { name: "完了したTodoを表示" }))
      await clearAllTasks()

      expect(screen.getByText("完了したTodoはありません。")).toBeInTheDocument()
    })
  })
})
