/**
 * Emergency auth recovery component
 * This component can be used to force clear auth state if needed
 */
'use client'

import { useEffect } from 'react'
import { clearAllAuthStorage } from '@/lib/auth-utils'

interface AuthRecoveryProps {
  forceReset?: boolean
}

export const AuthRecovery = ({ forceReset = false }: AuthRecoveryProps) => {
  useEffect(() => {
    if (forceReset) {
      console.log('Force clearing all auth storage')
      clearAllAuthStorage()
      // Reload the page to start fresh
      window.location.reload()
    }
  }, [forceReset])

  return null // This component doesn't render anything
}

export default AuthRecovery
