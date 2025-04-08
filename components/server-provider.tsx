"use client"

import type React from "react"

import { createContext, useEffect, useState } from "react"

type ServerContextType = {
  servers: string[]
  currentServer: string | null
  addServer: (server: string) => void
  removeServer: (server: string) => void
  setCurrentServer: (server: string) => void
  isConnected: boolean
}

const defaultServers = ["https://coffinated-server-1.vercel.app", "https://coffinated-server-2.vercel.app"]

export const ServerContext = createContext<ServerContextType>({
  servers: [],
  currentServer: null,
  addServer: () => {},
  removeServer: () => {},
  setCurrentServer: () => {},
  isConnected: true,
})

export function ServerProvider({ children }: { children: React.ReactNode }) {
  const [servers, setServers] = useState<string[]>([])
  const [currentServer, setCurrentServer] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(true)

  useEffect(() => {
    // Load servers from localStorage
    const savedServers = localStorage.getItem("coffinated-servers")
    const savedCurrentServer = localStorage.getItem("coffinated-current-server")

    if (savedServers) {
      setServers(JSON.parse(savedServers))
    } else {
      setServers(defaultServers)
    }

    if (savedCurrentServer) {
      setCurrentServer(savedCurrentServer)
    } else if (defaultServers.length > 0) {
      setCurrentServer(defaultServers[0])
    }
  }, [])

  useEffect(() => {
    // Save to localStorage when changed
    if (servers.length > 0) {
      localStorage.setItem("coffinated-servers", JSON.stringify(servers))
    }

    if (currentServer) {
      localStorage.setItem("coffinated-current-server", currentServer)
    }
  }, [servers, currentServer])

  const addServer = (server: string) => {
    if (!servers.includes(server)) {
      setServers([...servers, server])
    }
  }

  const removeServer = (server: string) => {
    const newServers = servers.filter((s) => s !== server)
    setServers(newServers)

    if (currentServer === server) {
      setCurrentServer(newServers.length > 0 ? newServers[0] : null)
    }
  }

  return (
    <ServerContext.Provider
      value={{
        servers,
        currentServer,
        addServer,
        removeServer,
        setCurrentServer,
        isConnected,
      }}
    >
      {children}
    </ServerContext.Provider>
  )
}
