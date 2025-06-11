import { useState } from "react"
import "../../App.scss"
import type { Priority, Todo } from "./types.ts"
import { initialTodos } from "./initialTodos.ts"
import { Field1 } from "./components/Field1.tsx"
import { Field2 } from "./components/Field2.tsx"
import { Field3 } from "./components/Field3.tsx"
import { Html, OrbitControls, Stars } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"

export default function App() {
  const [items, setItems] = useState<Todo[]>(initialTodos)
  const [value, setValue] = useState<Priority>(1)
  const [search, setSearch] = useState("")

  return (
    <div style={{backgroundColor: "black", height: "100vh"}}>
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} />
        <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade />
        <OrbitControls />
      <Html
        position={[0, 0, 0]} // 3D空間上の位置
        transform              // 3D空間に応じて回転・スケール可能に
        center                 // 中央揃え
        distanceFactor={1.5}   // カメラ距離に応じたサイズ調整（数値は調整可）
        zIndexRange={[100, 0]} // 必要に応じてz-index制御
        >
        <div className="todo-app-wrapper" style={{height: "fit-content"}}>
          <div className="todo-app">
            <h1>タスク管理アプリ</h1>
            <Field1 value={value} setValue={setValue} setItems={setItems} />
            <Field2 search={search} setSearch={setSearch} />
            <Field3 items={items} setItems={setItems} search={search} value={value} />
          </div>
        </div>
      </Html>
      </Canvas>
    </div>
  )
}
