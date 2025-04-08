"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Coffee, Home, MessageSquarePlus, Settings, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { ThemeToggle } from "./theme-toggle"

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
    label: "Subs",
    icon: Users,
  },
  {
    path: "/settings",
    label: "Settings",
    icon: Settings,
  },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <motion.div
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-black/90 backdrop-blur-sm border-t border-brown-800/30"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.2 }}
    >
      <div className="container max-w-lg mx-auto px-4 sm:px-6">
        <nav className="flex items-center justify-between">
          {navItems.map((item) => {
            const isActive = pathname === item.path

            return (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "flex flex-col items-center justify-center py-3 px-3 w-full relative transition-colors duration-200",
                  isActive 
                    ? "text-brown-600" 
                    : "text-gray-600 dark:text-gray-400 hover:text-brown-700 dark:hover:text-gray-200"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-nav-item"
                    className="absolute inset-0 bg-brown-800/10 rounded-md"
                    transition={{ type: "spring", bounce: 0.2 }}
                  />
                )}
                <item.icon className="w-5 h-5 mb-1" />
                <span className="text-xs tracking-wide">{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </motion.div>
  )
}
