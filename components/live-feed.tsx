"use client";

import { useState, useEffect, useRef } from "react";
import { Post } from "@/components/post";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { io } from "socket.io-client";

// Define the backend base URL and namespace path.
const SERVER_URL = "http://localhost:3001";
const NAMESPACE = "/postnamespace";

type PostType = {
  _id: string;
  username: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  server: string;
};

export function LiveFeed() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // State to store the posts, new post count and hold new posts until user refreshes.
  const [posts, setPosts] = useState<PostType[]>([]);
  const [newPostsCount, setNewPostsCount] = useState(0);
  const newPostsRef = useRef<PostType[]>([]);

  // Socket reference so that we can disconnect on cleanup
  const socketRef = useRef<any>(null);

  // Fetch initial posts from the backend once the component mounts.
  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch(`${SERVER_URL}/posts`);
        if (res.ok) {
          const data = await res.json();
          setPosts(data);
        } else {
          console.error("Error fetching posts", res.status);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    }
    fetchPosts();
  }, []);

  // Setup Socket.IO connection once on mount.
  useEffect(() => {
    // Connect to the backend Socket.IO namespace.
    const socket = io(`${SERVER_URL}${NAMESPACE}`, {
      transports: ["websocket"],
    });

    socketRef.current = socket;

    // Listen for new post events.
    socket.on("newPost", (post: PostType) => {
      console.log("New post received from socket:", post);
      // Add new post to our reference array until the user manually shows them.
      newPostsRef.current = [post, ...newPostsRef.current];
      setNewPostsCount((prev) => prev + 1);
    });

    // Cleanup when the component unmounts.
    return () => {
      socket.disconnect();
    };
  }, []);

  // Handler to show new posts
  const showNewPosts = () => {
    setPosts((prev) => [...newPostsRef.current, ...prev]);
    newPostsRef.current = [];
    setNewPostsCount(0);
  };

  // Framer Motion variants for the container and items.
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
  // For SSR, render static placeholder HTML so that the initial output matches
  if (!mounted) {
    return <div>Loading...</div>;
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
    </div>
  );
}
