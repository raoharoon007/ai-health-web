import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axiosInstance";
import { getAuthToken } from "../utils/auth";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [profileImage, setProfileImage] = useState(null);
    const [userInfo, setUserInfo] = useState(null);

    const loadUserData = async () => {
        const token = getAuthToken();
        if (!token) {
            return;
        }

        try {
            const userRes = await api.get("/user/specific-user");
            const user = userRes.data?.data;

            if (user) {
                setUserInfo(user);
                setProfileImage(user.profileimage_uri || null);
            }
        } catch (error) {
            console.error("Error loading user data:", error);
        }
    };

    useEffect(() => {
        loadUserData();
        const handleAuthChange = () => {
            const token = getAuthToken();
            if (token) {
                loadUserData();
            } else {
                setProfileImage(null);
                setUserInfo(null);
            }
        };

        window.addEventListener("auth-change", handleAuthChange);

        return () => {
            window.removeEventListener("auth-change", handleAuthChange);
        };
    }, []);

    const updateProfileImage = (imageUrl) => {
        setProfileImage(imageUrl);
    };

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

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};
