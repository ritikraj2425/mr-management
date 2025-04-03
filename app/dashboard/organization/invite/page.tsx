'use client'
import { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { AuthContext } from "@/hooks/use-context";

const EmailInput = () => {
    const [emails, setEmails] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { jwtToken, refreshToken } = useContext(AuthContext) || { jwtToken: "", refreshToken: "" };

    // Function to add valid emails
    const addEmails = (input: string) => {
        const emailArray = input
            .split(/[\s,]+/) // Split by space or comma
            .map((email) => email.trim()) // Trim spaces
            .filter((email) => email && /\S+@\S+\.\S+/.test(email)); // Validate email

        setEmails((prevEmails) => [...new Set([...prevEmails, ...emailArray])]); // Avoid duplicates
        setInputValue(""); // Clear input field
    };

    // Handle Enter key press
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addEmails(inputValue);
        }
    };

    // Handle Paste Event
    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedText = e.clipboardData.getData("Text");
        addEmails(pastedText);
    };

    // Remove email from list
    const removeEmail = (emailToRemove: string) => {
        setEmails(emails.filter((email) => email !== emailToRemove));
    };

    const handleAddMembers = async () => {
        setIsLoading(true);
        if (!emails) {
            toast({ title: "Error", description: "All fields are required." });
            setIsLoading(false);
            return;
        }

        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/organization/addMembers`;
            const response = await axios.post(
                url,
                {
                    emails: emails
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
                const { message, addedMembers, invitationEmailsSent, errors } = response.data;
                const description = `${message}
                Added Members: ${addedMembers && addedMembers.length > 0
                        ? addedMembers.map((member: any) => member.name).join(', ')
                        : 'None'
                    }
                Invitation Emails Sent: ${invitationEmailsSent && invitationEmailsSent.length > 0
                        ? invitationEmailsSent.join(', ')
                        : 'None'
                    }
                Errors: ${errors && errors.length > 0
                        ? errors.join(', ')
                        : 'None'
                    }`;

                toast({ title: "Success", description });



            } else {
                toast({ title: "Error", description: response.data.error });
                setIsLoading(false);
            }

        } catch (error: any) {
            console.error("Create Organization Failed:", error);
            toast({ title: "Error", description: error.response?.data?.error || "Something went wrong." });
            setIsLoading(false);
        }
    }

    return (
        <div className="space-y-3">
            {/* Display selected emails */}
            <div className="flex flex-wrap gap-2">
                {emails.map((email) => (
                    <div key={email} className="flex items-center bg-black px-3 py-1 rounded-lg">
                        <span className="text-white">{email}</span>
                        <Button
                            onClick={() => removeEmail(email)}
                            className="ml-2 text-white font-bold"
                        >
                            ×
                        </Button>
                    </div>
                ))}
            </div>

            {/* Input Field */}
            <Input
                type="text"
                placeholder="Please write or paste organization email IDs..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown} // Capture Enter key
                onPaste={handlePaste} // Capture paste
            />

            {/* Invite Button */}
            <Button disabled={isLoading} onClick={() => handleAddMembers()}>
                {isLoading ? "Processing Members" : "Invite Members"}
            </Button>
        </div>
    );
};

export default EmailInput;
