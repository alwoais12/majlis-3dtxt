import { OrbitControls, SpotLight, useDepthBuffer } from '@react-three/drei'
import { DataViz } from './DataViz'
import { useState, useRef, useEffect } from 'react'

export const Experience = () => {
  const depthBuffer = useDepthBuffer({ size: 256 })
  const [isInteracting, setIsInteracting] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Handle interaction start
  const handleInteractionStart = () => {
    setIsInteracting(true)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  // Handle interaction end - wait 5 seconds before resuming
  const handleInteractionEnd = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      setIsInteracting(false)
    }, 5000) // 5 seconds
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <>
      <OrbitControls 
        makeDefault 
        onChange={handleInteractionStart}
        onStart={handleInteractionStart}
        onEnd={handleInteractionEnd}
      />
      
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
        <DataViz isInteracting={isInteracting} />
      </group>
    </>
  )
}
