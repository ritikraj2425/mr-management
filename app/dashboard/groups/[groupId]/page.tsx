'use client'
import Link from "next/link"
import { PlusCircle, UserPlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MergeRequestList } from "@/components/merge-request-list"
import { MembersList } from "@/components/members-list"
import axios from "axios"
import { useParams } from "next/navigation"
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "@/hooks/use-context"
import Loading from "@/components/ui/loading"

type Group = {
    name: string;
    members: any;
    organizationId: string;
    MRs: any;
    description: string;
    authorizedPlatforms: string[];
    createdAt: string;
    updatedAt: string;
    _id: string;
};


export default function GroupDashboardPage() {
    const { groupId } = useParams();
    const [group, setGroup] = useState<Group | null>(null);
    const backendUrl = process.env.NEXT_PUBLIC_API_URL;
    const authContext = useContext(AuthContext);

    if (!authContext) {
        throw new Error("AuthContext is not provided. Wrap your component inside <AuthProvider>.");
    }

    const { jwtToken, refreshToken, userData } = authContext;
    useEffect(() => {
        const fetchGroupData = async () => {
            if (!groupId) return;

            try {
                const response = await axios.get(`${backendUrl}/group/get?groupId=${groupId}`, {
                    headers: {
                        "Content-Type": "application/json",
                        "apikey": process.env.NEXT_PUBLIC_API_KEY || "",
                        "jwttoken": jwtToken,
                        "refreshtoken": refreshToken,
                    },
                    withCredentials: true,
                });
                setGroup(response.data.data[0]);
            } catch (error) {
                console.error("Error fetching group data:", error);
            }
        };

        fetchGroupData();
    }, [groupId]);


    if (!group) {
        return <Loading />
    }



    const groupMembers = group?.members
    const MRData = group?.MRs ? [...group.MRs].reverse() : [];


    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Group Dashboard: {group?.name}</h2>
                    <p className="text-muted-foreground">Your group has {group?.members?.length} members</p>
                </div>
                {
                    userData.isAdmin ?
                        <Button asChild>
                            <Link href={`/dashboard/group/${groupId}/settings`}>Manage Group</Link>
                        </Button>
                        :
                        <></>
                }
            </div>

            {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
            </div> */}

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
                    <MergeRequestList mergeRequests={MRData} />
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
                    <MembersList members={groupMembers} isAdmin={userData.isAdmin} />
                </TabsContent>
            </Tabs>
        </div>
    )
}