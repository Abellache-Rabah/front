"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// Placeholder data
const placeholderSubscriptions = [
  { id: "1", name: "coffeemaster", type: "user" },
  { id: "2", name: "beangrinder", type: "user" },
  { id: "3", name: "latteart", type: "user" },
  { id: "4", name: "coffee", type: "topic" },
  { id: "5", name: "espresso", type: "topic" },
  { id: "6", name: "latte", type: "topic" },
]

type Subscription = {
  id: string
  name: string
  type: "user" | "topic"
}

export function SubscriptionManager() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(placeholderSubscriptions)
  const [newSubscription, setNewSubscription] = useState("")
  const [activeTab, setActiveTab] = useState<"users" | "topics">("users")
  const { toast } = useToast()

  const handleAddSubscription = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newSubscription.trim()) return

    const newSub: Subscription = {
      id: Date.now().toString(),
      name: newSubscription.trim(),
      type: activeTab,
    }

    setSubscriptions([...subscriptions, newSub])
    toast({
      title: "Success",
      description: `Added ${activeTab === "users" ? "user" : "topic"} to subscriptions`,
    })
    setNewSubscription("")
  }

  const handleRemoveSubscription = (id: string) => {
    setSubscriptions(subscriptions.filter((sub) => sub.id !== id))
    toast({
      title: "Success",
      description: "Removed from subscriptions",
    })
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  }

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
    >
      <Tabs defaultValue="users" onValueChange={(v) => setActiveTab(v as "users" | "topics")}>
        <TabsList className="w-full">
          <TabsTrigger value="users" className="flex-1">
            Users
          </TabsTrigger>
          <TabsTrigger value="topics" className="flex-1">
            Topics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <form onSubmit={handleAddSubscription} className="flex gap-2">
            <Input
              placeholder="Enter username to follow"
              value={newSubscription}
              onChange={(e) => setNewSubscription(e.target.value)}
            />
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button type="submit" disabled={!newSubscription.trim()}>
                <PlusCircle className="w-4 h-4 mr-2" />
                Follow
              </Button>
            </motion.div>
          </form>

          <motion.div className="space-y-2" variants={container} initial="hidden" animate="show">
            <AnimatePresence>
              {subscriptions
                .filter((sub) => sub.type === "user")
                .map((sub) => (
                  <motion.div
                    key={sub.id}
                    className="flex items-center justify-between p-3 border rounded-lg border-border"
                    variants={item}
                    exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                    layout
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-amber-800 flex items-center justify-center text-white font-semibold">
                        {sub.name.charAt(0).toUpperCase()}
                      </div>
                      <span>@{sub.name}</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveSubscription(sub.id)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ))}
            </AnimatePresence>

            {subscriptions.filter((sub) => sub.type === "user").length === 0 && (
              <p className="text-center text-muted-foreground py-4">You are not following any users yet</p>
            )}
          </motion.div>
        </TabsContent>

        <TabsContent value="topics" className="space-y-4">
          <form onSubmit={handleAddSubscription} className="flex gap-2">
            <Input
              placeholder="Enter topic to follow"
              value={newSubscription}
              onChange={(e) => setNewSubscription(e.target.value)}
            />
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button type="submit" disabled={!newSubscription.trim()}>
                <PlusCircle className="w-4 h-4 mr-2" />
                Follow
              </Button>
            </motion.div>
          </form>

          <motion.div className="space-y-2" variants={container} initial="hidden" animate="show">
            <AnimatePresence>
              {subscriptions
                .filter((sub) => sub.type === "topic")
                .map((sub) => (
                  <motion.div
                    key={sub.id}
                    className="flex items-center justify-between p-3 border rounded-lg border-border"
                    variants={item}
                    exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                    layout
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center text-white font-semibold">
                        #
                      </div>
                      <span>#{sub.name}</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveSubscription(sub.id)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ))}
            </AnimatePresence>

            {subscriptions.filter((sub) => sub.type === "topic").length === 0 && (
              <p className="text-center text-muted-foreground py-4">You are not following any topics yet</p>
            )}
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
