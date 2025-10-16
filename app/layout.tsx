import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Collaborative Whiteboard',
  description: 'A real-time collaborative whiteboard for teams',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

