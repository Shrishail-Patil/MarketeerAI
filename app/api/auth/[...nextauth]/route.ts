// app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";
export const authOptions = {
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
    async signIn({ user, account, profile }) {
      // This runs when user successfully signs in
      try {
        const image = user.image || "https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png";
        const username = user.name;

        // Make API call to save user data
        const response = await fetch(`${process.env.NEXTAUTH_URL}/api/save-user`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image,
            username,
          }),
        });

        if (!response.ok) {
          console.error('Failed to save user data:', await response.text());
        }
      } catch (error) {
        console.error('Error saving user data:', error);
      }

      return true; // Allow sign in to continue
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
      }
      return token;
    },
    async session({ session, token }) {
      // console.log(session.user.name);
      // console.log(session.user.image);
      
      // Attach access and refresh tokens to the session
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
        sameSite: "lax" as "lax",
        path: "/",
        secure: false, // Important: false for localhost
      },
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
export const OPTIONS = handler;