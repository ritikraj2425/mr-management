'use client'
import Link from "next/link"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GroupCard } from "@/components/group-card"
import { MergeRequestList } from "@/components/merge-request-list"
import { useContext } from "react"
import { AuthContext } from "@/hooks/use-context"

export interface MR {
  _id: string;
  title: string;
  creator: string;
  groupId: { _id: string; name: string };
  link: string;
  reviewerEmails: any[];
  status: "open" | "pending" | "merged" | "closed" | "unknown";
  createdAt: string;
}


export default function DashboardPage() {

  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("ThemeContext is not provided. Wrap your component inside <ThemeProvider>.");
  }
  const {  userData, mrData, assignedMRs, userGroups} = authContext;
  const pendingMRsCount = (mrData as MR[])?.filter(mr => mr.status === "pending" || mr.status === "open").length;
  const mergedMRsCount = (mrData as MR[])?.filter(mr => mr.status === "merged" || mr.status === "closed").length;



  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Welcome, {userData?.name}</h2>
        <Button asChild>
          <Link href="/dashboard/merge-requests/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New MR/PR
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Groups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userData?.groupId?.length}</div>
            <p className="text-xs text-muted-foreground">You are a member of {userData?.groupId?.length} groups</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingMRsCount}</div>
            <p className="text-xs text-muted-foreground">{pendingMRsCount} MRs waiting for your review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your MRs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userData.assignedMRs.length}</div>
            <p className="text-xs text-muted-foreground">{mergedMRsCount} merged, {pendingMRsCount} pending review</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Your Groups</h3>
          <Button variant="outline" asChild>
            <Link href="/dashboard/groups">View All</Link>
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {userGroups?.slice(0,2)?.map((group: any) => (
            <GroupCard key={group._id} group={group} />
          ))}
          <Card className="flex h-full flex-col items-center justify-center border-dashed">
            <Link
              href="/dashboard/groups/new"
              className="flex h-full w-full flex-col items-center justify-center rounded-md p-6 text-center hover:bg-muted/50"
            >
              <PlusCircle className="mb-2 h-6 w-6 text-muted-foreground" />
              <p className="text-sm font-medium text-muted-foreground">Create or Join Group</p>
            </Link>
          </Card>
        </div>
      </div>



      <div className="space-y-4 ">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">MRs For You To Merge</h3>
          <Button variant="outline" asChild>
            <Link href="/dashboard/merge-requests">View All</Link>
          </Button>
        </div>
        <MergeRequestList mergeRequests={assignedMRs?.slice(-3).reverse()} />
      </div>
    </div>
  )
}

