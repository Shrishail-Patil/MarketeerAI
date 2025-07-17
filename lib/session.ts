// lib/session.ts
import { getIronSession } from "iron-session"
import { cookies } from "next/headers"
import { SessionData, TwitterUser } from "../types/auth"

const sessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: "marketeer-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60, // 30 days
    sameSite: "lax" as const,
  },
}

import type { IronSession } from "iron-session"

import { NextRequest, NextResponse } from "next/server"

export async function getSession(req?: NextRequest, res?: NextResponse): Promise<IronSession<SessionData>> {
  // If req/res are not provided, throw an error or handle accordingly
  if (!req || !res) {
    throw new Error("Request and Response objects must be provided to getSession")
  }
  const session = await getIronSession<SessionData>(req, res, sessionOptions)
  return session
}

export async function setUserSession(userData: TwitterUser): Promise<SessionData> {
  const session = await getSession()
  session.user = userData
  await session.save()
  return session
}

export async function clearSession(): Promise<void> {
  const session = await getSession()
  session.destroy()
}

// Twitter API helper functions
export async function makeTwitterRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const session = await getSession()
  
  if (!session.user?.accessToken) {
    throw new Error("No access token available")
  }

  const response = await fetch(`https://api.twitter.com/2/${endpoint}`, {
    headers: {
      "Authorization": `Bearer ${session.user.accessToken}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    if (response.status === 401) {
      // Token might be expired, try to refresh
      try {
        await refreshTwitterToken()
        // Retry the request with new token
        const newSession = await getSession()
        const retryResponse = await fetch(`https://api.twitter.com/2/${endpoint}`, {
          headers: {
            "Authorization": `Bearer ${newSession.user?.accessToken}`,
            "Content-Type": "application/json",
            ...options.headers,
          },
          ...options,
        })
        
        if (!retryResponse.ok) {
          throw new Error(`Twitter API error: ${retryResponse.status}`)
        }
        
        return retryResponse.json()
      } catch (refreshError) {
        throw new Error("Token refresh failed")
      }
    }
    
    throw new Error(`Twitter API error: ${response.status}`)
  }

  return response.json()
}

// Function to refresh Twitter token
export async function refreshTwitterToken(): Promise<any> {
  const session = await getSession()
  
  if (!session.user?.refreshToken) {
    throw new Error("No refresh token available")
  }

  const response = await fetch("https://api.twitter.com/2/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": `Basic ${Buffer.from(
        `${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`
      ).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: session.user.refreshToken,
    }),
  })

  if (!response.ok) {
    throw new Error("Failed to refresh token")
  }

  const tokens = await response.json()
  
  // Update session with new tokens
  if (session.user) {
    session.user.accessToken = tokens.access_token
    if (tokens.refresh_token) {
      session.user.refreshToken = tokens.refresh_token
    }
    await session.save()
  }
  
  return tokens
}