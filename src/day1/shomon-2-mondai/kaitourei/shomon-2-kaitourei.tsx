import { useState, useEffect } from "react"

type User = {
  id: number
  name: string
  isVerified: boolean
  hasPremium: boolean
}

export async function fetchUsers() {
  const res = await fetch("/api/users")
  if (!res.ok) {
    if (res.status === 404) throw new Error("ユーザーが見つかりません")
    if (res.status === 500) throw new Error("サーバーエラーです")
    throw new Error("不明なエラーです")
  }

  const data = await res.json()
  if (!data || !Array.isArray(data.users)) {
    throw new Error("データ形式が不正です")
  }

  return data.users
}

// 1. データ取得のロジックはカスタムフックに分離
function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    setLoading(true)
    setErrorMessage("")

    fetchUsers()
      .then((data) => setUsers(data))
      .catch((err) => {
        setErrorMessage(err.message)
        setUsers([])
      })
      .finally(() => setLoading(false))
  }, [])

  return { users, loading, errorMessage }
}

export function UserDashboard2() {
  const { users, loading, errorMessage } = useUsers()

  // 2. 複雑な条件を説明変数にまとめる
  const isAllPremiumVerified = users.length > 0 && users.every((user) => user.isVerified && user.hasPremium)

  // 3. タイトル変更は副作用として分離
  useEffect(() => {
    if (users.length === 0) {
      document.title = "ユーザーがいません"
    } else if (isAllPremiumVerified) {
      document.title = "全てのプレミアムユーザー"
    } else {
      document.title = `${users.length}人のユーザー`
    }
  }, [users, isAllPremiumVerified])

  if (loading) return <div>Loading...</div>
  if (errorMessage) return <div>Error: {errorMessage}</div>

  return (
    <div>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  )
}

export function UserDashboard() {
  const { users, loading, errorMessage } = useUsers()

  // 2. 複雑な条件を説明変数にまとめる
  const isAllPremiumVerified = users.length > 0 && users.every((user) => user.isVerified && user.hasPremium)

  // 3. タイトル変更は副作用として分離
  useEffect(() => {
    if (users.length === 0) {
      document.title = "ユーザーがいません"
    } else if (isAllPremiumVerified) {
      document.title = "全てのプレミアムユーザー"
    } else {
      document.title = `${users.length}人のユーザー`
    }
  }, [users, isAllPremiumVerified])

  if (loading) return <div>Loading...</div>
  if (errorMessage) return <div>Error: {errorMessage}</div>

  return (
    <div>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  )
}
