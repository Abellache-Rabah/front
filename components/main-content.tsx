"use client"

import { ReactNode, useEffect, useState } from "react"
import { cn } from "@/lib/utils"

type MainContentProps = {
  children: ReactNode
}

export function MainContent({ children }: MainContentProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    // Get sidebar state from localStorage
    const savedState = localStorage.getItem("sidebar-collapsed")
    if (savedState) {
      setIsExpanded(savedState !== "true")
    }
  }, [])

  if (!isMounted) {
    // Return a placeholder with no margin until client-side code runs
    return (
      <main className="bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 min-h-screen transition-colors duration-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-4 md:pt-6">
          {children}
        </div>
      </main>
    )
  }

  return (
    <main 
      className={cn(
        "bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 min-h-screen transition-colors duration-200",
        "md:ml-16", // Default padding for collapsed sidebar
        isExpanded ? "md:ml-64" : "md:ml-16" // Adjust based on sidebar state
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-4 md:pt-6">
        {children}
      </div>
    </main>
  )
}