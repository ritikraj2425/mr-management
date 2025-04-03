'use client'
import { GroupCard } from "@/components/group-card";
import Loading from "@/components/ui/loading";
import { AuthContext } from "@/hooks/use-context";
import { useContext } from "react";

export default function AllGroups() {
    const authContext = useContext(AuthContext);

    if (!authContext) {
        throw new Error("AuthContext is not provided. Wrap your component inside <AuthProvider>.");
    }

    const { groupData , userData} = authContext;

    if (!groupData || !userData) {
        return <Loading />
    }
    if(!userData?.isAdmin){
        return <>You are not authorized</>
    }

    return <>
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Your Groups</h3>
            </div>
            {
                groupData ?
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {groupData?.map((group: any) => (
                            <GroupCard key={group._id} group={group} />
                        ))}
                    </div>
                    :
                    <div>
                        No group found
                    </div>
            }

        </div>
    </>
}