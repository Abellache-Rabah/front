"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { useEffect } from "react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Switch } from "@/components/ui/switch"

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  notifications: z.boolean().default(false),
  darkMode: z.boolean().default(true),
})

export function SettingsForm() {
  const { theme, setTheme } = useTheme()
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      notifications: false,
      darkMode: theme === "dark",
    },
  })

  // Update form when theme changes
  useEffect(() => {
    form.setValue("darkMode", theme === "dark")
  }, [form, theme])

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Update theme based on form value
    setTheme(values.darkMode ? "dark" : "light")
    
    toast({
      title: "Settings updated",
      description: "Your settings have been saved successfully.",
    })
  }

  // Handle theme toggle separate from form submission
  const handleThemeToggle = (checked: boolean) => {
    form.setValue("darkMode", checked)
    setTheme(checked ? "dark" : "light")
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <motion.div 
          className="space-y-5"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={item}>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-amber-600">Username</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Your username" 
                      className="border-amber-800/30 bg-white/5 dark:bg-black/30 focus-visible:ring-amber-500" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription className="text-gray-600 dark:text-gray-400 text-xs">
                    This is your public display name.
                  </FormDescription>
                  <FormMessage className="text-amber-800" />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div variants={item}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-amber-600">Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Your email address" 
                      className="border-amber-800/30 bg-white/5 dark:bg-black/30 focus-visible:ring-amber-500" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription className="text-gray-600 dark:text-gray-400 text-xs">
                    We'll never share your email with anyone else.
                  </FormDescription>
                  <FormMessage className="text-amber-800" />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div variants={item}>
            <FormField
              control={form.control}
              name="notifications"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-amber-800/30 p-4 bg-white/5 dark:bg-black/30">
                  <div className="space-y-0.5">
                    <FormLabel className="text-amber-600">Notifications</FormLabel>
                    <FormDescription className="text-gray-600 dark:text-gray-400 text-xs">
                      Receive notifications about activity.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-amber-600"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div variants={item}>
            <FormField
              control={form.control}
              name="darkMode"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-amber-800/30 p-4 bg-white/5 dark:bg-black/30">
                  <div className="space-y-0.5">
                    <FormLabel className="text-amber-600">Dark Mode</FormLabel>
                    <FormDescription className="text-gray-600 dark:text-gray-400 text-xs">
                      Enable dark mode for the app.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={handleThemeToggle}
                      className="data-[state=checked]:bg-amber-600"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div variants={item} className="pt-4">
            <Button 
              type="submit" 
              className="w-full bg-amber-600 hover:bg-amber-700 text-white"
            >
              Save Changes
            </Button>
          </motion.div>
        </motion.div>
      </form>
    </Form>
  )
}
