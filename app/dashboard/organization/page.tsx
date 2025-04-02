'use client'
import Link from "next/link"
import { PlusCircle, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MembersList } from "@/components/members-list"
import { useContext } from "react"
import { AuthContext } from "@/hooks/use-context"
import Loading from "@/components/ui/loading"


export default function OrganizationDashboardPage() {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext is not provided. Wrap your component inside <AuthProvider>.");
  }

  const { organizationData, userData } = authContext;

  if (!organizationData) {
    return <Loading />
  }

  const members = organizationData?.members

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Organization Dashboard: {organizationData?.orgName}</h2>
          <p className="text-muted-foreground">Your Organization have {organizationData?.members?.length} members</p>
        </div>
        {
          userData?.isAdmin ?
            <Button asChild>
              <Link href="/dashboard/organization/settings">Manage Organization</Link>
            </Button>
            :
            <></>
        }

      </div>

      <Tabs defaultValue="members" className="space-y-4">
        <TabsList>
          {/* <TabsTrigger value="mrs">Merge Requests</TabsTrigger> */}
          <TabsTrigger value="members">Members</TabsTrigger>
        </TabsList>
        <TabsContent value="members" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Organization Members</h3>
            {
              userData?.isAdmin ?
                <Button asChild>
                  <Link href="/dashboard/organization/invite">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Invite Member
                  </Link>
                </Button>
                :
                <></>
            }
          </div>
          <MembersList members={members} isAdmin={userData.isAdmin} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

