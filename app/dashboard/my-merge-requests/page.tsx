"use client";

import { MergeRequestList } from "@/components/merge-request-list";
import { AuthContext } from "@/hooks/use-context";
import { useContext, useEffect, useState } from "react";



export default function AssignedMRsPage() {
    const [reversedMRs, setReversedMRs] = useState<any>(null);
    const authContext = useContext(AuthContext);

    if (!authContext) {
        throw new Error("AuthContext is not provided. Wrap your component inside <AuthProvider>.");
    }

    const { myMrs } = authContext;

    useEffect(() => {
        if (myMrs) {
            setReversedMRs([...myMrs].reverse());
        }
    }, [myMrs]);

    return <MergeRequestList mergeRequests={reversedMRs} />;
}
