import { createRouteHandlerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Callback error:', error)
      return NextResponse.redirect(new URL('/auth/login?error=auth_failed', request.url))
    }
  }

  return NextResponse.redirect(new URL('/dashboard', request.url))
}