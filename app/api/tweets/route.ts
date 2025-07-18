import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.name) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user ID from Xusers table
    const { data: userData, error: userError } = await supabase
      .from('xusers')
      .select('uid')
      .eq('username', session.user.name)
      .single()

    if (userError || !userData) {
      return NextResponse.json({
        error: 'User not found'
      }, { status: 404 })
    }

    // Fetch tweets for this user
    const { data: tweets, error: tweetsError } = await supabase
      .from('user_tweets')
      .select('*')
      .eq('user_id', userData.uid)
      .order('created_at', { ascending: false })

    if (tweetsError) {
      return NextResponse.json({
        error: 'Failed to fetch tweets'
      }, { status: 500 })
    }

    return NextResponse.json({ tweets })

  } catch (error) {
    console.error('Error fetching tweets:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}