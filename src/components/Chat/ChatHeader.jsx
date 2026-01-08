import Logoutlogo from '../../assets/icons/Logout-icon.svg?react';
import Profilelogo from '../../assets/icons/Profile-icon.svg?react';
import Helathlogo from '../../assets/icons/Health-AI.svg?react';
import { Link } from "react-router-dom";

const ChatHeader = () => {
    return (
        <header className="h-20 border-b border-bordercolor bg-white flex items-center justify-between px-8.5 py-4.5 xs:px-10 sm:px-13 overflow-hidden">

            <div className="flex justify-center items-center ">
                <Helathlogo/>
            </div>
            <div className="flex items-center gap-3 xs:gap-6">

                <Link to="/login">
                    <Logoutlogo />
                </Link>

                <Link to="/setting">
                    <Profilelogo />
                </Link>
            </div>
            
        </header>

    );
}

export default ChatHeader;
