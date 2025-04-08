"use client"

import { useContext } from "react"
import { ServerContext } from "@/components/server-provider"

export const useServer = () => useContext(ServerContext)
