// lib/twitter-service.ts
import { TwitterTweet, TwitterApiResponse } from "../types/auth"

class TwitterService {
  private baseUrl = "/api/twitter"

  async fetchUserTweets(limit: number = 10): Promise<TwitterApiResponse<TwitterTweet[]>> {
    const response = await fetch(`${this.baseUrl}/tweets?limit=${limit}`)
    if (!response.ok) {
      throw new Error("Failed to fetch tweets")
    }
    return response.json()
  }

  async postTweet(text: string, scheduledAt?: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/post`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        scheduled_at: scheduledAt,
      }),
    })
    
    if (!response.ok) {
      throw new Error("Failed to post tweet")
    }
    return response.json()
  }

  async getTweetAnalytics(tweetId: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/analytics?tweet_id=${tweetId}`)
    if (!response.ok) {
      throw new Error("Failed to fetch analytics")
    }
    return response.json()
  }

  async scheduleTweet(text: string, scheduledAt: string): Promise<any> {
    return this.postTweet(text, scheduledAt)
  }
}

export const twitterService = new TwitterService()

// React hook for Twitter operations
import { useState, useCallback } from "react"

interface UseTwitterReturn {
  loading: boolean
  error: string | null
  fetchTweets: (limit?: number) => Promise<TwitterApiResponse<TwitterTweet[]>>
  postTweet: (text: string, scheduledAt?: string) => Promise<any>
  getAnalytics: (tweetId: string) => Promise<any>
}

export function useTwitter(): UseTwitterReturn {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const execute = useCallback(async <T>(operation: () => Promise<T>): Promise<T> => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await operation()
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchTweets = useCallback((limit?: number) => {
    return execute(() => twitterService.fetchUserTweets(limit))
  }, [execute])

  const postTweet = useCallback((text: string, scheduledAt?: string) => {
    return execute(() => twitterService.postTweet(text, scheduledAt))
  }, [execute])

  const getAnalytics = useCallback((tweetId: string) => {
    return execute(() => twitterService.getTweetAnalytics(tweetId))
  }, [execute])

  return {
    loading,
    error,
    fetchTweets,
    postTweet,
    getAnalytics,
  }
}