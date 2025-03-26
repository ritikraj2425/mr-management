import Link from "next/link"
import { PlusCircle, UserPlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MergeRequestList } from "@/components/merge-request-list"
import { MembersList } from "@/components/members-list"

// Mock data for organization
const organization = {
  name: "Acme Inc.",
  description: "Software development company",
  totalMRs: 87,
  pendingMRs: 12,
  mergedMRs: 75,
}

// Mock data for merge requests
const mergeRequests = [
  {
    id: "mr-1",
    title: "Add user authentication flow",
    creator: "Jane Smith",
    group: "Frontend Team",
    status: "pending",
    createdAt: "2023-05-15T10:30:00Z",
  },
  {
    id: "mr-2",
    title: "Fix pagination bug in user list",
    creator: "John Doe",
    group: "Backend Team",
    status: "pending",
    createdAt: "2023-05-14T14:45:00Z",
  },
  {
    id: "mr-3",
    title: "Implement dark mode toggle",
    creator: "Alex Johnson",
    group: "Frontend Team",
    status: "pending",
    createdAt: "2023-05-13T09:15:00Z",
  },
  {
    id: "mr-4",
    title: "Optimize database queries",
    creator: "Sarah Williams",
    group: "Backend Team",
    status: "merged",
    createdAt: "2023-05-12T16:20:00Z",
  },
  {
    id: "mr-5",
    title: "Update documentation",
    creator: "Mike Brown",
    group: "Documentation Team",
    status: "merged",
    createdAt: "2023-05-11T11:10:00Z",
  },
]

// Mock data for members
const members = [
  {
    id: "1",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "Admin",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Member",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    role: "Member",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "4",
    name: "Sarah Williams",
    email: "sarah.williams@example.com",
    role: "Member",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "5",
    name: "Mike Brown",
    email: "mike.brown@example.com",
    role: "Member",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export default function OrganizationDashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Organization Dashboard: {organization.name}</h2>
          <p className="text-muted-foreground">{organization.description}</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/organization/settings">Manage Organization</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total MRs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{organization.totalMRs}</div>
            <p className="text-xs text-muted-foreground">Total merge requests in the organization</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{organization.pendingMRs}</div>
            <p className="text-xs text-muted-foreground">MRs waiting for review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Merged MRs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{organization.mergedMRs}</div>
            <p className="text-xs text-muted-foreground">Successfully merged requests</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="mrs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="mrs">Merge Requests</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
        </TabsList>
        <TabsContent value="mrs" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Organization MRs</h3>
            <Button asChild>
              <Link href="/dashboard/merge-requests/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New MR
              </Link>
            </Button>
          </div>
          <MergeRequestList mergeRequests={mergeRequests} />
        </TabsContent>
        <TabsContent value="members" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Organization Members</h3>
            <Button asChild>
              <Link href="/dashboard/organization/invite">
                <UserPlus className="mr-2 h-4 w-4" />
                Invite Member
              </Link>
            </Button>
          </div>
          <MembersList members={members} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

