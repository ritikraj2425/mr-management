"use client"

import type React from "react"

import { useContext, useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AuthContext } from "@/hooks/use-context"
import AutoCompleteSearch, { Member } from "./autoCompleteSearch"
import { toast } from "@/hooks/use-toast"
import axios from "axios"
import { useRouter } from "next/navigation"

// Mock data for groups
const groups = [
  { id: "1", name: "Frontend Team" },
  { id: "2", name: "Backend Team" },
  { id: "3", name: "DevOps Team" },
  { id: "4", name: "QA Team" },
]

export default function CreateMergeRequestPage() {
  const [title, setTitle] = useState("")
  const [group, setGroup] = useState("")
  const [link, setLink] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedMembers, setSelectedMembers] = useState<any>([]);
  const router = useRouter();

  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("ThemeContext is not provided. Wrap your component inside <ThemeProvider>.");
  }
  const { organizationData, userGroups, jwtToken, refreshToken } = authContext;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    if (!title || !group || !link || !selectedMembers) {
      toast({ title: "Error", description: "All fields are required" });
      setIsSubmitting(false);
      return;
    }
    console.log(title,group,link,selectedMembers)

    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/mr/create`;
      const response = await axios.post(
        url,
        {
          title: title
          ,reviewerEmails: selectedMembers
          ,groupId: group
          ,link: link
        },
        {
          headers: {
            "Content-Type": "application/json",
            "apikey": process.env.NEXT_PUBLIC_API_KEY || "",
            "jwttoken": jwtToken || "",
            "refreshtoken": refreshToken || "",
          },
          withCredentials: true,
        }
      );

      if (response.status == 201) {
        setTimeout(() => {
          setIsSubmitting(false);
          router.push("/dashboard/my-merge-requests");
        }, 2000);
        toast({ title: "Success", description: response.data.message });
      } else {
        toast({ title: "Error", description: response.data.error });
        setIsSubmitting(false);
      }

    } catch (error: any) {
      console.error("Create Organization Failed:", error); 
      if (error.response && error.response.data) {
        toast({
          title: "Error",
          description: error.response.data.error || "Something went wrong.",
        });
      } else {
        toast({ title: "Error", description: "Unexpected error occurred." });
      }
      setIsSubmitting(false);
    }
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
              <Label htmlFor="title">Assign to</Label>
              <AutoCompleteSearch members={organizationData.members} onSelectMembers={setSelectedMembers} />
            </div>
            <div>
              <Label htmlFor="group">Group</Label>
              <Select value={group} onValueChange={setGroup} required>
                <SelectTrigger id="group">
                  <SelectValue placeholder="Select a group" />
                </SelectTrigger>
                <SelectContent>
                  {userGroups?.map((group: any) => (
                    <SelectItem key={group._id} value={group._id}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label>Link</Label>
              </div>
              <div className="grid gap-2">
                <Input
                  placeholder="URL (e.g., GitHub PR)"
                  onChange={(e) => setLink(e.target.value)}
                />
              </div>
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

