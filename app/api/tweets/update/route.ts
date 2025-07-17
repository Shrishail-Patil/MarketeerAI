import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.name) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { tweetId, category, tweet_id, analytics } = await request.json()
    console.log("🔁 PATCH /api/tweets/update →", { tweetId, category, tweet_id, analytics })

    // Basic UUID v4 format check
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (!tweetId || typeof tweetId !== "string" || !uuidRegex.test(tweetId)) {
      return NextResponse.json(
        { error: "Invalid tweet ID (expecting UUID string)" },
        { status: 400 }
      )
    }

    if (!category) {
      return NextResponse.json(
        { error: "Category is required" },
        { status: 400 }
      )
    }

    // Get user ID
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

    // Update tweet
    const updateData: any = {
      category,
      updated_at: new Date().toISOString()
    }

    if (tweet_id) {
      updateData.tweet_id = tweet_id
    }

    if (analytics) {
      updateData.likes = analytics.likes ?? 0;
      updateData.replies = analytics.replies ?? 0;
      updateData.retweets = analytics.retweets ?? 0;
    }

    const { data: updatedTweet, error: updateError } = await supabase
      .from('user_tweets')
      .update(updateData)
      .eq('id', tweetId)
      .eq('user_id', userData.uid)
      .select()
      .maybeSingle()          // ← avoids "single row required" error

    if (updateError) {
      console.error("❌ Supabase update error:", updateError)
      return NextResponse.json(
        { error: "Failed to update tweet", detail: updateError.message },
        { status: 500 }
      )
    }

    if (!updatedTweet) {
      return NextResponse.json(
        { error: "Tweet not found for this user" },
        { status: 404 }
      )
    }

    return NextResponse.json({ tweet: updatedTweet })

  } catch (error) {
    console.error('Error updating tweet:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}