// /lib/auth.ts
import TwitterProvider from "next-auth/providers/twitter";
import type { NextAuthOptions } from "next-auth";
import type { Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";

// Extend the Session and User types to include accessToken and refreshToken
declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    user: {
      name?: string;
      email?: string;
      image?: string;
      accessToken?: string;
      refreshToken?: string;
    };
  }
  interface User {
    accessToken?: string;
    refreshToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    TwitterProvider({
      clientId: process.env.X_CLIENT_ID!,
      clientSecret: process.env.X_CLIENT_SECRET!,
      version: "2.0",
      authorization: {
        url: "https://twitter.com/i/oauth2/authorize",
        params: {
          scope: "tweet.read users.read tweet.write offline.access",
        },
      },
      token: "https://api.twitter.com/2/oauth2/token",
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      try {
        const image = user.image || "https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png";
        const username = user.name;
        await fetch(`${process.env.NEXTAUTH_URL}/api/save-user`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image, username }),
        });
      } catch (error) {
        console.error('Error saving user data:', error);
      }
      return true;
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: false,
      },
    },
  },
};