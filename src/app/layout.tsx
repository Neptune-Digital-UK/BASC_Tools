import type { Metadata } from 'next'
import { Manrope } from 'next/font/google'
import './globals.css'

const manrope = Manrope({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BASC Tools - Horse Coverage Eligibility',
  description: 'Client-facing eligibility wizard for Bascule\'s Major Medical insurance (Sport & Western horses)',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={manrope.className}>
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}
