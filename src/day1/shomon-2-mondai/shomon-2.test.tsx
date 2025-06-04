import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import { UserDashboard } from "./shomon-2-mondai"
// import { UserDashboard } from "./kaitourei/shomon-2-kaitourei.tsx"

describe("UserDashboard", () => {
  const originalFetch = window.fetch
  const originalTitle = document.title

  beforeEach(() => {
    document.title = originalTitle
  })

  afterEach(() => {
    vi.restoreAllMocks()
    window.fetch = originalFetch
    document.title = originalTitle
  })

  it("初期状態で「Loading...」が表示される", () => {
    window.fetch = vi.fn(() => new Promise(() => {})) as unknown as typeof fetch
    render(<UserDashboard />)
    expect(screen.getByText("Loading...")).toBeInTheDocument()
  })

  it("通常のユーザー一覧を表示し、タイトルが「n人のユーザー」になる", async () => {
    const users = [
      { id: 1, name: "Alice", isVerified: true, hasPremium: false },
      { id: 2, name: "Bob", isVerified: false, hasPremium: false },
    ]
    window.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ users }),
    }) as unknown as typeof window.fetch

    render(<UserDashboard />)
    await waitFor(() => {
      expect(screen.getByText("Alice")).toBeInTheDocument()
      expect(screen.getByText("Bob")).toBeInTheDocument()
      expect(document.title).toBe("2人のユーザー")
    })
  })

  it("全員が認証済みかつプレミアムの場合、タイトルが「全てのプレミアムユーザー」になる", async () => {
    const users = [
      { id: 1, name: "Alice", isVerified: true, hasPremium: true },
      { id: 2, name: "Bob", isVerified: true, hasPremium: true },
    ]
    window.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ users }),
    }) as unknown as typeof window.fetch

    render(<UserDashboard />)
    await waitFor(() => {
      expect(screen.getByText("Alice")).toBeInTheDocument()
      expect(screen.getByText("Bob")).toBeInTheDocument()
      expect(document.title).toBe("全てのプレミアムユーザー")
    })
  })

  it("ユーザーが空の場合、空リストを表示しタイトルが「ユーザーがいません」になる", async () => {
    window.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ users: [] }),
    }) as unknown as typeof window.fetch

    render(<UserDashboard />)
    await waitFor(() => {
      expect(screen.queryByRole("listitem")).not.toBeInTheDocument()
      expect(document.title).toBe("ユーザーがいません")
    })
  })

  it("404の場合、エラーメッセージ「ユーザーが見つかりません」を表示する", async () => {
    window.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
    }) as unknown as typeof window.fetch

    render(<UserDashboard />)
    await waitFor(() => {
      expect(screen.getByText(/ユーザーが見つかりません/)).toBeInTheDocument()
    })
  })

  it("500の場合、エラーメッセージ「サーバーエラーです」を表示する", async () => {
    window.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    }) as unknown as typeof window.fetch

    render(<UserDashboard />)
    await waitFor(() => {
      expect(screen.getByText(/サーバーエラーです/)).toBeInTheDocument()
    })
  })

  it("fetchやネットワークエラー時にエラーメッセージを表示する", async () => {
    window.fetch = vi.fn().mockRejectedValue(new Error("Network error")) as unknown as typeof window.fetch

    render(<UserDashboard />)
    await waitFor(() => {
      expect(screen.getByText(/Network error/)).toBeInTheDocument()
    })
  })

  it("users配列がレスポンスに無い場合も正常に空リストを表示する", async () => {
    window.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({}),
    }) as unknown as typeof window.fetch

    render(<UserDashboard />)
    await waitFor(() => {
      expect(screen.queryByRole("listitem")).not.toBeInTheDocument()
    })
  })
})
