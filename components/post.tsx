"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { Heart, MessageCircle, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"

type PostProps = {
  post: {
    id: string
    username: string
    content: string
    timestamp: string
    likes: number
    comments: number
    shares: number
    server: string
  }
}

export function Post({ post }: PostProps) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(post.likes)
  const [shareCount, setShareCount] = useState(post.shares)
  const { toast } = useToast()

  const handleLike = () => {
    setLiked(!liked)
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1))

    // Animation feedback
    if (!liked) {
      toast({
        title: "Post liked",
        description: `You liked @${post.username}'s post`,
      })
    }
  }

  const handleComment = () => {
    toast({
      title: "Comments",
      description: "Comments feature coming soon!",
    })
  }

  const handleShare = () => {
    setShareCount((prev) => prev + 1)
    toast({
      title: "Post shared",
      description: `You shared @${post.username}'s post`,
    })
  }

  return (
    <motion.div
      className="p-4 border rounded-lg border-border bg-card"
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-amber-800 flex items-center justify-center text-white font-semibold">
          {post.username.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">@{post.username}</h3>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{post.server}</p>
        </div>
      </div>

      <div className="mb-4 whitespace-pre-wrap">{post.content}</div>

      <div className="flex justify-between">
        <Button variant="ghost" size="sm" className={cn(liked && "text-amber-500")} onClick={handleLike}>
          <motion.div
            whileTap={{ scale: liked ? 1 : 1.5 }}
            animate={liked ? { scale: [1, 1.5, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <Heart className={cn("w-4 h-4 mr-1", liked && "fill-amber-500")} />
          </motion.div>
          <span>{likeCount}</span>
        </Button>

        <Button variant="ghost" size="sm" onClick={handleComment}>
          <MessageCircle className="w-4 h-4 mr-1" />
          <span>{post.comments}</span>
        </Button>

        <Button variant="ghost" size="sm" onClick={handleShare}>
          <Share2 className="w-4 h-4 mr-1" />
          <span>{shareCount}</span>
        </Button>
      </div>
    </motion.div>
  )
}
