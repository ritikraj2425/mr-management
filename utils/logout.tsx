import axios from "axios";
import { toast } from "@/hooks/use-toast"; // Assuming you have a toast hook

const logout = async () => {
    try {
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
            {},
            { withCredentials: true } // Ensure cookies are sent along with the request
        );
        // Optionally, clear any client-side state or localStorage tokens if needed
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login"; // Redirect to home or login page
        toast({ title: "Success", description: response.data.message });
    } catch (error) {
        console.error("Logout failed:", error);
        toast({ title: "Error", description: "Logout failed. Please try again." });
    }
};

export default logout;
