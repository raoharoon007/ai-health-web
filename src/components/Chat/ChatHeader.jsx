import Logoutlogo from '../../assets/icons/Logout-icon.svg';
import Profilelogo from '../../assets/images/Profile-icon.png';
import Helathlogo from '../../assets/icons/Health-AI.svg';
import { Link, useNavigate } from "react-router-dom";
import { removeAuthToken } from '../../utils/auth';
import { useUser } from '../../context/UserContext';

const ChatHeader = () => {
    const navigate = useNavigate();
    const { profileImage, clearUserData } = useUser();

    const handleLogout = () => {
        clearUserData();
        removeAuthToken();
        navigate("/login", { replace: true });
    };

    return (
       <header className="h-20 border-b border-bordercolor bg-white flex items-center justify-between px-8.5 py-4.5 xs:px-10 sm:px-13 overflow-hidden">

            <div className="flex justify-center items-center">
                {/* ✅ Use as an img tag instead of a component */}
                <img src={Helathlogo} alt="Health AI Logo" />
            </div>

            <div className="flex items-center gap-3 xs:gap-6">
                <button onClick={handleLogout} className="cursor-pointer">
                    {/* ✅ Use as an img tag instead of a component */}
                    <img src={Logoutlogo} alt="Logout" />
                </button>
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
