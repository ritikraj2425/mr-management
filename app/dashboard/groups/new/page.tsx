"use client"
import type React from "react"
import { useContext, useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AuthContext } from "@/hooks/use-context"
import Loading from "@/components/ui/loading"
import { Select, SelectItem } from "@/components/ui/select"
import Modal from "@/components/ui/modal"
import axios from "axios"
import { toast } from "@/hooks/use-toast"


export default function CreateOrJoinGroupPage() {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [platform, setPlatform] = useState("");
  const [isModal, setIsModal] = useState(false)

  const backendUrl = process.env.NEXT_PUBLIC_API_URL;
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext is not provided. Wrap your component inside <AuthProvider>.");
  }

  const { groupData, jwtToken, refreshToken, userData } = authContext;


  const createGroup = async () => {
    try {
      const response = await axios.post(`${backendUrl}/group/create`,
        { name, platform, description }, // Request body
        {
          headers: {
            "Content-Type": "application/json",
            "apikey": process.env.NEXT_PUBLIC_API_KEY || "",
            "jwttoken": jwtToken,
            "refreshtoken": refreshToken,
          },
          withCredentials: true,
        }
      );
      if (response.data.redirectUrl) {
        window.location.href = response.data.redirectUrl;
      } else {
        toast({ title: "error", description: response.data.message });
      }
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };


  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    createGroup()

  }

  const filteredGroups = groupData?.filter((group: any) =>
  (group?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group?.description?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (!groupData) {
    return <Loading />
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

      <Tabs defaultValue="create" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">Create Group</TabsTrigger>
          <TabsTrigger value="join">All Groups</TabsTrigger>
        </TabsList>
        {
          userData.isAdmin ?
            <TabsContent value="create">
              <Card>
                <CardHeader>
                  <CardTitle>Create New Group</CardTitle>
                  <CardDescription>Create a new group for your team to collaborate on merge requests</CardDescription>
                </CardHeader>
                <form onSubmit={handleCreateGroup}>
                  <CardContent className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Group Name</Label>
                      <Input
                        id="name"
                        placeholder="Enter group name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Provide a description of the group"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="min-h-[100px]"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="platform"
                          value="github"
                          checked={platform === "github"}
                          onChange={() => setPlatform("github")}
                          className="accent-blue-500"
                        />
                        GitHub
                      </Label>
                      <Label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="platform"
                          value="gitlab"
                          checked={platform === "gitlab"}
                          onChange={() => setPlatform("gitlab")}
                          className="accent-blue-500"
                        />
                        GitLab
                      </Label>
                      <Label className="flex items-center gap-2 text-gray-500">
                        <input
                          type="radio"
                          name="platform"
                          value="bitbucket"
                          disabled
                          className="accent-gray-500"
                        />
                        Bitbucket (Soon)
                      </Label>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" asChild>
                      <Link href="/dashboard">Cancel</Link>
                    </Button>
                    <Button type="submit" disabled={isModal} onClick={() => setIsModal(true)}>
                      {/* {isSubmitting ? "Creating..." : `Give ${platform} access`} */}
                      {`Give ${platform} access`}

                    </Button>
                  </CardFooter>
                  <Modal isOpen={isModal} onClose={() => setIsModal(false)}>
                    <>
                      <div>
                        Make sure you have all the repositories in your {platform} that you plan to manage through
                        this group. We will only be requesting read-only access.
                      </div>
                      <br></br>
                      <Button disabled={isSubmitting}>
                        {isSubmitting ? "Creating..." : `Give ${platform} access`}
                      </Button>
                    </>
                  </Modal>
                </form>
              </Card>
            </TabsContent>
            :
            <>
            Only admins can create group
            </>
        }



        <TabsContent value="join">
          <Card>
            <CardHeader>
              <CardTitle>All groups of organization</CardTitle>
              <CardDescription>Browse groups in your organization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search groups..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="space-y-4">
                {filteredGroups.length > 0 ? (
                  filteredGroups.map((group: any) => (
                    <Card key={group._id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold">{group?.name}</h3>
                            <p className="text-sm text-muted-foreground">{group?.description}</p>
                            <p className="mt-1 text-xs text-muted-foreground">{group?.members?.length} members</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                    <p className="text-sm text-muted-foreground">No groups found matching your search</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

