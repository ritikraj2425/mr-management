"use client";

import { MergeRequestList } from "@/components/merge-request-list";
import { AuthContext } from "@/hooks/use-context";
import { useContext, useEffect, useState } from "react";

// Define the type for MR (adjust fields as needed)
// interface MergeRequest {
//   _id: string;
//   title: string;
//   status: string;
//   createdAt: string;
//   // Add other fields if needed
// }

export default function AssignedMRsPage() {
    const [reversedMRs, setReversedMRs] = useState<any>(null);
    const authContext = useContext(AuthContext);

    if (!authContext) {
        throw new Error("AuthContext is not provided. Wrap your component inside <AuthProvider>.");
    }

    const { assignedMRs } = authContext;

    useEffect(() => {
        if (assignedMRs) {
            setReversedMRs([...assignedMRs].reverse());
        }
    }, [assignedMRs]);

    return <MergeRequestList mergeRequests={reversedMRs} />;
}
