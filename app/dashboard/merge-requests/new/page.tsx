"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

// Mock data for groups
const groups = [
  { id: "1", name: "Frontend Team" },
  { id: "2", name: "Backend Team" },
  { id: "3", name: "DevOps Team" },
  { id: "4", name: "QA Team" },
]

export default function CreateMergeRequestPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [group, setGroup] = useState("")
  const [links, setLinks] = useState([{ url: "", title: "" }])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddLink = () => {
    setLinks([...links, { url: "", title: "" }])
  }

  const handleLinkChange = (index: number, field: "url" | "title", value: string) => {
    const updatedLinks = [...links]
    updatedLinks[index][field] = value
    setLinks(updatedLinks)
  }

  const handleRemoveLink = (index: number) => {
    const updatedLinks = [...links]
    updatedLinks.splice(index, 1)
    setLinks(updatedLinks)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      // Redirect to dashboard after successful creation
      window.location.href = "/dashboard/merge-requests"
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New Merge Request</CardTitle>
          <CardDescription>Fill in the details to create a new merge request</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter a descriptive title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Provide details about the changes"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="min-h-[120px]"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="group">Group</Label>
              <Select value={group} onValueChange={setGroup} required>
                <SelectTrigger id="group">
                  <SelectValue placeholder="Select a group" />
                </SelectTrigger>
                <SelectContent>
                  {groups.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label>Links (Optional)</Label>
                <Button type="button" variant="outline" size="sm" onClick={handleAddLink}>
                  Add Link
                </Button>
              </div>

              {links.map((link, index) => (
                <div key={index} className="grid gap-2">
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="URL (e.g., GitHub PR)"
                      value={link.url}
                      onChange={(e) => handleLinkChange(index, "url", e.target.value)}
                    />
                    <Input
                      placeholder="Title"
                      value={link.title}
                      onChange={(e) => handleLinkChange(index, "title", e.target.value)}
                    />
                    {links.length > 1 && (
                      <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveLink(index)}>
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/dashboard">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Merge Request"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

