// リポジトリー関数1: 30億円もらえるけど一生豆腐しか食べられない
export async function fetchMoneyAndTofu(name: string) {
  const res = await fetch(`/api/money-and-tofu?name=${encodeURIComponent(name)}`)
  if (!res.ok) throw new Error("30億円と豆腐の取得に失敗しました")
  const data = await res.json()
  console.log("30億円と豆腐のデータ:", data)
}

// リポジトリー関数2: なんでも食べられるけどお金はもらえない
export async function fetchFreedomToEat(name: string) {
  const res = await fetch(`/api/freedom-to-eat?name=${encodeURIComponent(name)}`)
  if (!res.ok) throw new Error("自由に食べる権利の取得に失敗しました")
  const data = await res.json()
  console.log("自由に食べる権利のデータ:", data)
}
