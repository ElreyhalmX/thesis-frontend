import { motion } from 'framer-motion'
import { Apple, Carrot, ChefHat, Coffee, Pizza } from 'lucide-react'
import { useMemo } from 'react'

// Array of icons to float in the background
const icons = [ChefHat, Carrot, Apple, Pizza, Coffee]

export default function FloatingBackground() {
  // Generate random particles once
  const particles = useMemo(() => {
    return [...Array(20)].map((_, i) => ({
      Icon: icons[i % icons.length],
      initialX: Math.random() * 100, // Percentage 0-100
      initialY: Math.random() * 100, // Percentage 0-100
      size: 30 + Math.random() * 40,
      duration: 15 + Math.random() * 20, // Slower, more gentle
      delay: Math.random() * 5,
      // Random movement ranges
      moveX: Math.random() * 60 - 30, 
      moveY: Math.random() * 60 - 30,
    }))
  }, []) // Empty dependency array ensures this runs only once per mount

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        overflow: 'hidden',
        pointerEvents: 'none',
        background: 'radial-gradient(circle at 50% 50%, var(--color-muted) 0%, var(--color-background) 100%)'
      }}
    >
      {particles.map((particle, i) => {
        const { Icon, initialX, initialY, size, duration, delay, moveX, moveY } = particle
        
        return (
          <motion.div
            key={i}
            initial={{ 
              opacity: 0, 
              left: `${initialX}%`, 
              top: `${initialY}%`
            }}
            animate={{ 
              opacity: [0.4, 0.7, 0.4], 
              // Float around the initial position
              x: [0, moveX, 0],
              y: [0, moveY, 0],
              rotate: [0, 180, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration, 
              repeat: Infinity, 
              delay,
              ease: "easeInOut"
            }}
            style={{
              position: 'absolute',
              color: 'var(--color-primary)',
            }}
          >
            <Icon size={size} />
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
          opacity: 0.1
        }}
      />
    </div>
  )
}
