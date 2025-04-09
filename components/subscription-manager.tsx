"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Set your backend server URL here.
const SERVER_URL = "http://localhost:3001";

// Define the Subscription type for local state.
type Subscription = {
  id: string;
  name: string;
  type: "user" | "topic";
};

export function SubscriptionManager() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [newSubscription, setNewSubscription] = useState("");
  const [activeTab, setActiveTab] = useState<"users" | "topics">("users");
  const { toast } = useToast();

  // ---------------------
  // Fetch subscriptions from server
  // ---------------------
  useEffect(() => {
    async function fetchSubscriptions() {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await fetch(`${SERVER_URL}/subscription`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          throw new Error("Failed to fetch subscriptions");
        }
        const data = await res.json();
        // Map server subscription objects to our local shape.
        // Assuming the server returns objects with _id and either user or topic.
        const mapped = data.map((sub: any) => {
          if (sub.username) {
            return { id: sub._id, name: sub.username, type: "user" };
          } else if (sub.topic) {
            return { id: sub._id, name: sub.topic, type: "topic" };
          }
          return sub;
        });
        setSubscriptions(mapped);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to fetch subscriptions",
          variant: "destructive",
        });
      }
    }

    fetchSubscriptions();
  }, [toast]);

  // ---------------------
  // Handle adding a subscription
  // ---------------------
  const handleAddSubscription = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newSubscription.trim()) return;

    try {
      // Build request body depending on active tab.
      const body =
        activeTab === "users"
          ? { username: newSubscription.trim() }
          : { topic: newSubscription.trim() };

      const res = await fetch(`${SERVER_URL}/subscription`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to add subscription");
      }

      const added = await res.json();
      // Map response to our local type.
      let newSub: Subscription;
      if (added.username) {
        newSub = { id: added._id, name: added.username, type: "user" };
      } else if (added.topic) {
        newSub = { id: added._id, name: added.topic, type: "topic" };
      } else {
        throw new Error("Invalid subscription data from server");
      }

      setSubscriptions((prev) => [...prev, newSub]);
      toast({
        title: "Success",
        description: `Added ${
          activeTab === "users" ? "user" : "topic"
        } to subscriptions`,
      });
      setNewSubscription("");
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to add subscription",
        variant: "destructive",
      });
    }
  };

  // ---------------------
  // Handle removing a subscription
  // ---------------------
  const handleRemoveSubscription = async (
    id: string,
    type: "user" | "topic",
    name: string
  ) => {
    try {
      // Build deletion body based on type.
      const body = type === "user" ? { username: name } : { topic: name };

      const res = await fetch(`${SERVER_URL}/subscription`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to remove subscription");
      }

      setSubscriptions((prev) => prev.filter((sub) => sub.id !== id));
      toast({
        title: "Success",
        description: "Removed from subscriptions",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to remove subscription",
        variant: "destructive",
      });
    }
  };

  // ---------------------
  // Framer Motion variants
  // ---------------------
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
    >
      <Tabs
        defaultValue="users"
        onValueChange={(v) => setActiveTab(v as "users" | "topics")}
      >
        <TabsList className="w-full">
          <TabsTrigger value="users" className="flex-1">
            Users
          </TabsTrigger>
          <TabsTrigger value="topics" className="flex-1">
            Topics
          </TabsTrigger>
        </TabsList>

        {/* USERS TAB */}
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

          <motion.div
            className="space-y-2"
            variants={container}
            initial="hidden"
            animate="show"
          >
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
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleRemoveSubscription(sub.id, sub.type, sub.name)
                      }
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ))}
            </AnimatePresence>

            {subscriptions.filter((sub) => sub.type === "user").length ===
              0 && (
              <p className="text-center text-muted-foreground py-4">
                You are not following any users yet
              </p>
            )}
          </motion.div>
        </TabsContent>

        {/* TOPICS TAB */}
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

          <motion.div
            className="space-y-2"
            variants={container}
            initial="hidden"
            animate="show"
          >
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
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleRemoveSubscription(sub.id, sub.type, sub.name)
                      }
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ))}
            </AnimatePresence>

            {subscriptions.filter((sub) => sub.type === "topic").length ===
              0 && (
              <p className="text-center text-muted-foreground py-4">
                You are not following any topics yet
              </p>
            )}
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
