"use client"
import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { GitMerge } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import axios from "axios"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/login`;
      const response = await axios.post(url, {
        email,
        password,
      }, {
        headers: {
          "Content-Type": "application/json",
          "apikey": process.env.NEXT_PUBLIC_API_KEY || "",
        },
        withCredentials: true,
      });
  
      if (response.status === 200) {
        toast({ title: "Success", description: response.data.message });
        localStorage.setItem("jwtToken", response.data.jwtToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        // Optionally, refresh auth status or navigate to dashboard
        setTimeout(() => {
          setIsLoading(false);
          window.location.href = "/dashboard";
        }, 2000);
      } else {
        toast({ title: "Error", description: response.data.message });
        setIsLoading(false);
      }
  
    } catch (error) {
      console.error("Signup Failed:", error);
      toast({ title: "Error", description: "Something went wrong." });
      setIsLoading(false);
    }
    
  }


  return (
    <div className="p-1 flex h-screen w-screen flex-col items-center justify-center">
      <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8">
        <div className="flex items-center gap-2 font-bold">
          <GitMerge className="h-6 w-6 text-primary" />
          <span className="text-xl">MergeFlow</span>
        </div>
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>Enter your email and password to login to your account</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" className="text-sm text-primary underline-offset-4 hover:underline">
                    Forgot Password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </CardFooter>
          </form>
        </Card>
        <div className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-primary underline-offset-4 hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  )
}

