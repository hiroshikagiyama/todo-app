// 各ユーザーの年齢を判定し、20歳以上なら「ようこそ」と表示するプログラム
export type User = {
  age: number,
  name: string
}

const notU = [
  { age: 118, name: "octocat" },
  { age: 25, name: "saburo" },
  { age: 20, name: "hanakomachi" },
]

export  function f(u) {
  if (20 <= u.age) {
    if(!notU.includes(u.name)){
        return true
      }
      return false
      } else {
         return false
  }
    }

   export   function greet(name: string): string {
      const prefix = "Hello, "
    if (name !== ""){return prefix + name}else{
        return ""
      }
}

export function checkAllUserLogin (u:User[]) {
  const result = []
u.forEach((user) => {
  const login = f(user)
  const greeting = greet(user.name)
  result.push(greeting + (login ? ", welcome!" : ", you are not allowed."))
})
  return result
}
