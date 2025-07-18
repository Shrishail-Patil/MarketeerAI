// app/layout.tsx
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import AuthSessionProvider from "..//components/session-provider"
import "./globals.css"
import { Analytics } from "@vercel/analytics/next"
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Marketeer - AI-Powered Twitter Marketing",
  description: "Generate authentic tweets with AI that learns your unique voice",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Analytics />
        <AuthSessionProvider>
          {children}
        </AuthSessionProvider>
      </body>
    </html>
  )
}