"use client";
import { createContext, ReactNode, useEffect, useState } from "react";
import axios from "axios";

interface AuthContextType {
    isAuthenticated: boolean;
    jwtToken: string | null;
    refreshToken: string | null;
    setAuthStatus: (status: boolean) => void;
    userData: any;
    organizationData: any;
    groupData: any;
    mrData: any;
    assignedMRs: any;
    myMrs: any;
    userGroups: any;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [jwtToken, setJwtToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [userData, setUserData] = useState<any>(null);
    const [organizationData, setOrganizationData] = useState<any>(null);
    const [groupData, setGroupData] = useState<any>(null);
    const [mrData, setMrData] = useState<any>(null);
    const [assignedMRs, setAssignedMRs] = useState<any>(null)
    const [myMrs, setMyMrs] = useState<any>(null)
    const [userGroups, setUserGroups] = useState<any>(null)

    // Check auth status and load tokens on mount
    useEffect(() => {
        const backendUrl = process.env.NEXT_PUBLIC_API_URL;
        axios
            .get(`${backendUrl}/auth/check`, { withCredentials: true })
            .then((res) => setIsAuthenticated(res.data.isAuthenticated))
            .catch(() => setIsAuthenticated(false));

        if (typeof window !== "undefined" && window.localStorage) {
            const token = localStorage.getItem("jwtToken");
            const refresh = localStorage.getItem("refreshToken");
            if (token) {
                setJwtToken(token);
            }
            if (refresh) {
                setRefreshToken(refresh);
            }
        }
    }, []);

    // Fetch user, organization, and group data when authenticated and tokens are available
    useEffect(() => {
        const fetchData = async () => {
            if (isAuthenticated && jwtToken && refreshToken) {
                try {
                    const backendUrl = process.env.NEXT_PUBLIC_API_URL;

                    // Fetch user data
                    const userResponse = await axios.get(`${backendUrl}/user/get`, {
                        headers: {
                            "Content-Type": "application/json",
                            "apikey": process.env.NEXT_PUBLIC_API_KEY || "",
                            "jwttoken": jwtToken,
                            "refreshtoken": refreshToken,
                        },
                        withCredentials: true,
                    });

                    if (userResponse.status === 200) {
                        const userData = userResponse.data.data;
                        setUserData(userData);

                        // Ensure groupId is an array of strings
                        const groupIds: string[] = userData.groupId || [];

                        if (Array.isArray(groupIds) && groupIds.length > 0) {
                            const mrRequests = groupIds.map(async (groupId: string) => {
                                try {
                                    const response = await axios.get(`${backendUrl}/mr/getGroup/${groupId}`,
                                        {
                                            headers: {
                                                "Content-Type": "application/json",
                                                "apikey": process.env.NEXT_PUBLIC_API_KEY || "",
                                                "jwttoken": jwtToken,
                                                "refreshtoken": refreshToken,
                                            },
                                            withCredentials: true,
                                        }
                                    );
                                    return response.data?.data || [];
                                } catch (error) {
                                    console.error(`Error fetching MR data for group ${groupId}:`, error);
                                    return []; // Return an empty array on failure to prevent breaking `Promise.all`
                                }
                            });

                            const mrResponses = await Promise.all(mrRequests);

                            setMrData(mrResponses.flat()); // Flatten and set MR data
                        }
                    }


                    // Fetch organization data
                    const orgResponse = await axios.get(`${backendUrl}/organization/get`, {
                        headers: {
                            "Content-Type": "application/json",
                            "apikey": process.env.NEXT_PUBLIC_API_KEY || "",
                            "jwttoken": jwtToken,
                            "refreshtoken": refreshToken,
                        },
                        withCredentials: true,
                    });
                    if (orgResponse.status === 200) {
                        setOrganizationData(orgResponse.data.data); // Use .data
                    }

                    const userGroupsRes = await axios.get(`${backendUrl}/group/get/user`, {
                        headers: {
                            "Content-Type": "application/json",
                            "apikey": process.env.NEXT_PUBLIC_API_KEY || "",
                            "jwttoken": jwtToken,
                            "refreshtoken": refreshToken,
                        },
                        withCredentials: true,
                    });
                    if (userGroupsRes.status === 200) {
                        setUserGroups(userGroupsRes.data.data); // Use .data
                    }

                    // Fetch group data
                    const groupResponse = await axios.get(`${backendUrl}/group/get`, {
                        headers: {
                            "Content-Type": "application/json",
                            "apikey": process.env.NEXT_PUBLIC_API_KEY || "",
                            "jwttoken": jwtToken,
                            "refreshtoken": refreshToken,
                        },
                        withCredentials: true,
                    });
                    if (groupResponse.status === 200) {
                        setGroupData(groupResponse.data.data); // Use .data
                    }

                    const assignedMRsResponse =await axios.get(`${backendUrl}/mr/getAssignedMR`, {
                        headers: {
                            "Content-Type": "application/json",
                            "apikey": process.env.NEXT_PUBLIC_API_KEY || "",
                            "jwttoken": jwtToken,
                            "refreshtoken": refreshToken,
                        },
                        withCredentials: true,
                    });
                    if(assignedMRsResponse.status == 200){
                            setAssignedMRs(assignedMRsResponse.data.data)
                    }

                    const myMRsResponse =await axios.get(`${backendUrl}/mr/getMyMr`, {
                        headers: {
                            "Content-Type": "application/json",
                            "apikey": process.env.NEXT_PUBLIC_API_KEY || "",
                            "jwttoken": jwtToken,
                            "refreshtoken": refreshToken,
                        },
                        withCredentials: true,
                    });
                    if(myMRsResponse.status == 200){
                            setMyMrs(myMRsResponse.data.data)
                    }

                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            }
        };

        fetchData();
    }, [isAuthenticated, jwtToken, refreshToken]);


    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                jwtToken,
                refreshToken,
                setAuthStatus: setIsAuthenticated,
                userData,
                organizationData,
                groupData,
                mrData,
                assignedMRs,
                myMrs,
                userGroups
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
