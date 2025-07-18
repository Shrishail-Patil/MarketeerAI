// app/api/twitter/tweets/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { TwitterApiResponse, TwitterTweet } from "../../../../types/auth"
import { authOptions } from '@/lib/auth';
import { makeTwitterRequest } from "../../../../lib/session"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = searchParams.get("limit") || "10"
    
    // Fetch user's tweets with analytics
    const tweets = await makeTwitterRequest<TwitterApiResponse<TwitterTweet[]>>(
      `users/${session.userId}/tweets?max_results=${limit}&tweet.fields=public_metrics,created_at,context_annotations&expansions=author_id`
    )

    return NextResponse.json(tweets)
  } catch (error) {
    console.error("Error fetching tweets:", error)
    return NextResponse.json(
      { error: "Failed to fetch tweets" }, 
      { status: 500 }
    )
  }
}

// app/api/twitter/post/route.ts
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const body = await request.json()
    const { text, scheduled_at }: { text: string; scheduled_at?: string } = body

    if (!text) {
      return NextResponse.json(
        { error: "Tweet text is required" }, 
        { status: 400 }
      )
    }

    // If scheduled_at is provided, store for later processing
    if (scheduled_at) {
      // Here you would typically save to database for scheduled posting
      return NextResponse.json({ 
        message: "Tweet scheduled successfully",
        scheduled_at 
      })
    }

    const response = await makeTwitterRequest("tweets", {
      method: "POST",
      body: JSON.stringify({ text }),
    })

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error posting tweet:", error)
    return NextResponse.json(
      { error: "Failed to post tweet" }, 
      { status: 500 }
    )
  }
}

// app/api/twitter/analytics/route.ts  
export async function getAnalytics(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const tweetId = searchParams.get("tweet_id")

    if (!tweetId) {
      return NextResponse.json(
        { error: "Tweet ID is required" }, 
        { status: 400 }
      )
    }

    const analytics = await makeTwitterRequest(
      `tweets/${tweetId}?tweet.fields=public_metrics,non_public_metrics,organic_metrics`
    )

    return NextResponse.json(analytics)
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json(
      { error: "Failed to fetch analytics" }, 
      { status: 500 }
    )
  }
}