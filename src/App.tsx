import { Canvas } from '@react-three/fiber'
import { Experience } from './components/Experience'
import { useState, useRef, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'

function App() {
  // Start immediately
  const [started, setStarted] = useState(true)
  const [muted, setMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Handle BGM
  useEffect(() => {
    if (started && audioRef.current) {
      audioRef.current.volume = 0.3
      audioRef.current.play().catch(() => {
        console.log("Autoplay blocked, will play on interaction")
      })
    }
  }, [started])

  // Handle Mute
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = muted
    }
  }, [muted])

  return (
    <>
      {/* Background Music */}
      <audio ref={audioRef} src="/bgm.mp3" loop />
      
      {started && (
        <>
          <Canvas shadows camera={{ position: [0, 0, 10], fov: 50 }}>
            <color attach="background" args={['#1a1a1a']} />
            <Experience />
          </Canvas>
          
          {/* Global Mute Button */}
          <button 
            onClick={() => setMuted(!muted)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              zIndex: 100,
              background: 'rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px'
            }}
          >
            {muted ? '🔇' : '🔊'}
          </button>

          {/* AI Logo GIF */}
          <img 
            src="/AILogoVideoDarkOnce.gif" 
            alt="AI Logo"
            style={{
              position: 'absolute',
              bottom: '20px',
              right: '20px',
              width: '100px',
              height: 'auto',
              zIndex: 100,
              opacity: 0.8
            }}
          />
        </>
      )}
    </>
  )
}

export default App
