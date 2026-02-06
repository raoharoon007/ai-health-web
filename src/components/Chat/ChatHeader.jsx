import Logoutlogo from '../../assets/icons/Logout-icon.svg?react';
import Profilelogo from '../../assets/images/Profile-icon.png';
import Helathlogo from '../../assets/icons/Health-AI.svg?react';
import { Link, useNavigate } from "react-router-dom";
import { removeAuthToken } from '../../utils/auth';
import { useUser } from '../../context/UserContext';

const ChatHeader = () => {
    const navigate = useNavigate();
    const { profileImage, clearUserData } = useUser();

    const handleLogout = () => {
        // Clear user data from context first
        clearUserData();
        // Remove authentication token
        removeAuthToken();
        // Navigate to login page
        navigate("/login", { replace: true });
    };

    return (
        <header className="h-20 border-b border-bordercolor bg-white flex items-center justify-between px-8.5 py-4.5 xs:px-10 sm:px-13 overflow-hidden">

            <div className="flex justify-center items-center">
                <Helathlogo />
            </div>

            <div className="flex items-center gap-3 xs:gap-6">

                {/* Logout Button */}
                <button onClick={handleLogout} className="cursor-pointer">
                    <Logoutlogo />
                </button>

                {/* Profile */}
                <Link to="/setting">
                    <img
                        src={profileImage || Profilelogo}
                        alt="Profile logo"
                        className="size-11 object-cover rounded-full"
                    />
                </Link>

            </div>
        </header>
    );
};

export default ChatHeader;
