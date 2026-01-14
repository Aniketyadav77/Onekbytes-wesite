'use client'

import { useEffect, useRef, useState } from 'react'

interface SplineViewerProps {
  url: string
  className?: string
  style?: React.CSSProperties
}

export default function SplineViewer({ url, className, style }: SplineViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadSplineViewer = async () => {
      try {
        // Check if spline-viewer is already loaded
        if (customElements.get('spline-viewer')) {
          setIsLoaded(true)
          createSplineViewer()
          return
        }

        // Load the spline-viewer using dynamic import
        // Note: @splinetool/viewer is optional, falls back to CDN loading
        
        // Wait for custom elements to be ready
        if (!customElements.get('spline-viewer')) {
          await customElements.whenDefined('spline-viewer')
        }
        
        setIsLoaded(true)
        createSplineViewer()
      } catch (err) {
        console.error('Failed to load Spline viewer:', err)
        // Fallback to CDN loading
        loadFromCDN()
      }
    }

    const loadFromCDN = () => {
      // Check if script is already loaded
      if (document.querySelector('script[src*="@splinetool/viewer"]')) {
        if (customElements.get('spline-viewer')) {
          setIsLoaded(true)
          createSplineViewer()
          return
        }
      }

      const script = document.createElement('script')
      script.type = 'module'
      script.src = 'https://unpkg.com/@splinetool/viewer@1.10.40/build/spline-viewer.js'
      
      script.onload = async () => {
        try {
          await customElements.whenDefined('spline-viewer')
          setIsLoaded(true)
          createSplineViewer()
        } catch (err) {
          console.error('Failed to define spline-viewer:', err)
          setError('Failed to load 3D animation')
        }
      }
      
      script.onerror = () => {
        console.error('Failed to load Spline viewer script')
        setError('Failed to load 3D animation')
      }
      
      document.head.appendChild(script)
    }

    const createSplineViewer = () => {
      if (containerRef.current) {
        // Clear the container
        containerRef.current.innerHTML = ''
        
        // Create the spline-viewer element
        const splineViewer = document.createElement('spline-viewer')
        splineViewer.setAttribute('url', url)
        
        // Apply styles if provided
        if (style) {
          Object.assign(splineViewer.style, style)
        }
        
        containerRef.current.appendChild(splineViewer)
      }
    }

    loadSplineViewer()
  }, [url, style])

  if (error) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={style}>
        <div className="text-white/60 text-center animate-pulse">
          <div className="text-4xl mb-1">🚀</div>
          <div className="text-xs opacity-50">3D Loading...</div>
        </div>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={style}>
        <div className="text-white/60 text-center">
          <div className="animate-bounce text-4xl mb-1">🌟</div>
          <div className="text-xs opacity-50">Loading 3D...</div>
        </div>
      </div>
    )
  }

  return (
    <div 
      ref={containerRef} 
      className={className} 
      style={style}
    />
  )
}
