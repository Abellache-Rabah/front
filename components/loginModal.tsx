"use client";

import React, { use, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

// Set the server URL to your local or production backend as needed.
const SERVER_URL = "http://localhost:3001";

export function LoginModal({ children }: { children: React.ReactNode }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  // isLogin determines which form to show: true for login, false for register.
  const [isLogin, setIsLogin] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  const login = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast({
        title: "Error",
        description: "Both email and password are required.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`${SERVER_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Login failed");
      }

      const data = await res.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("id", data.user.id);
      localStorage.setItem("username", data.user.username);

      toast({
        title: "Success",
        description: "Logged in successfully",
      });

      setOpen(false);
      router.push("/home");
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Login failed.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const register = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast({
        title: "Error",
        description: "Both email and password are required.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`${SERVER_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, username }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Registration failed");
      }

      const data = await res.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("id", data.user._id);
      localStorage.setItem("username", username);
      toast({
        title: "Success",
        description: "Account created successfully",
      });

      setOpen(false);
      router.push("/home");
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Registration failed.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || <Button variant="default">Login</Button>}
      </DialogTrigger>

      {isLogin ? (
        <DialogContent className="max-w-sm w-full">
          <DialogTitle className="text-center">Welcome Back!</DialogTitle>
          <motion.form
            onSubmit={login}
            className="space-y-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
          >
            <h2 className="text-xl font-semibold">Login</h2>

            <div className="flex flex-col gap-2">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
            <Button
              variant="link"
              className="w-full text-center"
              onClick={() => setIsLogin(false)}
            >
              Don't have an account? Register
            </Button>
          </motion.form>
        </DialogContent>
      ) : (
        <DialogContent className="max-w-sm w-full">
          <motion.form
            onSubmit={register}
            className="space-y-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
          >
            <h2 className="text-xl font-semibold">Register</h2>

            <div className="flex flex-col gap-2">
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Registering..." : "Register"}
            </Button>
            <Button
              variant="link"
              className="w-full text-center"
              onClick={() => setIsLogin(true)}
            >
              Already have an account? Login
            </Button>
          </motion.form>
        </DialogContent>
      )}
    </Dialog>
  );
}
