import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/hooks/use-context'


export const metadata: Metadata = {
  title: 'MergeFlow',
  description: 'Created by MR-management team',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <AuthProvider>
      <Toaster />
      <body>{children}</body>
      </AuthProvider>
    </html>
  )
}
