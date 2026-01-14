'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'

export default function AuthTest() {
  const { user, signUp, signIn, signOut, signInWithGoogle } = useAuth()
  const [email, setEmail] = useState('test@example.com')
  const [password, setPassword] = useState('test123')
  const [fullName, setFullName] = useState('Test User')
  const [result, setResult] = useState('')

  const testSignUp = async () => {
    setResult('Testing signup...')
    try {
      const { data, error } = await signUp(email, password, fullName)
      setResult(`Signup result: ${error ? error.message : 'Success'} - ${JSON.stringify(data)}`)
    } catch (err) {
      setResult(`Signup error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  const testSignIn = async () => {
    setResult('Testing signin...')
    try {
      const { data, error } = await signIn(email, password)
      setResult(`Signin result: ${error ? error.message : 'Success'} - ${JSON.stringify(data)}`)
    } catch (err) {
      setResult(`Signin error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  const testGoogleSignIn = async () => {
    setResult('Testing Google signin...')
    try {
      const { data, error } = await signInWithGoogle()
      setResult(`Google signin result: ${error ? error.message : 'Success'} - ${JSON.stringify(data)}`)
    } catch (err) {
      setResult(`Google signin error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">Authentication Test Page</h1>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Current User:</h2>
          <pre className="bg-gray-100 p-3 rounded text-sm">
            {user ? JSON.stringify(user, null, 2) : 'No user logged in'}
          </pre>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Full Name:</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={testSignUp}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Test Sign Up
          </button>
          <button
            onClick={testSignIn}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Test Sign In
          </button>
          <button
            onClick={testGoogleSignIn}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Test Google Sign In
          </button>
          {user && (
            <button
              onClick={signOut}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Sign Out
            </button>
          )}
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Test Result:</h3>
          <pre className="bg-gray-100 p-3 rounded text-sm whitespace-pre-wrap">
            {result || 'No test run yet'}
          </pre>
        </div>
      </div>
    </div>
  )
}
