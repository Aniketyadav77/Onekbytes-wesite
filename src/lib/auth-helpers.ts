/**
 * Authentication utilities for handling edge cases, retries, and security
 */

// Rate limiting for authentication attempts
const authAttempts = new Map<string, { count: number; lastAttempt: number }>()

const RATE_LIMIT_WINDOW = 15 * 60 * 1000 // 15 minutes
const MAX_ATTEMPTS = 5

/**
 * Check if authentication attempt should be rate limited
 */
export function checkRateLimit(identifier: string): { allowed: boolean; waitTime?: number } {
  const now = Date.now()
  const attempts = authAttempts.get(identifier)

  if (!attempts) {
    authAttempts.set(identifier, { count: 1, lastAttempt: now })
    return { allowed: true }
  }

  // Reset count if window has passed
  if (now - attempts.lastAttempt > RATE_LIMIT_WINDOW) {
    authAttempts.set(identifier, { count: 1, lastAttempt: now })
    return { allowed: true }
  }

  // Check if limit exceeded
  if (attempts.count >= MAX_ATTEMPTS) {
    const waitTime = RATE_LIMIT_WINDOW - (now - attempts.lastAttempt)
    return { allowed: false, waitTime }
  }

  // Increment count
  attempts.count++
  attempts.lastAttempt = now
  authAttempts.set(identifier, attempts)
  
  return { allowed: true }
}

/**
 * Clear rate limit for successful authentication
 */
export function clearRateLimit(identifier: string): void {
  authAttempts.delete(identifier)
}

/**
 * Retry function with exponential backoff
 */
export async function retryAuthOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error as Error
      
      // Don't retry on certain errors
      if (
        lastError.message.includes('Invalid login credentials') ||
        lastError.message.includes('User already registered') ||
        lastError.message.includes('Email not confirmed')
      ) {
        throw lastError
      }

      if (attempt === maxRetries) {
        throw lastError
      }

      // Exponential backoff
      const delay = baseDelay * Math.pow(2, attempt)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  throw lastError!
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (password.length < 6) {
    errors.push('Password must be at least 6 characters long')
  }

  // Basic strength check - at least one letter and one number
  if (!/[a-zA-Z]/.test(password)) {
    errors.push('Password must contain at least one letter')
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Generate secure random state for OAuth
 */
export function generateOAuthState(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

/**
 * Check if error is network related
 */
export function isNetworkError(error: Error): boolean {
  return (
    error.message.includes('fetch') ||
    error.message.includes('network') ||
    error.message.includes('timeout') ||
    error.message.includes('connection')
  )
}

/**
 * Format authentication error for user display
 */
export function formatAuthError(error: Error): string {
  const message = error.message.toLowerCase()

  if (message.includes('invalid login credentials')) {
    return 'Invalid email or password. Please check your credentials and try again.'
  }

  if (message.includes('email not confirmed')) {
    return 'Please check your email and click the confirmation link before signing in.'
  }

  if (message.includes('user already registered')) {
    return 'An account with this email already exists. Try signing in instead.'
  }

  if (message.includes('too many requests')) {
    return 'Too many attempts. Please wait a few minutes before trying again.'
  }

  if (message.includes('weak password')) {
    return 'Password is too weak. Please use a stronger password with at least 8 characters.'
  }

  if (isNetworkError(error)) {
    return 'Network error. Please check your connection and try again.'
  }

  // Generic fallback
  return 'Authentication failed. Please try again.'
}
