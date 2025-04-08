"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useServer } from "@/hooks/use-server"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"

export function CreatePost() {
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const { servers, currentServer, setCurrentServer, isConnected } = useServer()
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Post cannot be empty",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate posting delay
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Success",
        description: "Post published successfully",
      })
      setContent("")
      router.push("/home")
    }, 1000)
  }

  const characterLimit = 280
  const charactersLeft = characterLimit - content.length
  const isOverLimit = charactersLeft < 0

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
    >
      <div className="space-y-2">
        <Textarea
          placeholder="What's brewing?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[150px] resize-none"
          maxLength={characterLimit}
        />
        <div
          className={cn(
            "text-right text-xs",
            isOverLimit ? "text-destructive" : "text-muted-foreground",
            charactersLeft <= 20 && !isOverLimit && "text-amber-500",
          )}
        >
          {charactersLeft} characters left
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Select value={currentServer || ""} onValueChange={setCurrentServer}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Select server" />
          </SelectTrigger>
          <SelectContent>
            {servers.map((server) => (
              <SelectItem key={server} value={server}>
                {server.replace("https://", "")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            type="submit"
            className="bg-amber-600 hover:bg-amber-700 w-full sm:w-auto"
            disabled={isSubmitting || !content.trim() || isOverLimit}
          >
            {isSubmitting ? "Publishing..." : "Publish"}
          </Button>
        </motion.div>
      </div>
    </motion.form>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
