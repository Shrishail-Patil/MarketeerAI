// app/api/post-analytic/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route";

// X endpoint for post-level analytics (official endpoint)
const X_ANALYTICS_URL = "https://api.twitter.com/2/tweets/analytics"

// Available analytics fields based on official docs
const AVAILABLE_ANALYTICS_FIELDS = [
  "app_install_attempts",
  "app_opens", 
  "detail_expands",
  "email_tweet",
  "engagements",
  "follows",
  "hashtag_clicks",
  "impressions",
  "likes",
  "link_clicks",
  "media_engagements",
  "media_views",
  "permalink_clicks",
  "profile_visits",
  "quote_tweets",
  "replies",
  "retweets",
  "url_clicks",
  "user_profile_clicks"
] as const

// Default metrics we care about
const DEFAULT_FIELDS = [
  "impressions",
  "likes",
  "replies",
  "retweets",
  "quote_tweets",
  "engagements",
  "media_views",
  "link_clicks"
] as const

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    /** --- Parse & validate payload ------------------------------------------------ */
    const body = await req.json()
    let { tweetIds, start_time, end_time, fields, granularity } = body as {
      tweetIds: string | string[]
      start_time: string
      end_time: string
      fields?: string[]
      granularity?: "hourly" | "daily" | "weekly" | "total"
    }

    // Validate required tweetIds
    if (!tweetIds || (Array.isArray(tweetIds) && tweetIds.length === 0)) {
      return NextResponse.json(
        { error: "`tweetIds` (string | string[]) is required" },
        { status: 400 },
      )
    }

    // Validate required start_time and end_time
    if (!start_time || !end_time) {
      return NextResponse.json(
        { error: "Both `start_time` and `end_time` are required (YYYY-MM-DDTHH:mm:ssZ format)" },
        { status: 400 },
      )
    }

    // Validate timestamp format
    const timeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/
    if (!timeRegex.test(start_time) || !timeRegex.test(end_time)) {
      return NextResponse.json(
        { error: "Invalid timestamp format. Use YYYY-MM-DDTHH:mm:ssZ format" },
        { status: 400 },
      )
    }

    // Process and validate tweet IDs
    const ids = (Array.isArray(tweetIds) ? tweetIds : [tweetIds])
      .map(String)
      .filter(Boolean)
      .slice(0, 100) // API limit: 1-100 elements

    if (ids.length === 0) {
      return NextResponse.json(
        { error: "At least one valid tweet ID is required" },
        { status: 400 },
      )
    }

    // Validate analytics fields if provided
    const requestedFields = fields?.length ? fields : DEFAULT_FIELDS
    const invalidFields = requestedFields.filter(field => 
      !AVAILABLE_ANALYTICS_FIELDS.includes(field as any)
    )
    
    if (invalidFields.length > 0) {
      return NextResponse.json(
        { 
          error: `Invalid analytics fields: ${invalidFields.join(", ")}`,
          availableFields: AVAILABLE_ANALYTICS_FIELDS
        },
        { status: 400 },
      )
    }

    /** --- Build query params (all required according to docs) -------------------- */
    const params = new URLSearchParams({
      ids: ids.join(","),
      start_time,
      end_time,
      granularity: granularity ?? "total",
      "analytics.fields": requestedFields.join(","),
    })

    /** --- Call X Analytics API ---------------------------------------------------- */
    console.log(`🔍 Fetching analytics for ${ids.length} tweets from ${start_time} to ${end_time}`)
    
    const res = await fetch(`${X_ANALYTICS_URL}?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
    })

    const data = await res.json()

    if (!res.ok) {
      console.error("❌ Twitter analytics error:", {
        status: res.status,
        statusText: res.statusText,
        data
      })
      
      // Handle specific error cases
      if (data.reason === "client-not-enrolled") {
        return NextResponse.json({ 
          error: "Twitter app not properly configured for analytics access",
          message: "Your app needs to be attached to a project with appropriate API access level",
          details: data,
          helpUrl: "https://developer.twitter.com/en/docs/projects/overview"
        }, { status: 403 })
      }

      if (res.status === 401) {
        return NextResponse.json({
          error: "Authentication failed",
          message: "Invalid or expired access token",
          details: data
        }, { status: 401 })
      }

      if (res.status === 429) {
        return NextResponse.json({
          error: "Rate limit exceeded",
          message: "Too many requests. Please try again later.",
          details: data
        }, { status: 429 })
      }

      return NextResponse.json({ 
        error: "Twitter API error", 
        details: data 
      }, { status: res.status })
    }

    /** --- Success response -------------------------------------------------------- */
    console.log("✅ Successfully fetched Twitter analytics")
    
    return NextResponse.json({ 
      success: true, 
      analytics: data,
      metadata: {
        tweetCount: ids.length,
        timeRange: { start_time, end_time },
        granularity: granularity ?? "total",
        fields: requestedFields
      }
    })

  } catch (error) {
    console.error("❌ Internal server error:", error)
    
    return NextResponse.json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error occurred"
    }, { status: 500 })
  }
}