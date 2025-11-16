import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Dispatch Harmony Hub',
  description: 'Business Management Dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" className="overflow-x-auto">
      <body className={`${inter.className} overflow-x-auto`}>
        {children}
      </body>
    </html>
  )
}
