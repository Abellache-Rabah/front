"use client";

import { useState, useEffect } from "react";
import { Post } from "@/components/post";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

// Replace this with your backend server URL. For example, if your server is running on port 3001:
const SERVER_URL = "http://localhost:3001";

export function PostFeed() {
  const [posts, setPosts] = useState([]);
  const { toast } = useToast();

  // Fetch posts from the server after the component mounts.
  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch(`${SERVER_URL}/posts`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) {
          throw new Error(`Server responded with status ${res.status}`);
        }
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
        toast({
          title: "Error",
          description: "Could not fetch posts from the server.",
          variant: "destructive",
        });
      }
    }

    fetchPosts();
  }, [toast]);

  // Framer Motion variants for container and items.
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <motion.div
      className="space-y-4"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {posts.map((post) => (
        <motion.div key={post._id} variants={item}>
          <Post post={post} />
        </motion.div>
      ))}
    </motion.div>
  );
}
