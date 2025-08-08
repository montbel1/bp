import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SimpleAuthProvider } from "@/components/providers/simple-auth-provider"
import { Navigation } from "@/components/layout/navigation"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Avanee Books Pro",
  description: "A modern accounting application built with Next.js",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SimpleAuthProvider>
          <div className="min-h-screen bg-gray-50">
            <div className="flex">
              <Navigation className="fixed left-0 top-0 h-full z-40" />
              <main className="flex-1 lg:ml-64">
                {children}
              </main>
            </div>
          </div>
          <Toaster />
        </SimpleAuthProvider>
      </body>
    </html>
  )
}
