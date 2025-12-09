import { Canvas } from '@react-three/fiber'
import { Experience } from './components/Experience'
import { useState, useRef, useEffect } from 'react'

function App() {
  const started = true
  const [muted, setMuted] = useState(true) // Start muted
  const audioRef = useRef<HTMLAudioElement>(null)

  // Set initial volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3
    }
  }, [])

  // Handle Mute toggle and play audio
  const handleMuteToggle = () => {
    if (audioRef.current) {
      if (muted) {
        // Unmuting - try to play
        audioRef.current.muted = false
        audioRef.current.play().catch((err) => {
          console.log("Audio play failed:", err)
        })
      } else {
        // Muting
        audioRef.current.muted = true
      }
    }
    setMuted(!muted)
  }

  return (
    <>
      {/* Background Music */}
      <audio ref={audioRef} src="/bgm.mp3" loop />
      
      {started && (
        <>
          <Canvas shadows camera={{ position: [0, 0, 14], fov: 50 }}>
            <color attach="background" args={['#1a1a1a']} />
            <Experience />
          </Canvas>
          
          {/* Global Mute Button */}
          <button 
            onClick={handleMuteToggle}
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
