import type { Metadata } from 'next'
import './globals.css'

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
      <body>{children}</body>
    </html>
  )
}
