'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { validateEmail, validatePassword, checkRateLimit, clearRateLimit } from '@/lib/auth-helpers'

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { signUp, signInWithGoogle, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push('/')
    }
  }, [user, router])

  // Check for OAuth errors in URL parameters
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const oauthError = urlParams.get('error')
      if (oauthError) {
        setError(decodeURIComponent(oauthError))
        // Clean up the URL
        const cleanUrl = window.location.pathname
        window.history.replaceState({}, '', cleanUrl)
      }
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Validate email format
      if (!validateEmail(email)) {
        throw new Error('Please enter a valid email address')
      }

      // Validate password strength
      const passwordValidation = validatePassword(password)
      if (!passwordValidation.valid) {
        throw new Error(passwordValidation.errors[0])
      }

      // Check rate limiting
      const rateCheck = checkRateLimit(email)
      if (!rateCheck.allowed) {
        const waitMinutes = Math.ceil(rateCheck.waitTime! / (1000 * 60))
        throw new Error(`Too many signup attempts. Please wait ${waitMinutes} minutes before trying again.`)
      }

      console.log('Attempting signup for:', email, 'with name:', fullName)
      const { data, error } = await signUp(email, password, fullName)
      console.log('Signup result:', { data, error })
      
      if (error) {
        console.error('Signup error:', error)
        // Use the actual error message instead of formatted one for better debugging
        setError(error.message || 'Signup failed')
      } else if (data) {
        console.log('Signup successful!')
        clearRateLimit(email)
        setError('')
        alert('Account created successfully!')
        router.push('/signin')
      }
    } catch (err) {
      console.error('Signup exception:', err)
      // Use the actual error message for better debugging
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setError('')
    setLoading(true)
    
    try {
      console.log('Attempting Google signup')
      const { data, error } = await signInWithGoogle()
      console.log('Google signup result:', { data, error })
      
      if (error) {
        console.error('Google signup error:', error)
        // Use the actual error message for better debugging
        setError(error.message || 'Google signup failed')
        setLoading(false)
      } else {
        // On success, user will be redirected to Google OAuth page
        // Loading state will be maintained until redirect
        console.log('Google OAuth initiated, redirecting...')
      }
    } catch (err) {
      console.error('Google signup exception:', err)
      // Use the actual error message for better debugging
      setError(err instanceof Error ? err.message : 'Google signup failed')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex -mt-16">
      {/* Back to Home Button */}
      {/* <Link 
        href="/"
        className="fixed top-8 left-8 px-6 py-2.5 border border-white/20 rounded-full text-white text-sm hover:bg-white/5 transition-colors flex items-center gap-2 z-50"
      >
        <span>←</span>
        <span>Back to Home</span>
      </Link> */}

      {/* Left Side - Black Background with Form */}
      <div className="relative w-full lg:w-1/2 bg-black flex items-center justify-center p-8">
        {/* Top Center Logo */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2">
          <Image
            src="/images/logo2.png"
            alt="OneKbyte Logo"
            width={200}
            height={200}
            priority
          />
        </div>
        <motion.div
          className="w-full max-w-md mt-38"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              Sign Up
            </h2>
            <p className="text-gray-400 text-sm">
              Enter your information below to create your account
            </p>
          </div>
          
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 text-red-200 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-5">
              <div>
                <label htmlFor="fullName" className="block text-xs font-medium text-white mb-1">
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="block w-full px-4 py-3 bg-[#0D0D0D] border border-white/10 rounded-lg placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-xs font-medium text-white mb-1">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full px-4 py-3 bg-[#0D0D0D] border border-white/10 rounded-lg placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="m@example.com"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-xs font-medium text-white mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full px-4 py-3 pr-12 bg-[#0D0D0D] border border-white/10 rounded-lg placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-500 hover:text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-500 hover:text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-[#5B4B8A] hover:bg-[#6B5B9A] text-white text-xs font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mx-auto"></div>
                ) : (
                  'Sign Up'
                )}
              </button>
              
              <button
                type="button"
                onClick={handleGoogleSignUp}
                disabled={loading}
                className="w-full py-3 px-4 bg-transparent border border-white/10 text-white text-xs font-medium rounded-lg hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {loading ? 'Signing up...' : 'Sign up with Google'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Already have an account?{' '}
              <Link
                href="/signin"
                className="text-white underline hover:text-gray-300"
              >
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Right Side - Purple Gradient Background with Card */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center pt-6 pb-10 px-10 min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(90deg, #c8add0 0%, #240a34 100%)' }}>
        {/* Decorative moon/circle in top left */}
        <div className="absolute top-16 left-16 w-40 h-40 bg-gradient-to-br from-white/50 to-white/25 rounded-full blur-3xl"></div>
        
        <motion.div
          className="relative bg-black rounded-3xl p-10 w-full max-w-sm shadow-2xl z-10 border border-white/10"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Starfield background */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl">
            {/* Dense starfield */}
            <div className="absolute top-6 right-10 w-1.5 h-1.5 bg-white rounded-full opacity-80 shadow-lg"></div>
            <div className="absolute top-10 right-6 w-1 h-1 bg-white rounded-full opacity-60"></div>
            <div className="absolute top-14 left-14 w-1 h-1 bg-white rounded-full opacity-70"></div>
            <div className="absolute top-20 right-28 w-1 h-1 bg-white rounded-full opacity-50"></div>
            <div className="absolute top-32 right-20 w-1.5 h-1.5 bg-white rounded-full opacity-75 shadow-lg"></div>
            <div className="absolute top-40 left-6 w-1 h-1 bg-white rounded-full opacity-60"></div>
            <div className="absolute top-48 right-14 w-1 h-1 bg-white rounded-full opacity-70"></div>
            <div className="absolute top-56 left-20 w-1 h-1 bg-white rounded-full opacity-55"></div>
            <div className="absolute top-64 right-40 w-1 h-1 bg-white rounded-full opacity-65"></div>
            <div className="absolute bottom-32 left-6 w-1.5 h-1.5 bg-white rounded-full opacity-80 shadow-lg"></div>
            <div className="absolute bottom-28 right-10 w-1 h-1 bg-white rounded-full opacity-70"></div>
            <div className="absolute bottom-24 left-32 w-1 h-1 bg-white rounded-full opacity-60"></div>
            <div className="absolute bottom-20 right-24 w-1 h-1 bg-white rounded-full opacity-75"></div>
            <div className="absolute bottom-16 right-32 w-1 h-1 bg-white rounded-full opacity-60"></div>
            <div className="absolute bottom-12 left-14 w-1 h-1 bg-white rounded-full opacity-70"></div>
            <div className="absolute bottom-8 right-20 w-1 h-1 bg-white rounded-full opacity-55"></div>
          </div>
          
          {/* Astronaut Illustration */}
          <div className="text-center mb-6 relative z-20">
            <div className="relative mx-auto w-74 h-74 flex items-center justify-center">
              <video 
                autoPlay 
                loop 
                muted 
                className="w-full h-full object-contain"
              >
                <source src="/videos/New_Astronaut_Animation.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
          
          <div className="text-center relative z-20">
            <h3 className="text-2xl font-bold text-white mb-6">
              We&apos;re on Social Media
            </h3>
            <div className="flex justify-center gap-5">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-11 h-11 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 cursor-pointer backdrop-blur-sm border border-white/15 hover:border-white/30 hover:scale-110">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/>
                  <path d="M5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z"/>
                </svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-11 h-11 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 cursor-pointer backdrop-blur-sm border border-white/15 hover:border-white/30 hover:scale-110">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7a10.6 10.6 0 01-9.5-4.5z"/>
                </svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-11 h-11 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 cursor-pointer backdrop-blur-sm border border-white/15 hover:border-white/30 hover:scale-110">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
