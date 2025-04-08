"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useServer } from "@/hooks/use-server"
import { io, type Socket } from "socket.io-client"

type SocketContextType = {
  socket: Socket | null
  isConnected: boolean
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
})

export const useSocket = () => useContext(SocketContext)

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const { toast } = useToast()
  const { currentServer } = useServer()

  useEffect(() => {
    if (!currentServer) return

    // Disconnect previous socket if exists
    if (socket) {
      socket.disconnect()
    }

    // Create new socket connection
    const newSocket = io(currentServer, {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })

    newSocket.on("connect", () => {
      setIsConnected(true)
      toast({
        title: "Connected",
        description: `Connected to ${currentServer}`,
        variant: "default",
      })
    })

    newSocket.on("disconnect", () => {
      setIsConnected(false)
      toast({
        title: "Disconnected",
        description: `Disconnected from ${currentServer}`,
        variant: "destructive",
      })
    })

    newSocket.on("connect_error", () => {
      toast({
        title: "Connection Error",
        description: `Failed to connect to ${currentServer}`,
        variant: "destructive",
      })
    })

    setSocket(newSocket)

    return () => {
      newSocket.disconnect()
    }
  }, [currentServer, toast])

  return <SocketContext.Provider value={{ socket, isConnected }}>{children}</SocketContext.Provider>
}
