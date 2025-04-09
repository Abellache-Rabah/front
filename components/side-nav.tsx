"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Coffee,
  Home,
  Menu,
  MessageSquarePlus,
  Settings,
  Users,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import { LoginModal } from "./loginModal";

const navItems = [
  {
    path: "/home",
    label: "Home",
    icon: Home,
  },
  {
    path: "/feed",
    label: "Feed",
    icon: Coffee,
  },
  {
    path: "/publish",
    label: "Post",
    icon: MessageSquarePlus,
  },
  {
    path: "/subscriptions",
    label: "Subscriptions",
    icon: Users,
  },
  {
    path: "/settings",
    label: "Settings",
    icon: Settings,
  },
];

export function SideNav() {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [isSiginedIn, setIsSiginedIn] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsSiginedIn(true);
    } else {
      setIsSiginedIn(false);
    }
  }, []);
  // Handle client-side only rendering
  useEffect(() => {
    setIsMounted(true);
    // Check local storage for saved preference
    const savedState = localStorage.getItem("sidebar-collapsed");
    if (savedState) {
      setIsExpanded(savedState !== "true");
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    // Only save preference after component is mounted
    if (isMounted) {
      localStorage.setItem("sidebar-collapsed", String(!newState));
    }
  };

  // Return a consistent initial UI to avoid hydration mismatch
  if (!isMounted) {
    // Return a skeleton or the default expanded view that matches the server render
    return (
      <div className="hidden md:block">
        <div className="fixed top-0 left-0 h-screen w-64 border-r border-amber-800/30 dark:bg-black bg-white transition-all duration-300 z-40">
          {/* Minimal content to match server render */}
          <div className="flex items-center justify-between p-4 border-b border-amber-800/30">
            <div className="flex items-center gap-2">
              <Coffee className="h-5 w-5 text-amber-500" />
              <h1 className="text-xl font-bold dark:text-gray-100 text-gray-900">
                Coffinated
              </h1>
            </div>
            <button className="p-1.5 rounded-md hover:bg-amber-600/10 text-amber-600 dark:text-gray-400 dark:hover:text-amber-500">
              <X size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Regular render after component is mounted on client
  return (
    <div className="hidden md:block">
      <div
        className={cn(
          "fixed top-0 left-0 h-screen border-r border-amber-800/30 dark:bg-black bg-white transition-all duration-300 z-40",
          isExpanded ? "w-64" : "w-16"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-amber-800/30">
          {isExpanded && (
            <div className="flex items-center gap-2">
              <Coffee className="h-5 w-5 text-amber-500" />
              <h1 className="text-xl font-bold dark:text-gray-100 text-gray-900">
                Coffinated
              </h1>
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-md hover:bg-amber-600/10 text-amber-600 dark:text-gray-400 dark:hover:text-amber-500"
          >
            {isExpanded ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <div className="mt-4 px-2">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md relative transition-colors duration-200",
                    isExpanded ? "" : "justify-center",
                    isActive
                      ? "text-amber-600"
                      : "dark:text-gray-400 text-gray-600 hover:text-amber-700 dark:hover:text-gray-200 hover:bg-amber-600/10"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-sidenav-item"
                      className="absolute inset-0 bg-amber-600/10 rounded-md"
                      transition={{ type: "spring", bounce: 0.2 }}
                    />
                  )}
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {isExpanded && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
            {isSiginedIn ? (
              <Button
                variant="ghost"
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md relative transition-colors duration-200",
                  isExpanded ? "" : "justify-center"
                )}
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("username");
                  localStorage.removeItem("id");
                  // refrech
                  setTimeout(() => {
                    window.location.reload();
                  }, 1000);
                }}
              >
                <Coffee className="w-5 h-5 flex-shrink-0" />
                {isExpanded && <span className="truncate">Sign Out</span>}
              </Button>
            ) : (
              <LoginModal>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md relative transition-colors duration-200",
                      isExpanded ? "" : "justify-center"
                    )}
                  >
                    <Coffee className="w-5 h-5 flex-shrink-0" />
                    {isExpanded && <span className="truncate">Sign In</span>}
                  </Button>
                </motion.div>
              </LoginModal>
            )}
          </nav>
        </div>

        {isExpanded ? (
          <div className="absolute bottom-4 left-0 right-0 px-4">
            <div className="flex items-center justify-between">
              <span className="text-sm dark:text-gray-400 text-gray-600">
                Toggle theme
              </span>
              <ThemeToggle />
            </div>
          </div>
        ) : (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
            <ThemeToggle />
          </div>
        )}
      </div>
    </div>
  );
}
