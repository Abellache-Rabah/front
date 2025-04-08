"use client"

import Image from "next/image"
import { motion } from "framer-motion"

type PageHeaderProps = {
  title: string
}

export function PageHeader({ title }: PageHeaderProps) {
  return (
    <motion.div
      className="flex items-center gap-4 py-5 border-b border-amber-600/20 mb-4"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 25,
        delay: 0.1
      }}
    >
      <div className="relative">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
        >
          <Image 
            src="/images/coffinated-logo.png" 
            alt="Coffinated" 
            width={32} 
            height={32} 
            className="object-contain rounded-md" 
          />
        </motion.div>
        <motion.div 
          className="absolute -bottom-1 -right-1 w-2 h-2 bg-amber-500 rounded-full"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, duration: 0.2 }}
        />
      </div>
      <motion.h1 
        className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100"
        initial={{ opacity: 0, x: -5 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.2 }}
      >
        {title}
      </motion.h1>
    </motion.div>
  )
}
