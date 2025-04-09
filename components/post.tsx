"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

// Update the server URL to your backend server.
const SERVER_URL = "http://localhost:3001";

export function Post({ post }: { post: any }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  const { toast } = useToast();
  useEffect(() => {
    const id = localStorage.getItem("id");
    console.log("post.likes", post.likes);
    console.log("id", id);
    
    if (post.likes?.includes(id)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, []);
  const handleLike = async () => {
    // Determine new liked state and update optimistically.
    const newLiked = !liked;
    setLiked(newLiked);
    setLikeCount((prev) => prev + (newLiked ? 1 : -1));

    const token = localStorage.getItem("token");
    // Choose endpoint based on whether we're liking or unliking.
    const endpoint = newLiked ? "like" : "unlike";
    try {
      const res = await fetch(`${SERVER_URL}/post/${post._id}/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        // If the server responds with an error, revert optimistic update.
        throw new Error("Failed to update like status");
      }
      // Optionally, parse the updated post from server response:
      // const updatedPost = await res.json();
    } catch (err: any) {
      // Revert optimistic UI update if there was an error
      setLiked((prev) => !prev);
      setLikeCount((prev) => prev + (newLiked ? -1 : 1));
      toast({
        title: "Error",
        description: err.message || "Unable to update like status",
        variant: "destructive",
      });
    }

    // Optionally, you can show a toast on a successful like action:
    if (newLiked) {
      toast({
        title: "Post liked",
        description: `You liked @${post.user.username}'s post`,
      });
    }
  };

  const handleComment = () => {
    toast({
      title: "Comments",
      description: "Comments feature coming soon!",
    });
  };

  const handleShare = () => {
    toast({
      title: "Post shared",
      description: `You shared @${post.user.username}'s post`,
    });
  };

  return (
    <motion.div
      className="p-4 border rounded-lg border-border bg-card"
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-amber-800 flex items-center justify-center text-white font-semibold">
          {post.user.username.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">@{post.user.username}</h3>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(post.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>
          {/* <p className="text-sm text-muted-foreground">{post.server}</p> */}
        </div>
      </div>

      <div className="mb-4 whitespace-pre-wrap">{post.content}</div>

      <div className="flex justify-between">
        <Button
          variant="ghost"
          size="sm"
          className={cn(liked && "text-amber-500")}
          onClick={handleLike}
        >
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
          <span>{post.comments?.length || 0}</span>
        </Button>
      </div>
    </motion.div>
  );
}
