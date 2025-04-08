"use client"

import { useState, useRef } from "react"
import { Post } from "@/components/post"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// Placeholder data
const placeholderPosts = [
  {
    id: "6",
    username: "espressoexplorer",
    content:
      "Visited 5 coffee shops today for my blog. My hands are shaking from caffeine but it was worth it! 😅 #CoffeeTour",
    timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10 minutes ago
    likes: 37,
    comments: 8,
    shares: 3,
    server: "coffinated-server-1.vercel.app",
  },
  {
    id: "7",
    username: "baristalife",
    content:
      "Pro tip: If your espresso tastes sour, try a slightly finer grind or increase the dose. Small adjustments make a big difference! #BaristaSkills",
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(), // 25 minutes ago
    likes: 64,
    comments: 11,
    shares: 15,
    server: "coffinated-server-2.vercel.app",
  },
  {
    id: "8",
    username: "coffeechemist",
    content:
      "Water quality matters more than most people realize. If your coffee tastes off, try filtered water before blaming the beans! 💧☕️ #CoffeeScience",
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
    likes: 92,
    comments: 14,
    shares: 21,
    server: "coffinated-server-1.vercel.app",
  },
]

type PostType = {
  id: string
  username: string
  content: string
  timestamp: string
  likes: number
  comments: number
  shares: number
  server: string
}

export function LiveFeed() {
  const [posts, setPosts] = useState<PostType[]>(placeholderPosts)
  const [newPostsCount, setNewPostsCount] = useState(0)
  const newPostsRef = useRef<PostType[]>([])

  // Simulate receiving new posts every 20 seconds
  useState(() => {
    const interval = setInterval(() => {
      const newPost: PostType = {
        id: Date.now().toString(),
        username: "newuser" + Math.floor(Math.random() * 100),
        content: "This is a new post that just came in! #CoffeeLover",
        timestamp: new Date().toISOString(),
        likes: Math.floor(Math.random() * 50),
        comments: Math.floor(Math.random() * 10),
        shares: Math.floor(Math.random() * 5),
        server: Math.random() > 0.5 ? "coffinated-server-1.vercel.app" : "coffinated-server-2.vercel.app",
      }

      newPostsRef.current = [newPost, ...newPostsRef.current]
      setNewPostsCount((prev) => prev + 1)
    }, 20000)

    return () => clearInterval(interval)
  }, [])

  const showNewPosts = () => {
    setPosts((prev) => [...newPostsRef.current, ...prev])
    newPostsRef.current = []
    setNewPostsCount(0)
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {newPostsCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <Button
              variant="outline"
              className="w-full border-amber-600 text-amber-600 hover:bg-amber-600/10"
              onClick={showNewPosts}
            >
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Show {newPostsCount} new {newPostsCount === 1 ? "post" : "posts"}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div className="space-y-4" variants={container} initial="hidden" animate="show">
        {posts.map((post) => (
          <motion.div key={post.id} variants={item}>
            <Post post={post} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
