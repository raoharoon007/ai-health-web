import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axiosInstance";
import { getAuthToken } from "../utils/auth";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [profileImage, setProfileImage] = useState(null);
    const [userInfo, setUserInfo] = useState(null);

    // Load user data on mount
    const loadUserData = async () => {
        // Only load user data if token exists
        const token = getAuthToken();
        if (!token) {
            return;
        }

        try {
            const userRes = await api.get("/user/specific-user");
            const user = userRes.data?.data;

            if (user) {
                setUserInfo(user);
                if (user.profileimage_uri) {
                    setProfileImage(user.profileimage_uri);
                }
            }
        } catch (error) {
            console.error("Error loading user data:", error);
            // Don't retry if there's an error to avoid loops
        }
    };

    useEffect(() => {
        loadUserData();
    }, []);

    // Function to update profile image
    const updateProfileImage = (imageUrl) => {
        setProfileImage(imageUrl);
    };

    // Function to clear user data on logout
    const clearUserData = () => {
        setProfileImage(null);
        setUserInfo(null);
    };

    return (
        <UserContext.Provider value={{ profileImage, updateProfileImage, userInfo, setUserInfo, clearUserData }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook to use the UserContext
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};
