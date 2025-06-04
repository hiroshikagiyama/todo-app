import { useState, useEffect } from "react"

type User = {
  id: number
  name: string
  isVerified: boolean
  hasPremium: boolean
}

export function UserDashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>("")

  useEffect(() => {
    setLoading(true)

    fetch("/api/users")
      .then((res) => {
        if (res.ok) {
          return res.json()
        } else {
          if (res.status === 404) {
            throw new Error("ユーザーが見つかりません")
          } else if (res.status === 500) {
            throw new Error("サーバーエラーです")
          }
        }
      })
      .then((data) => {
        if (data && Array.isArray(data.users)) {
          setUsers(data.users)
          setLoading(false)
          setErrorMessage("")
          if (data.users.length > 0 && data.users.every((u: User) => u.isVerified && u.hasPremium)) {
            document.title = `全てのプレミアムユーザー`
          } else {
            document.title = `${data.users.length}人のユーザー`
          }
        } else {
          setUsers([])
          setLoading(false)
          setErrorMessage("")
        }
      })
      .catch((err) => {
        setErrorMessage(err.message)
        setLoading(false)
      })
  }, [])

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
