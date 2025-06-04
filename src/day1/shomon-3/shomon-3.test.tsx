import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { vi } from "vitest"
import { ChoiceButtons } from "./shomon-3"
import { fetchMoneyAndTofu, fetchFreedomToEat } from "./buttonRepository"

vi.mock("./buttonRepository", () => ({
  fetchMoneyAndTofu: vi.fn(),
  fetchFreedomToEat: vi.fn(),
}))

describe("ChoiceButtons", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  // 初めてこのテストを見た人はテストを見てコードを理解できますか？？
  it("正しい動作をしてボタンをクリックすると正しい引数でレポジトリーが呼ばれる", async () => {
    render(<ChoiceButtons />)
    const input = screen.getByPlaceholderText("名前を入力してください")
    fireEvent.change(input, { target: { value: "Test Name" } })
    fireEvent.click(screen.getByTestId("buttonOne"))

    await waitFor(() => {
      expect(fetchMoneyAndTofu).toHaveBeenCalledWith("Test Name")
    })
  })

  // 初めてこのテストを見た人はテストを見てコードを理解できますか？？
  it("正しい動作をしてもう一つのボタンをクリックすると正しい引数でレポジトリーが呼ばれる", async () => {
    render(<ChoiceButtons />)
    const input = screen.getByPlaceholderText("名前を入力してください")
    fireEvent.change(input, { target: { value: "Test Name" } })
    fireEvent.click(screen.getByTestId("buttonTwo"))

    await waitFor(() => {
      expect(fetchFreedomToEat).toHaveBeenCalledWith("Test Name")
    })
  })
})
