// ユーザーの年齢と名前を管理して、挨拶文を作成し、特定の条件でログイン可否を判定します。
const t = 18
const n = "taro"

function f(u) {
  if (u.age > 20) {
    return true
  } else {
    return false
  }
}

function s(name) {
  const g = "Hello, "
  if (name !== "") {
    return g + name
  } else {
    return ""
  }
}

const users = [
  { age: t, name: n },
  { age: 25, name: "hanako" },
  { age: 16, name: "jiro" },
]

users.forEach((u) => {
  const r = f(u)
  const greet = s(u.name)
  console.log(greet + (r ? ", welcome!" : ", you are not allowed."))
})
