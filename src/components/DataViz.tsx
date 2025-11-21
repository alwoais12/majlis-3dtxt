import { Text, Html, RoundedBox } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef, useState, useMemo } from 'react'
import * as THREE from 'three'
import { playHoverSound, playClickSound } from '../utils/audio'

const Bar = ({ value, color, label, max, position }: any) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHover] = useState(false)
  
  const targetHeight = Math.max((value / max) * 4, 0.2) 
  
  const geometry = useMemo(() => {
    const geo = new THREE.BoxGeometry(1, 1, 1)
    geo.translate(0, 0.5, 0)
    return geo
  }, [])

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, targetHeight, delta * 8)
      
      if (meshRef.current.material instanceof THREE.MeshStandardMaterial) {
          const targetColor = new THREE.Color(color).multiplyScalar(hovered ? 1.5 : 1)
          meshRef.current.material.color.lerp(targetColor, delta * 10)
      }
    }
  })

  return (
    <group position={position}>
      <mesh 
        ref={meshRef}
        geometry={geometry}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
        scale={[1, 0.1, 1]} 
      >
        <meshStandardMaterial color={color} roughness={0.3} />
      </mesh>
      
      <Text 
        position={[0, -0.5, 0]} 
        fontSize={0.2} 
        color="white" 
        anchorX="center" 
        anchorY="top"
        maxWidth={2}
        textAlign="center"
      >
        {label}
      </Text>
      
      <FloatingText targetHeight={targetHeight} value={value} />
    </group>
  )
}

const FloatingText = ({ targetHeight, value }: { targetHeight: number, value: string | number }) => {
    const ref = useRef<THREE.Group>(null)
    useFrame((_, delta) => {
        if (ref.current) {
            ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, targetHeight + 0.5, delta * 8)
        }
    })
    return (
        <group ref={ref} position={[0, 0, 0]}>
            <Text fontSize={0.35} color="white" anchorX="center" anchorY="bottom">
                {value}
            </Text>
        </group>
    )
}

const InfoList = ({ items, position, title }: { items: string[], position: [number, number, number], title?: string }) => {
  return (
    <group position={position}>
      {title && (
        <Text position={[0, 0.5, 0]} fontSize={0.3} color="#aaaaaa" anchorX="left" anchorY="bottom">
          {title}
        </Text>
      )}
      {items.map((item, index) => (
        <Text
          key={index}
          position={[0, -index * 0.7, 0]}
          fontSize={0.25}
          color="white"
          anchorX="left"
          anchorY="top"
          maxWidth={6.5}
          lineHeight={1.3}
        >
          • {item}
        </Text>
      ))}
    </group>
  )
}

const MonthButton = ({ label, color, position, onClick }: { label: string, color: string, position: [number, number, number], onClick: () => void }) => {
    const [hovered, setHover] = useState(false)
    const ref = useRef<THREE.Group>(null)

    useFrame((_, delta) => {
        if (ref.current) {
            const targetScale = hovered ? 1.1 : 1
            ref.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 10)
        }
    })

    const handleClick = (e: any) => {
        e.stopPropagation()
        playClickSound()
        onClick()
    }

    return (
        <group 
            ref={ref} 
            position={position} 
            onClick={handleClick}
            onPointerOver={() => {
                setHover(true)
                playHoverSound()
                document.body.style.cursor = 'pointer'
            }} 
            onPointerOut={() => {
                setHover(false)
                document.body.style.cursor = 'auto'
            }}
        >
            <RoundedBox args={[3.5, 1.2, 0.2]} radius={0.1} smoothness={4}>
                <meshStandardMaterial 
                    color={hovered ? new THREE.Color(color).multiplyScalar(1.2) : color} 
                    emissive={color}
                    emissiveIntensity={hovered ? 0.4 : 0.1}
                    roughness={0.2}
                    metalness={0.5}
                />
            </RoundedBox>
            <Text position={[0, 0, 0.15]} fontSize={0.4} color="white" anchorX="center" anchorY="middle" fontWeight="bold">
                {label}
            </Text>
        </group>
    )
}

const NavButton = ({ direction, position, onClick }: { direction: 'prev' | 'next', position: [number, number, number], onClick: () => void }) => {
    const [hovered, setHover] = useState(false)
    const ref = useRef<THREE.Group>(null)

    useFrame((_, delta) => {
        if (ref.current) {
            const targetScale = hovered ? 1.1 : 1
            ref.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 10)
        }
    })

    return (
         <group 
            ref={ref} 
            position={position} 
            onClick={(e) => {
                e.stopPropagation()
                playClickSound()
                onClick()
            }}
            onPointerOver={() => {
                setHover(true)
                playHoverSound()
                document.body.style.cursor = 'pointer'
            }}
            onPointerOut={() => {
                setHover(false)
                document.body.style.cursor = 'auto'
            }}
        >
            <RoundedBox args={[1.5, 1.5, 0.1]} radius={0.75} smoothness={4}>
                 <meshStandardMaterial 
                    color={hovered ? '#555' : '#333'} 
                    emissive={hovered ? '#555' : '#000'}
                    emissiveIntensity={0.2}
                 />
            </RoundedBox>
            <Text position={[0, 0.1, 0.1]} fontSize={0.8} color="white" anchorX="center" anchorY="middle">
                {direction === 'next' ? '→' : '←'}
            </Text>
        </group>
    )
}

const OverviewViz = ({ data }: { data: any }) => {
    const [activePersonaIndex, setActivePersonaIndex] = useState<number | null>(null)
    const personas = data.personas

    const handleNext = () => {
        if (activePersonaIndex !== null) {
            setActivePersonaIndex((activePersonaIndex + 1) % personas.length)
        }
    }

    const handlePrev = () => {
        if (activePersonaIndex !== null) {
            setActivePersonaIndex((activePersonaIndex - 1 + personas.length) % personas.length)
        }
    }

    // Selection View
    if (activePersonaIndex === null) {
        return (
            <group>
                <Text position={[0, 3, 0]} fontSize={0.5} color="white" anchorX="center">
                    {data.title}
                </Text>
                <Text position={[0, 2.2, 0]} fontSize={0.3} color="#aaaaaa" anchorX="center">
                    Select a persona to explore
                </Text>

                 <group position={[0, 0, 0]}>
                     {personas.map((persona: any, index: number) => (
                         <group 
                            key={index} 
                            position={[(index - (personas.length - 1) / 2) * 3.2, 0, 0]}
                            onClick={(e) => {
                                e.stopPropagation()
                                playClickSound()
                                setActivePersonaIndex(index)
                            }}
                            onPointerOver={() => {
                                playHoverSound()
                                document.body.style.cursor = 'pointer'
                            }}
                            onPointerOut={() => document.body.style.cursor = 'auto'}
                         >
                             <RoundedBox args={[3, 1.2, 0.1]} radius={0.1}>
                                 <meshStandardMaterial 
                                    color="#444"
                                    emissive="#000"
                                 />
                             </RoundedBox>
                             <Text position={[0, 0.2, 0.11]} fontSize={0.4} color="white" anchorX="center" anchorY="middle">
                                 {persona.icon}
                             </Text>
                             <Text position={[0, -0.25, 0.11]} fontSize={0.2} color="white" anchorX="center" anchorY="middle">
                                 {persona.name}
                             </Text>
                         </group>
                     ))}
                </group>
            </group>
        )
    }

    // Detail View
    const currentPersona = personas[activePersonaIndex]

    return (
        <group>
             {/* Back Button */}
             <group 
                position={[-7.5, 6, 2]} 
                onClick={(e) => {
                    e.stopPropagation()
                    playClickSound()
                    setActivePersonaIndex(null)
                }}
                onPointerOver={() => {
                    playHoverSound()
                    document.body.style.cursor = 'pointer'
                }}
                onPointerOut={() => document.body.style.cursor = 'auto'}
            >
                <RoundedBox args={[3.5, 0.8, 0.1]} radius={0.05}>
                     <meshStandardMaterial color="#444" />
                </RoundedBox>
                <Text position={[0, 0, 0.1]} fontSize={0.25} color="white" anchorX="center" anchorY="middle">
                    ← Back to Personas
                </Text>
            </group>

            {/* Navigation Buttons */}
            <NavButton direction="prev" position={[-9, 2, 2]} onClick={handlePrev} />
            <NavButton direction="next" position={[9, 2, 2]} onClick={handleNext} />

            <Html position={[0, 2, 0]} transform occlude distanceFactor={6} style={{ width: '1000px', height: '600px', overflowY: 'auto', pointerEvents: 'auto' }}>
                <div style={{ 
                    background: 'rgba(20, 20, 20, 0.9)', 
                    padding: '40px', 
                    borderRadius: '30px', 
                    border: '2px solid rgba(255,255,255,0.1)',
                    color: 'white',
                    fontFamily: 'Inter, sans-serif',
                    height: '100%',
                    boxSizing: 'border-box',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
                    backdropFilter: 'blur(20px)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                        <span style={{ fontSize: '48px', marginRight: '20px' }}>{currentPersona.icon}</span>
                        <h2 style={{ margin: 0, fontSize: '28px', color: '#3b82f6' }}>{currentPersona.name} Persona</h2>
                    </div>
                    
                    <div style={{ marginBottom: '30px' }}>
                        <h3 style={{ color: '#aaa', fontSize: '18px', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Needs</h3>
                        <p style={{ fontSize: '18px', lineHeight: '1.6', color: '#e0e0e0' }}>{currentPersona.needs}</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                        <div>
                            <h3 style={{ color: '#aaa', fontSize: '18px', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '1px' }}>AI Support</h3>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {currentPersona.ai_support.map((item: string, i: number) => (
                                    <li key={i} style={{ marginBottom: '12px', fontSize: '16px', lineHeight: '1.5', color: '#e0e0e0', display: 'flex', alignItems: 'start' }}>
                                        <span style={{ color: '#3b82f6', marginRight: '10px', fontSize: '20px' }}>•</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        <div>
                            <h3 style={{ color: '#aaa', fontSize: '18px', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '1px' }}>Features</h3>
                            <ul style={{ listStyle: 'none', padding: 0, columns: currentPersona.features.length > 6 ? 2 : 1 }}>
                                {currentPersona.features.map((item: string, i: number) => (
                                    <li key={i} style={{ marginBottom: '10px', fontSize: '16px', lineHeight: '1.5', color: '#e0e0e0', display: 'flex', alignItems: 'start', breakInside: 'avoid' }}>
                                        <span style={{ color: '#10b981', marginRight: '10px', fontSize: '14px' }}>✓</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </Html>
        </group>
    )
}

const NextStepsViz = ({ data }: { data: any }) => {
    const [activeMonth, setActiveMonth] = useState<'nov' | 'dec' | null>(null)

    // If no month is selected, show the selection buttons
    if (!activeMonth) {
        return (
            <group position={[0, 1, 0]}>
                <Text position={[0, 2.5, 0]} fontSize={0.5} color="white" anchorX="center">
                    Select a Month for Future Objectives
                </Text>

                <MonthButton 
                    label="November" 
                    color="#3b82f6" 
                    position={[-2, 0.5, 0]} 
                    onClick={() => setActiveMonth('nov')} 
                />

                <MonthButton 
                    label="December" 
                    color="#8b5cf6" 
                    position={[2, 0.5, 0]} 
                    onClick={() => setActiveMonth('dec')} 
                />
            </group>
        )
    }

    const currentData = activeMonth === 'nov' ? data.subSections[0] : data.subSections[1]

    const toggleMonth = () => {
        setActiveMonth(activeMonth === 'nov' ? 'dec' : 'nov')
    }

    return (
        <group>
             {/* Back Button */}
             <group 
                position={[-7.5, 6, 2]} 
                onClick={(e) => {
                    e.stopPropagation()
                    playClickSound()
                    setActiveMonth(null)
                }}
                onPointerOver={() => {
                    playHoverSound()
                    document.body.style.cursor = 'pointer'
                }}
                onPointerOut={() => document.body.style.cursor = 'auto'}
            >
                <RoundedBox args={[3.5, 0.8, 0.1]} radius={0.05}>
                     <meshStandardMaterial color="#444" />
                </RoundedBox>
                <Text position={[0, 0, 0.1]} fontSize={0.25} color="white" anchorX="center" anchorY="middle">
                    ← Back to Selection
                </Text>
            </group>

            {/* Navigation Buttons */}
            <NavButton direction="prev" position={[-9, 2.5, 2]} onClick={toggleMonth} />
            <NavButton direction="next" position={[9, 2.5, 2]} onClick={toggleMonth} />

            <Text position={[0, 5, 0]} fontSize={0.5} color="white" anchorX="center">
                {currentData.title}
            </Text>
            
            {/* Since the lists are long, we use HTML overlay for scrolling content. */}
            <Html position={[0, 2.5, 0]} transform occlude distanceFactor={6} style={{ width: '1000px', height: '700px', overflowY: 'auto', pointerEvents: 'auto' }}>
                <div style={{ 
                    background: 'rgba(20, 20, 20, 0.9)', 
                    padding: '60px', 
                    borderRadius: '30px', 
                    border: '2px solid rgba(255,255,255,0.1)',
                    color: 'white',
                    fontFamily: 'Inter, sans-serif',
                    height: '100%',
                    boxSizing: 'border-box',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
                    backdropFilter: 'blur(20px)'
                }}>
                    <h3 style={{ marginTop: 0, borderBottom: '2px solid rgba(255,255,255,0.1)', paddingBottom: '20px', fontSize: '24px', color: '#3b82f6' }}>Key Objectives</h3>
                    <ul style={{ columns: 2, gap: '60px', listStylePosition: 'inside' }}>
                        {currentData.content.map((item: string, i: number) => (
                            <li key={i} style={{ marginBottom: '16px', fontSize: '18px', lineHeight: '1.5', breakInside: 'avoid', color: '#e0e0e0' }}>{item}</li>
                        ))}
                    </ul>

                    {currentData.extraTitle && (
                        <>
                            <h3 style={{ marginTop: '40px', borderBottom: '2px solid rgba(255,255,255,0.1)', paddingBottom: '20px', fontSize: '24px', color: '#3b82f6' }}>{currentData.extraTitle}</h3>
                            <ul style={{ listStylePosition: 'inside' }}>
                                {currentData.extraContent.map((item: string, i: number) => (
                                    <li key={i} style={{ marginBottom: '16px', fontSize: '18px', lineHeight: '1.5', color: '#e0e0e0' }}>{item}</li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>
            </Html>
        </group>
    )
}

export const DataViz = ({ data }: { data: any }) => {
  if (data.id === 'next-steps') {
      return <NextStepsViz data={data} />
  }

  if (data.id === 'overview') {
      return <OverviewViz data={data} />
  }

  // Determine max value for scaling
  const maxVal = Math.max(...(data.stats?.map((s: any) => s.value) || [100])) * 1.2

  return (
    <group>
      <Text position={[0, 4.5, -2]} fontSize={0.6} color="#aaaaaa" anchorX="center">
        {data.name}
      </Text>
      
      {/* Bars */}
      <group position={[data.details?.length ? -2 : 0, 0, 0]}> 
        {data.stats && data.stats.map((stat: any, index: number) => (
          <Bar 
            key={`${data.name}-${stat.label}`}
            {...stat} 
            max={maxVal || 100} 
            position={[(index - (data.stats.length - 1) / 2) * 2, 0, 0]} 
          />
        ))}
      </group>

      {/* Details List */}
      {data.details && data.details.length > 0 && (
        <InfoList 
          items={data.details} 
          position={[3.5, 5, 0]} 
          title={data.id === 'Entities' ? 'Participating Entities:' : 'Development Notes:'}
        />
      )}
    </group>
  )
}
