"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Edit, MessageSquare, ThumbsUp, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"

// Mock data for a merge request
const mergeRequest = {
  id: "mr-1",
  title: "Add user authentication flow",
  description:
    "This MR implements the user authentication flow including login, signup, and password reset functionality. It also includes the necessary API endpoints and database schema changes.",
  creator: {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  group: "Frontend Team",
  status: "pending",
  createdAt: "2023-05-15T10:30:00Z",
  links: [
    { url: "https://github.com/acme/project/pull/123", title: "GitHub PR #123" },
    { url: "https://jira.acme.com/browse/PROJ-456", title: "JIRA PROJ-456" },
  ],
  comments: [
    {
      id: "comment-1",
      author: {
        name: "John Doe",
        email: "john.doe@example.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: "Looks good to me! The authentication flow works as expected.",
      createdAt: "2023-05-16T09:45:00Z",
    },
    {
      id: "comment-2",
      author: {
        name: "Alex Johnson",
        email: "alex.johnson@example.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: "Can you add more validation to the signup form?",
      createdAt: "2023-05-16T11:20:00Z",
    },
  ],
}

export default function MergeRequestDetailsPage({ params }: { params: { id: string } }) {
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmitComment = () => {
    if (!comment.trim()) return

    setIsSubmitting(true)
    // Simulate API call
    setTimeout(() => {
      setComment("")
      setIsSubmitting(false)
      // In a real app, you would add the comment to the list
    }, 1000)
  }

  const handleMerge = () => {
    // Implement merge functionality
    alert("MR merged successfully!")
  }

  const handleReject = () => {
    // Implement reject functionality
    alert("MR rejected!")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/merge-requests">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to MRs
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">{mergeRequest.title}</CardTitle>
                <CardDescription>
                  Created by {mergeRequest.creator.name} on {formatDate(mergeRequest.createdAt)}
                </CardDescription>
              </div>
              <Badge variant={mergeRequest.status === "pending" ? "outline" : "default"}>
                {mergeRequest.status === "pending" ? "Pending" : "Merged"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="mb-2 font-semibold">Description</h3>
              <p className="text-sm text-muted-foreground">{mergeRequest.description}</p>
            </div>

            {mergeRequest.links.length > 0 && (
              <div>
                <h3 className="mb-2 font-semibold">Links</h3>
                <ul className="list-inside list-disc space-y-1">
                  {mergeRequest.links.map((link, index) => (
                    <li key={index} className="text-sm">
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {link.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href={`/dashboard/merge-requests/${params.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit MR
              </Link>
            </Button>
            <div className="flex gap-2">
              <Button variant="destructive" onClick={handleReject}>
                <X className="mr-2 h-4 w-4" />
                Reject
              </Button>
              <Button onClick={handleMerge}>
                <ThumbsUp className="mr-2 h-4 w-4" />
                Merge
              </Button>
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Comments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mergeRequest.comments.map((comment) => (
              <div key={comment.id} className="flex gap-4">
                <Avatar>
                  <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                  <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{comment.author.name}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</p>
                  </div>
                  <p className="text-sm">{comment.content}</p>
                </div>
              </div>
            ))}

            <Separator className="my-4" />

            <div className="space-y-4">
              <div className="flex gap-4">
                <Avatar>
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Your Avatar" />
                  <AvatarFallback>YA</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <Textarea
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <Button size="sm" onClick={handleSubmitComment} disabled={!comment.trim() || isSubmitting}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    {isSubmitting ? "Posting..." : "Post Comment"}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

