import { Canvas } from '@react-three/fiber'
import { Experience } from './components/Experience'
import { useState, useRef, useEffect, useCallback } from 'react'

function App() {
  // Start immediately
  const started = true
  const [muted, setMuted] = useState(false)
  const [audioStarted, setAudioStarted] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Play audio on first user interaction
  const handleFirstInteraction = useCallback(() => {
    if (!audioStarted && audioRef.current) {
      audioRef.current.volume = 0.3
      audioRef.current.play().catch((err) => {
        console.log("Audio play failed:", err)
      })
      setAudioStarted(true)
    }
  }, [audioStarted])

  // Handle BGM - try autoplay first
  useEffect(() => {
    if (started && audioRef.current) {
      audioRef.current.volume = 0.3
      audioRef.current.play().then(() => {
        setAudioStarted(true)
      }).catch(() => {
        console.log("Autoplay blocked, waiting for user interaction")
      })
    }
  }, [started])

  // Handle Mute
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = muted
    }
  }, [muted])

  // Add click listener for first interaction
  useEffect(() => {
    if (!audioStarted) {
      window.addEventListener('click', handleFirstInteraction)
      return () => window.removeEventListener('click', handleFirstInteraction)
    }
  }, [audioStarted, handleFirstInteraction])

  return (
    <>
      {/* Background Music */}
      <audio ref={audioRef} src="/bgm.mp3" loop autoPlay />
      
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
