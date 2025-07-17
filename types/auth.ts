// types/auth.ts
import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken?: string
    refreshToken?: string
    username?: string
    userId?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    refreshToken?: string
    username?: string
    userId?: string
  }
}

export interface TwitterUser {
  id: string
  username: string
  name: string
  image?: string
  accessToken: string
  refreshToken?: string
  isAuthenticated: boolean
}

export interface TwitterTweet {
  id: string
  text: string
  created_at: string
  public_metrics: {
    retweet_count: number
    like_count: number
    reply_count: number
    quote_count: number
  }
  author_id: string
}

export interface TwitterApiResponse<T> {
  data: T
  meta?: {
    result_count: number
    next_token?: string
  }
}

export interface SessionData {
  user?: TwitterUser
}