"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { GitMerge } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [organizationType, setOrganizationType] = useState("join")
  const [organizationName, setOrganizationName] = useState("")
  const [organizationDescription, setOrganizationDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate signup request
    setTimeout(() => {
      setIsLoading(false)
      // Redirect to dashboard after successful signup
      window.location.href = "/dashboard"
    }, 1500)
  }

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
                  placeholder="John Doe"
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
                  placeholder="name@example.com"
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
              <div className="grid gap-2">
                <Label>Organization</Label>
                <RadioGroup
                  value={organizationType}
                  onValueChange={setOrganizationType}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="join" id="join" />
                    <Label htmlFor="join" className="font-normal">
                      Join Existing Organization
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="create" id="create" />
                    <Label htmlFor="create" className="font-normal">
                      Create New Organization
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              {organizationType === "create" && (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="org-name">Organization Name</Label>
                    <Input
                      id="org-name"
                      type="text"
                      placeholder="Acme Inc."
                      value={organizationName}
                      onChange={(e) => setOrganizationName(e.target.value)}
                      required={organizationType === "create"}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="org-description">Organization Description</Label>
                    <Input
                      id="org-description"
                      type="text"
                      placeholder="A brief description of your organization"
                      value={organizationDescription}
                      onChange={(e) => setOrganizationDescription(e.target.value)}
                    />
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Sign Up"}
              </Button>
            </CardFooter>
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

