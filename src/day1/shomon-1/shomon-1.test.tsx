import { checkAllUserLogin, func, greet, type User } from "./shomon-1.tsx"
import { describe, expect } from "vitest"

describe("Login Page", () => {
  describe("isLoginAllowed", () => {
    it("20歳以上の場合にログインできること", () => {
      const stubUser:User = {age: 20, name: "john"}
      const isLoginMoreThan20 = func(stubUser)

      expect(isLoginMoreThan20).toBeTruthy()
    })

    it("20歳以下の場合にログインできないこと", () => {
      const stubUser:User = {age: 19, name: "michael"}
      const isLoginLessThan19 = func(stubUser)

      expect(isLoginLessThan19).toBeFalsy()
    })
  })

  describe("createGreeting", () => {
    it.each([
      { username: "taro" },
      { username: "hanako" },
      { username: "octocat" }
    ])(
      "名前を引数に入れた場合に挨拶文が返されること", (user) => {
        const greetingMessage = greet(user.username)
        const expectedMessage = `Hello, ${user.username}`

        expect(greetingMessage).toBe(expectedMessage)
      },
    )
    it("空文字を引数に入れた場合に拒否メッセージが返されること", () => {
      const greetingMessage = greet("")
      const expectedMessage = ""

      expect(greetingMessage).toBe(expectedMessage)
    })
  })

  describe("getAllLoginMessages", () => {
    it("許可された全てのユーザーがログインされたかを確かめられること", () => {
      const stubUsers: User[] = [
        {age: 20, name: "john"},
        {age: 30, name: "bob"},
        {age: 40, name: "naomi"},
        {age: 50, name: "sherry"},
      ]
      const isAllUserLogined = checkAllUserLogin(stubUsers)

      const expectedMessage = stubUsers.map((user)=> {
        return `Hello, ${user.name}, welcome!`
      })
      expect(isAllUserLogined).toEqual(expectedMessage)
    })
  })
})
