"use client"

import { useState } from "react"
import { Post } from "@/components/post"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"

// Placeholder data
const placeholderPosts = [
  {
    id: "1",
    username: "coffeemaster",
    content: "Just brewed the perfect cup of Ethiopian Yirgacheffe. The floral notes are incredible! ☕️ #MorningBrew",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
    likes: 24,
    comments: 3,
    shares: 2,
    server: "coffinated-server-1.vercel.app",
  },
  {
    id: "2",
    username: "beangrinder",
    content:
      "Hot take: dark roast is overrated. Medium roast brings out the best flavors without the burnt taste. Fight me. ☕️",
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
    likes: 42,
    comments: 17,
    shares: 5,
    server: "coffinated-server-2.vercel.app",
  },
  {
    id: "3",
    username: "latteart",
    content:
      "Finally perfected my swan latte art! Took months of practice but so worth it. \n\nWhat design should I try next? 🥛☕️",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    likes: 89,
    comments: 12,
    shares: 8,
    server: "coffinated-server-1.vercel.app",
  },
  {
    id: "4",
    username: "coffeecode",
    content: "Coding session powered by a double espresso. Productivity level: MAXIMUM ⚡️\n\n#CoffeeAndCode #DevLife",
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
    likes: 56,
    comments: 7,
    shares: 3,
    server: "coffinated-server-2.vercel.app",
  },
  {
    id: "5",
    username: "brewjourney",
    content:
      "Just discovered this tiny roastery hidden in the mountains. Their single-origin Guatemalan beans might be the best I've ever had. Worth the 2-hour drive! 🚗 ☕️ #HiddenGems",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    likes: 112,
    comments: 23,
    shares: 14,
    server: "coffinated-server-1.vercel.app",
  },
]

export function PostFeed() {
  const [posts, setPosts] = useState(placeholderPosts)
  const { toast } = useToast()

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
    <motion.div className="space-y-4" variants={container} initial="hidden" animate="show">
      {posts.map((post) => (
        <motion.div key={post.id} variants={item}>
          <Post post={post} />
        </motion.div>
      ))}
    </motion.div>
  )
}
