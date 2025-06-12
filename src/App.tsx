import { Canvas } from "@react-three/fiber"
import { Html, OrbitControls, Stars } from "@react-three/drei"
import TodoApp from "./day2/todo-app-mondai/TodoApp.tsx"

export const App = () => {
  return (
    <div style={{ backgroundColor: "black", height: "100vh" }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} />
        <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade />
        <OrbitControls />
        <Html
          position={[0, 0, 0]}
          transform 
          center
          distanceFactor={1.5}
          zIndexRange={[100, 0]}
        >
          <TodoApp />
        </Html>
      </Canvas>
    </div>
  )
}
