// Test script to verify Supabase connection
import { supabase } from './src/lib/supabase.js'

async function testSupabaseConnection() {
  console.log('Testing Supabase connection...')
  
  try {
    // Test 1: Check if we can connect to Supabase
    const { data, error } = await supabase.from('profiles').select('count').limit(1)
    
    if (error) {
      console.error('❌ Connection test failed:', error.message)
      if (error.message.includes('relation "public.profiles" does not exist')) {
        console.log('🔧 The profiles table does not exist. Please run the SQL in database-setup.sql in your Supabase SQL editor.')
      }
    } else {
      console.log('✅ Successfully connected to Supabase')
      console.log('✅ Profiles table exists')
    }
    
    // Test 2: Check authentication configuration
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.error('❌ Auth session test failed:', sessionError.message)
    } else {
      console.log('✅ Auth configuration is working')
      console.log('Current session:', session ? 'Active session found' : 'No active session')
    }
    
    console.log('\n📋 Environment variables:')
    console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing')
    console.log('SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing')
    
  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

testSupabaseConnection()
