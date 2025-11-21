import { reportData } from '../data/report'
import { playHoverSound, playClickSound } from '../utils/audio'

interface InterfaceProps {
  activeMonthIndex: number
  setActiveMonthIndex: (index: number) => void
}

export const Interface = ({ activeMonthIndex, setActiveMonthIndex }: InterfaceProps) => {
  return (
    <>
      <div style={{
        position: 'absolute',
        top: '40px',
        left: '40px',
        color: 'white',
        fontFamily: 'Inter, sans-serif',
        pointerEvents: 'none', // Let clicks pass through to canvas
        display: 'flex',
        alignItems: 'center',
        gap: '20px'
      }}>
        <img 
          src="/fahr-logo.png" 
          alt="FAHR Logo" 
          style={{ 
            height: '80px', 
            width: 'auto',
            filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.2))',
            borderRadius: '15px'
          }} 
        />
        <div>
          <h1 style={{ margin: 0, fontSize: '2rem', lineHeight: '1.1' }}>AI HR Assistant</h1>
          <p style={{ margin: '5px 0 0 0', opacity: 0.7, fontSize: '1rem' }}>{reportData.title}</p>
        </div>
      </div>

      <div style={{
        position: 'absolute',
        bottom: '50px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '20px',
        zIndex: 10,
        flexWrap: 'wrap',
        justifyContent: 'center',
        width: '100%',
        padding: '0 20px'
      }}>
        {reportData.categories.map((category, index) => (
          <button
            key={category.id}
            onMouseEnter={() => playHoverSound()}
            onClick={() => {
                playClickSound()
                setActiveMonthIndex(index)
            }}
            style={{
              padding: '12px 24px',
              background: activeMonthIndex === index ? '#ffffff' : 'rgba(255, 255, 255, 0.2)',
              color: activeMonthIndex === index ? '#000000' : '#ffffff',
              border: 'none',
              borderRadius: '30px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)',
              minWidth: '120px'
            }}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* AI Agent */}
      <div className="ai-agent-container">
        <img 
          src="/avater.png" 
          alt="AI Agent" 
          className="ai-agent-image"
        />
      </div>
    </>
  )
}
