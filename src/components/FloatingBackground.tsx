import { motion } from 'framer-motion'
import { Apple, Carrot, ChefHat, Coffee, Pizza } from 'lucide-react'

// Array of icons to float in the background
const icons = [ChefHat, Carrot, Apple, Pizza, Coffee]

export default function FloatingBackground() {
  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        overflow: 'hidden',
        pointerEvents: 'none',
        background: 'radial-gradient(circle at 50% 50%, var(--color-muted) 0%, var(--color-background) 100%)'
      }}
    >
      {/* Generate 15 floating icons with random positions and animation parameters */}
      {[...Array(15)].map((_, i) => {
        const Icon = icons[i % icons.length]
        const delay = i * 0.5
        const duration = 10 + Math.random() * 10
        
        return (
          <motion.div
            key={i}
            initial={{ 
              opacity: 0, 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight 
            }}
            animate={{ 
              opacity: [0.03, 0.08, 0.03], 
              y: [0, -100, 0],
              x: [0, Math.random() * 50 - 25, 0],
              rotate: [0, 360]
            }}
            transition={{ 
              duration, 
              repeat: Infinity, 
              delay,
              ease: "linear"
            }}
            style={{
              position: 'absolute',
              color: 'var(--color-primary)',
            }}
          >
            <Icon size={30 + Math.random() * 40} />
          </motion.div>
        )
      })}
      
      {/* Texture overlay for premium feel */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
          opacity: 0.5
        }}
      />
    </div>
  )
}
