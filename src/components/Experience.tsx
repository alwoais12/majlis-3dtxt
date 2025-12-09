import { OrbitControls, SpotLight, useDepthBuffer } from '@react-three/drei'
import { DataViz } from './DataViz'

export const Experience = () => {
  const depthBuffer = useDepthBuffer({ size: 256 })

  return (
    <>
      <OrbitControls makeDefault />
      
      {/* Ambient light for base visibility */}
      <ambientLight intensity={0.1} />

      {/* Visible Spotlight Beam */}
      <SpotLight
        depthBuffer={depthBuffer}
        position={[0, 8, 0]}
        distance={20}
        angle={1.0}
        attenuation={8}
        anglePower={4} // Lower value = softer/wider spread
        radiusTop={0.5} // Makes the beam start wider
        color="#ffffff"
        opacity={0.8} // Slightly more visible beam
      />

      <group position={[0, 0, 0]}>
        <DataViz />
      </group>
    </>
  )
}
