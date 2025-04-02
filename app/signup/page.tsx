"use client"
import type React from "react"
import { useContext, useState } from "react"
import Link from "next/link"
import { GitMerge } from "lucide-react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false);
  const [showOTPBox, setShowOTPBBox] = useState(false);
  const [isOTP, setIsOTP] = useState(false);
  const [otp, setOTP] = useState("")
  const [time, setTime] = useState(30);

  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
  
    if (password !== confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match." });
      setIsLoading(false);
      return;
    }
    if (!otp || otp.length !== 6) {
      toast({ title: "Error", description: "Please enter a valid OTP." });
      setIsLoading(false);
      return;
    }
  
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/signup`;
      const response = await axios.post(url, {
        name,
        email,
        password,
        otp,
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
          window.location.href = "/";
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
  };
  

  const handleTimer = () => {
    const timer = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer); // Stop the timer when it reaches 0
          setIsOTP(false); // Automatically set OTP to false after 30 seconds
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleOTPRequest = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      toast({ title: "Invalid Email", description: "Please enter a valid email." });
      return;
    }

    setIsOTP(true);
    setTime(30); // Reset the timer to 30 seconds
    handleTimer(); // Start the timer

    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/user/generate-otp`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": process.env.NEXT_PUBLIC_API_KEY || "",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json(); // Parse JSON response

      // Show response message in toast
      toast({ title: response.ok ? "Success" : "Error", description: data.message });

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! Status: ${response.status}`);
      }

    } catch (error: unknown) {
      console.error("OTP Request Failed:", error);

      // Safely extract error message
      const errorMessage =
          error instanceof Error ? error.message : "Something went wrong.";

      toast({ title: "Error", description: errorMessage });
  }
  };


  return (
    <div className="p-1 flex min-h-screen w-screen flex-col items-center justify-center py-8">
      <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8">
        <div className="flex items-center gap-2 font-bold">
          <GitMerge className="h-6 w-6 text-primary" />
          <span className="text-xl">MergeFlow</span>
        </div>
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Sign up</CardTitle>
            <CardDescription>Create an account to get started with MergeFlow</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Ritik Raj"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@organization.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button onClick={(e) => {
                handleOTPRequest(e);
                setShowOTPBBox(true);
              }} className="w-full" disabled={isOTP}>
                {isOTP ? `Request again in ${time}` : "Request OTP"}
              </Button>
            </CardFooter>
            {
              showOTPBox && (
                <>
                  <CardFooter>
                    <div className="flex w-full items-center justify-between">
                      {Array.from({ length: 6 }).map((_, index) => (
                        <Input
                          key={index}
                          type="text"
                          maxLength={1}
                          value={otp[index] || ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            const newOtp = otp.split("");

                            if (/^\d*$/.test(value)) { // Allow only numeric input
                              newOtp[index] = value;
                              setOTP(newOtp.join(""));

                              // Automatically move to the next input box
                              if (value && index < 5) {
                                const nextInput = document.getElementById(`otp-${index + 1}`);
                                if (nextInput) (nextInput as HTMLInputElement).focus();
                              }
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Backspace" && !otp[index] && index > 0) {
                              const prevInput = document.getElementById(`otp-${index - 1}`);
                              if (prevInput) (prevInput as HTMLInputElement).focus();
                            }
                          }}
                          id={`otp-${index}`} // Add unique ID for each input
                          className="w-10 text-center"
                          required
                        />
                      ))}
                    </div>
                  </CardFooter>
                  <CardFooter className="flex flex-col">
                    <Button className="w-full" type="submit" disabled={isLoading}>
                      {isLoading ? "Creating account..." : "Sign Up"}
                    </Button>
                  </CardFooter>
                </>
              )
            }

          </form>
        </Card>
        <div className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary underline-offset-4 hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  )
}

