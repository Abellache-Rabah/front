"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

type SidebarContextType = {
  isExpanded: boolean
  toggleSidebar: () => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    // Load saved preference from localStorage
    const savedState = localStorage.getItem("sidebar-collapsed")
    if (savedState) {
      setIsExpanded(savedState !== "true")
    }
  }, [])

  const toggleSidebar = () => {
    const newState = !isExpanded
    setIsExpanded(newState)
    // Save preference
    localStorage.setItem("sidebar-collapsed", String(!newState))
  }

  // Avoid hydration mismatch by rendering only on client
  if (!isMounted) {
    return <>{children}</>
  }

  return (
    <SidebarContext.Provider value={{ isExpanded, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}