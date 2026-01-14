import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  console.log('OAuth callback received:', { 
    code: code ? 'present' : 'missing', 
    error, 
    errorDescription,
    origin 
  })

  if (error) {
    console.error('OAuth error:', error, errorDescription)
    return NextResponse.redirect(`${origin}/signin?error=${encodeURIComponent(errorDescription || error)}`)
  }

  if (code) {
    try {
      console.log('Exchanging code for session...')
      const { data, error: authError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (authError) {
        console.error('Error exchanging code for session:', authError)
        return NextResponse.redirect(`${origin}/signin?error=${encodeURIComponent(authError.message)}`)
      }

      if (data.user) {
        console.log('OAuth authentication successful for user:', data.user.email)
        
        // Check if this is a new user and create profile if needed
        const { data: existingProfile, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('user_id', data.user.id)
          .single()

        if (profileError && profileError.code === 'PGRST116') {
          // Profile doesn't exist, create one
          console.log('Creating profile for new OAuth user:', data.user.email)
          
          const profileData = {
            user_id: data.user.id,
            display_name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || null,
            full_name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || null,
            avatar_url: data.user.user_metadata?.avatar_url || data.user.user_metadata?.picture || null,
            role: 'user' as const,
          }

          const { error: createError } = await supabase
            .from('profiles')
            .insert(profileData)

          if (createError) {
            console.error('Error creating OAuth user profile:', createError)
            // Don't fail the login, just log the error
          } else {
            console.log('OAuth user profile created successfully')
          }
        } else if (existingProfile) {
          console.log('Existing profile found for OAuth user')
        }

        // Successful authentication - redirect to intended page
        const redirectUrl = next.startsWith('/') ? `${origin}${next}` : `${origin}/`
        console.log('Redirecting OAuth user to:', redirectUrl)
        
        return NextResponse.redirect(redirectUrl)
      }
    } catch (error) {
      console.error('OAuth callback exception:', error)
      return NextResponse.redirect(`${origin}/signin?error=${encodeURIComponent('Authentication failed')}`)
    }
  }

  // No code and no error - this shouldn't happen
  console.warn('OAuth callback received without code or error')
  return NextResponse.redirect(`${origin}/signin?error=${encodeURIComponent('Invalid authentication response')}`)
}
