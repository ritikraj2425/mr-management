"use client"

import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/hooks/use-context'
import { useEffect, useState } from "react"

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Detect if user is on a mobile device
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      const mobileKeywords = ["android", "iphone", "ipad", "mobile"]
      setIsMobile(mobileKeywords.some(keyword => userAgent.includes(keyword)))
    }

    checkMobile()
  }, [])

  return (
    <html lang="en">
      <head>
        <title>MergeFlow</title>
        <meta name="description" content="Created by MR-management team" />
      </head>
      <body>
        <AuthProvider>
          <Toaster />
          {isMobile ? (
            <div style={{
              display: 'flex',
              height: '100vh',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              fontSize: '20px',
              fontWeight: 'bold',
            }}>
              🚧 Website under maintenance for mobile. Will be available soon! 🚧
            </div>
          ) : (
            children
          )}
        </AuthProvider>
      </body>
    </html>
  )
}
