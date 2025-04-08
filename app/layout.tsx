import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { ServerProvider } from "@/components/server-provider"
import { BottomNav } from "@/components/bottom-nav"
import { SideNav } from "@/components/side-nav"
import { MainContent } from "@/components/main-content"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Coffinated",
  description: "A dark-themed, mobile-friendly Twitter clone",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen`}>        
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={true} storageKey="coffinated-theme">
          <ServerProvider>
            <SideNav />
            <MainContent>
              {children}
              <BottomNav />
            </MainContent>
            <Toaster />
          </ServerProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}