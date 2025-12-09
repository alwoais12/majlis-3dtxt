import { Text } from '@react-three/drei'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface DataVizProps {
  isInteracting: boolean
}

export const DataViz = ({ isInteracting }: DataVizProps) => {
  const groupRef = useRef<THREE.Group>(null)
  const timeRef = useRef(0)

  // Oscillate rotation 25% each way (π/2 radians = 90 degrees = 25% of 360)
  const maxRotation = Math.PI / 2 // 90 degrees = 25% of full rotation

  useFrame((_, delta) => {
    if (groupRef.current && !isInteracting) {
      // Increment time slowly
      timeRef.current += delta * 0.2// Speed of oscillation
      // Use sine wave to oscillate between -maxRotation and +maxRotation
      groupRef.current.rotation.y = Math.sin(timeRef.current) * maxRotation
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
        letterSpacing={0.05}
        lineHeight={1}
        outlineWidth={0.03}
        outlineColor="#444444"
      >
        مجلس الذكاء الاصطناعي
        <meshStandardMaterial 
          color="white" 
          metalness={0.3} 
          roughness={0.2}
          emissive="white"
          emissiveIntensity={0.3}
          side={THREE.DoubleSide}
        />
      </Text>
      
      {/* Back layers to create 3D depth effect */}
      <Text
        fontSize={1.5}
        anchorX="center"
        anchorY="middle"
        position={[0, 0, -0.1]}
        letterSpacing={0.05}
        lineHeight={1}
      >
        مجلس الذكاء الاصطناعي
        <meshStandardMaterial 
          color="#cccccc" 
          metalness={0.2} 
          roughness={0.3}
          side={THREE.DoubleSide}
        />
      </Text>
      
      <Text
        fontSize={1.5}
        anchorX="center"
        anchorY="middle"
        position={[0, 0, -0.2]}
        letterSpacing={0.05}
        lineHeight={1}
      >
        مجلس الذكاء الاصطناعي
        <meshStandardMaterial 
          color="#999999" 
          metalness={0.2} 
          roughness={0.4}
          side={THREE.DoubleSide}
        />
      </Text>
    </group>
  )
}
