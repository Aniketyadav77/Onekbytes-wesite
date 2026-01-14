'use client'

import { useEffect, useRef } from 'react'

interface SimpleSplineViewerProps {
  url: string
  className?: string
  style?: React.CSSProperties
}

export default function SimpleSplineViewer({ url, className, style }: SimpleSplineViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Create spline-viewer element directly
    const splineViewer = document.createElement('spline-viewer')
    splineViewer.setAttribute('url', url)
    
    // Apply styles
    if (style) {
      Object.assign(splineViewer.style, style)
    }
    
    // Clear container and add viewer
    containerRef.current.innerHTML = ''
    containerRef.current.appendChild(splineViewer)
    
    // Add error handling
    splineViewer.addEventListener('error', (e) => {
      console.error('Spline viewer error:', e)
      if (containerRef.current) {
        containerRef.current.innerHTML = `
          <div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; color: rgba(255,255,255,0.6); text-align: center;">
            <div>
              <div style="font-size: 2rem; margin-bottom: 0.25rem; animation: pulse 2s infinite;">🚀</div>
              <div style="font-size: 0.75rem; opacity: 0.5;">Loading 3D...</div>
            </div>
          </div>
        `
      }
    })
    
    splineViewer.addEventListener('load', () => {
      console.log('Spline viewer loaded successfully')
    })
  }, [url, style])

  return (
    <div 
      ref={containerRef} 
      className={className} 
      style={style}
    >
      {/* Loading fallback */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        width: '100%', 
        height: '100%', 
        color: 'rgba(255,255,255,0.6)', 
        textAlign: 'center' 
      }}>
        <div>
          <div style={{ fontSize: '2rem', marginBottom: '0.25rem', animation: 'bounce 1s infinite' }}>🌟</div>
          <div style={{ fontSize: '0.75rem', opacity: 0.5 }}>Loading 3D...</div>
        </div>
      </div>
    </div>
  )
}
