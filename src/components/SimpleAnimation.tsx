'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

interface SimpleAnimationProps {
  className?: string
  style?: React.CSSProperties
}

export default function SimpleAnimation({ className, style }: SimpleAnimationProps) {
  const [isClient, setIsClient] = useState(false)

  // Predefined particle positions to avoid any randomness
  const particles = [
    { id: 0, x: 10, y: 15, delay: 0, duration: 3 },
    { id: 1, x: 45, y: 8, delay: 0.3, duration: 3.5 },
    { id: 2, x: 25, y: 50, delay: 0.6, duration: 4 },
    { id: 3, x: 55, y: 35, delay: 0.9, duration: 3.2 },
    { id: 4, x: 8, y: 40, delay: 1.2, duration: 3.8 },
    { id: 5, x: 40, y: 20, delay: 1.5, duration: 3.3 }
  ]

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <div className={`flex items-center justify-center ${className}`} style={style}>
      <motion.div
        className="relative"
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <motion.div
          className="text-4xl"
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          🚀
        </motion.div>
      </motion.div>
      
      {/* Floating particles - only render on client */}
      {isClient && (
        <div className="absolute inset-0 overflow-hidden">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-1 h-1 bg-white/30 rounded-full"
              initial={{
                x: particle.x,
                y: particle.y,
                opacity: 0
              }}
              animate={{
                x: [particle.x, particle.x + 20, particle.x],
                y: [particle.y, particle.y + 15, particle.y],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.delay,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
