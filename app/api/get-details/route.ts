import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role key for server-side operations
)

export async function GET(request: NextRequest) {
  try {
    // Get the session to extract username
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized - No active session' },
        { status: 401 }
      )
    }

    // Extract username from session (adjust based on your session structure)
    const username = session.user.email || session.user.name || session.user.username
    
    if (!username) {
      return NextResponse.json(
        { error: 'Username not found in session' },
        { status: 400 }
      )
    }

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('uid')
      .eq('username', username)
      .single()

    if (userError || !userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const { uid } = userData

      

    // Fetch data from Supabase
    const { data, error } = await supabase
      .from('user-data')
      .select('json_data')
      .eq('uid', uid)
      .single() // Use single() if you expect only one row

    if (error) {
      console.error('Supabase error:', error)
      
      // Handle specific error cases
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'No data found for this user' },
          { status: 404 }
        )
      }
      
      return NextResponse.json(
        { error: 'Failed to fetch user data' },
        { status: 500 }
      )
    }

    // Return the json_data
    return NextResponse.json({
      success: true,
      data: data.json_data,
      username: username
    })

  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}