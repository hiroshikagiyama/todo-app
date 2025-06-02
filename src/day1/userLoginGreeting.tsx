// 各ユーザーの年齢を判定し、20歳以上なら「ようこそ」と表示するプログラム
const minimumAllowedAge = 20
const defaultUserName = "taro"

function isLoginAllowed(user: { age: number; name: string }): boolean {
  return user.age >= minimumAllowedAge
}

function createGreeting(name: string): string {
  const greetingPrefix = "Hello, "
  return name !== "" ? greetingPrefix + name : ""
}

const users = [
  { age: 18, name: defaultUserName },
  { age: 25, name: "hanako" },
  { age: 16, name: "jiro" },
]

users.forEach((user) => {
  const loginAllowed = isLoginAllowed(user)
  const greeting = createGreeting(user.name)
  console.log(greeting + (loginAllowed ? ", welcome!" : ", you are not allowed."))
})
