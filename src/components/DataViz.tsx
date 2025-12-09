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

  // Oscillate rotation 25 degrees each way
  const maxRotation = (25 * Math.PI) / 180 // 25 degrees in radians

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
          metalness={0.1} 
          roughness={0.1}
          emissive="white"
          emissiveIntensity={0.6}
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
          color="#eeeeee" 
          metalness={0.1} 
          roughness={0.2}
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
          color="#dddddd" 
          metalness={0.1} 
          roughness={0.3}
          side={THREE.DoubleSide}
        />
      </Text>
    </group>
  )
}
