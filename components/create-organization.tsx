'use client'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Modal from "@/components/ui/modal";
import { AuthContext } from "@/hooks/use-context";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";


export const CreateOrganizationModal = ({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) => {
    const [orgName, setOrgName] = useState("");
    const [orgEmail, setOrgEmail] = useState("");
    const [otp, setOTP] = useState("");
    const [isOTP, setIsOTP] = useState(false);
    const [showOTPBox, setShowOTPBox] = useState(false);
    const [time, setTime] = useState(30);
    const [isLoading, setIsLoading] = useState(false);
    const { jwtToken, refreshToken } = useContext(AuthContext) || { jwtToken: "", refreshToken: "" };
    const { toast } = useToast();
    const router = useRouter();

    // Timer for OTP re-request
    const handleTimer = () => {
        const timer = setInterval(() => {
            setTime((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setIsOTP(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    // Request OTP for organization's email
    const handleOTPRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!orgEmail || !orgEmail.includes("@")) {
            toast({ title: "Invalid Email", description: "Please enter a valid email." });
            return;
        }
        setIsOTP(true);
        setTime(30);
        handleTimer();

        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/organization/generate-otp`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "apikey": process.env.NEXT_PUBLIC_API_KEY || "",
                    "jwttoken": jwtToken || "",
                    "refreshtoken": refreshToken || "",
                },
                body: JSON.stringify({ orgEmail: orgEmail, orgName: orgName }),
            });
            const data = await response.json();
            toast({
                title: response.ok ? "Success" : "Error",
                description: data.message,
            });
            if (!response.ok) {
                throw new Error(data.message || `HTTP error! Status: ${response.status}`);
            }
        } catch (error: unknown) {
            const errorMessage =
                error instanceof Error ? error.message : "Something went wrong.";
            toast({ title: "Error", description: errorMessage });
        }
    };

    // Create organization after OTP verification
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Basic validations
        if (!orgName || !orgEmail || otp.length !== 6) {
            toast({ title: "Error", description: "All fields are required and OTP must be 6 digits." });
            setIsLoading(false);
            return;
        }

        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/organization/create`;
            const response = await axios.post(
                url,
                {
                    orgEmail: orgEmail,
                    orgName: orgName,
                    otp,
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

            if (response.status == 201){
                onClose(); // close the modal
                setTimeout(() => {
                    setIsLoading(false);
                    router.push("/dashboard");
                }, 2000);
                toast({ title: "Success", description: response.data.message });
            } else {
                toast({ title: "Error", description: response.data.message });
                setIsLoading(false);
            }

        } catch (error: any) {
            console.error("Create Organization Failed:", error);
            toast({ title: "Error", description: error.response?.data?.message || "Something went wrong." });
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2 className="text-2xl font-bold mb-4">Create Organization</h2>
            <form onSubmit={handleSubmit}>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="orgName">Organization Name</Label>
                        <Input
                            id="orgName"
                            type="text"
                            placeholder="Your Organization Name"
                            value={orgName}
                            onChange={(e) => setOrgName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="orgEmail">Organization Email</Label>
                        <Input
                            id="orgEmail"
                            type="email"
                            placeholder="contact@organization.com"
                            value={orgEmail}
                            onChange={(e) => setOrgEmail(e.target.value)}
                            required
                        />
                    </div>
                    <Button
                        onClick={(e) => {
                            handleOTPRequest(e);
                            setShowOTPBox(true);
                        }}
                        disabled={isOTP}
                    >
                        {isOTP ? `Request again in ${time}` : "Request OTP"}
                    </Button>
                    {showOTPBox && (
                        <div className="grid gap-2">
                            <Label htmlFor="otp">Enter OTP</Label>
                            <Input
                                id="otp"
                                type="text"
                                maxLength={6}
                                placeholder="Enter 6-digit OTP"
                                value={otp}
                                onChange={(e) => setOTP(e.target.value.replace(/\D/g, ""))} // allow only digits
                                required
                            />
                        </div>
                    )}
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Creating organization..." : "Create Organization"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};