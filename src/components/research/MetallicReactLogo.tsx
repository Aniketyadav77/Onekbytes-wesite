'use client'

import { motion } from 'framer-motion'
import React from 'react'

type Props = {
  size?: number
  className?: string
  rotateSeconds?: number
}

export default function MetallicReactLogo({ size = 96, className = '', rotateSeconds = 12 }: Props) {
  const viewBoxSize = 100
  const strokeWidth = 6 // Increased for a bolder look

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
      className={className}
      initial={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, ease: 'linear', duration: rotateSeconds }}
    >
      <defs>
        {/* More complex metallic silver gradient for a brushed metal effect */}
        <linearGradient id="metallic" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d1d5db" />
          <stop offset="10%" stopColor="#f9fafb" />
          <stop offset="25%" stopColor="#d1d5db" />
          <stop offset="40%" stopColor="#9ca3af" />
          <stop offset="50%" stopColor="#6b7280" />
          <stop offset="60%" stopColor="#9ca3af" />
          <stop offset="75%" stopColor="#d1d5db" />
          <stop offset="90%" stopColor="#f9fafb" />
          <stop offset="100%" stopColor="#d1d5db" />
        </linearGradient>

        {/* Gradient for the central sphere to give it a 3D look */}
        <radialGradient id="core" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stopColor="#f9fafb" />
          <stop offset="50%" stopColor="#e5e7eb" />
          <stop offset="95%" stopColor="#6b7280" />
          <stop offset="100%" stopColor="#4b5563" />
        </radialGradient>
      </defs>

      {/* Outer atom rings */}
      <g stroke="url(#metallic)" strokeWidth={strokeWidth} fill="none">
        {/* Horizontal ring */}
        <ellipse cx="50" cy="50" rx="40" ry="15" />
        {/* Tilted ring 1 */}
        <ellipse cx="50" cy="50" rx="40" ry="15" transform="rotate(60 50 50)" />
        {/* Tilted ring 2 */}
        <ellipse cx="50" cy="50" rx="40" ry="15" transform="rotate(-60 50 50)" />
      </g>

      {/* Center core */}
      <circle cx="50" cy="50" r="10" fill="url(#core)" stroke="#4b5563" strokeWidth={0.5} />
    </motion.svg>
  )
}
