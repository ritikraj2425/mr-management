'use client'
import { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { AuthContext } from "@/hooks/use-context";
import AutoCompleteSearch from "../../merge-requests/new/autoCompleteSearch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const EmailInput = () => {
    const [group, setGroup] = useState("");
    const [selectedMembers, setSelectedMembers] = useState<any>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { jwtToken, refreshToken, organizationData, groupData } = useContext(AuthContext) || { jwtToken: "", refreshToken: "", organizationData: [] };
    console.log(group);

    const handleAddMembers = async () => {
        setIsLoading(true);
        if (!selectedMembers || !group) {
            toast({ title: "Error", description: "All fields are required." });
            setIsLoading(false);
            return;
        }

        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/group/addMembers`;
            const response = await axios.post(
                url,
                {
                    emails: selectedMembers,
                    groupId: group,
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
            if (response.status == 200) {
                setTimeout(() => {
                    setIsLoading(false);
                }, 2000);
                toast({ title: "Success", description: response.data.addedMembers});
            } else {
                toast({ title: "Error", description: response.data.message });
                setIsLoading(false);
            }
        } catch (error: any) {
            console.error("Create Organization Failed:", error);
            toast({ title: "Error", description: error.response?.data?.message || "Something went wrong." });
            setIsLoading(false);
        }
    }
    return (
        <div className="space-y-3">
            <Label>Search for members</Label>
            <AutoCompleteSearch members={organizationData.members} onSelectMembers={setSelectedMembers} />
            <div>
                <Label htmlFor="group">Select Group</Label>
                <div></div>
                <Select value={group} onValueChange={setGroup} required>
                    <SelectTrigger id="group">
                        <SelectValue placeholder="Select a group" />
                    </SelectTrigger>
                    <SelectContent>
                        {groupData?.map((group: any) => (
                            <SelectItem key={group._id} value={group._id}>
                                {group.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <Button disabled={isLoading} onClick={() => handleAddMembers()}>
                {isLoading ? "Processing Members" : "Invite Members"}
            </Button>

        </div>
    );
};

export default EmailInput;
