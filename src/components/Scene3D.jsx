import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, Float, Sparkles } from '@react-three/drei'

function FloatingElements() {
  const groupRef = useRef()

  useFrame((state) => {
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.05
  })

  return (
    <group ref={groupRef}>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <Sparkles count={200} scale={20} size={2} speed={0.4} opacity={0.2} color="#d4af37" />
    </group>
  )
}

export default function Scene3D() {
  return (
    <div className="canvas-container">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <color attach="background" args={['#05080f']} />
        <ambientLight intensity={0.5} />
        <FloatingElements />
      </Canvas>
    </div>
  )
}
