import { Text } from '@react-three/drei'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export const DataViz = () => {
  const groupRef = useRef<THREE.Group>(null)

  // Slow auto-rotation
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1 // Very slow rotation
    }
  })

  return (
    <group ref={groupRef}>
      <Text
        fontSize={1.5}
        anchorX="center"
        anchorY="middle"
        position={[0, 0, 0]}
        castShadow
        bevelEnabled
        bevelThickness={0.05}
        bevelSize={0.02}
        bevelSegments={5}
      >
        مجلس الذكاء الاصطناعي
        <meshStandardMaterial color="white" metalness={0.3} roughness={0.4} />
      </Text>
    </group>
  )
}
