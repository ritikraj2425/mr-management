'use client'
import { UserGroups } from "@/components/group-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { AuthContext } from "@/hooks/use-context";
import { useContext } from "react";

export default function Profile() {
    const { jwtToken, refreshToken, userData, userGroups } = useContext(AuthContext) || { jwtToken: "", refreshToken: "" };

    return <>
        <div>
            <h2 className="text-3xl font-bold tracking-tight">{userData?.name} ({userData?.isAdmin ? "Admin" : "Member"})</h2>
            <h2 className="text-xl tracking-tight">{userData?.email}</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 md:mt-4 mt-2 lg:grid-cols-3">
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
                    <CardTitle className="text-sm font-medium">Your MRs</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{userData?.createdMRs?.length}</div>
                    <p className="text-xs text-muted-foreground">{userData?.createdMRs?.length} MRs created by you</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Assigned MRs</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{userData?.assignedMRs?.length}</div>
                    <p className="text-xs text-muted-foreground">{userData?.assignedMRs?.length} MRs assigned to you</p>
                </CardContent>
            </Card>
        </div>
        <UserGroups userGroups={userGroups}/>
    </>
}