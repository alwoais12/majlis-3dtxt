import { Text } from '@react-three/drei'

export const DataViz = () => {
  return (
    <group>
      <Text
        fontSize={1.5}
        anchorX="center"
        anchorY="middle"
        position={[0, 0, 0]}
        castShadow
      >
        مجلس الذكاء الاصطناعي
        <meshBasicMaterial color="white" toneMapped={false} />
      </Text>
    </group>
  )
}
