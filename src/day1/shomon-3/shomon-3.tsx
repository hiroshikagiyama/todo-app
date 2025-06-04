import { useState } from "react"
import { fetchFreedomToEat, fetchMoneyAndTofu } from "./buttonRepository"

// Reactコンポーネント
export function ChoiceButtons() {
  const [name, setName] = useState("")

  const handleMoneyAndTofuClick = async () => {
    try {
      await fetchMoneyAndTofu(name)
    } catch {
      console.error("30億円と豆腐の取得に失敗しました")
    }
  }

  const handleFreedomToEatClick = async () => {
    try {
      await fetchFreedomToEat(name)
    } catch {
      console.error("自由に食べる権利の取得に失敗しました")
    }
  }

  return (
    <div>
      <h1>あなたはどちらを選びますか？</h1>
      <input type="text" placeholder="名前を入力してください" value={name} onChange={(e) => setName(e.target.value)} />
      <button data-testid="buttonOne" onClick={handleMoneyAndTofuClick}>
        30億円もらえるけどこれからは豆腐しか食べられないボタン
      </button>
      <button data-testid="buttonTwo" onClick={handleFreedomToEatClick}>
        なんでも食べられるけどお金はもらえないボタン
      </button>
    </div>
  )
}
