import { useState } from "react";
import { Link } from "react-router-dom";
import Newchatlogo from '../../assets/icons/New-chat.svg?react';
import Searchlogo from '../../assets/icons/Search-icon.svg?react';
import SideMenuicon from '../../assets/icons/Tabler_menu.svg?react';
import ChatList from "./ChatList";
import SearchChatModal from "./SearchChatModal";


const ChatSidebar = ({ chats, setChats, loadMore, hasMore, loading }) => {

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <div className="fixed top-6.5 left-2 z-50 md:hidden">
        <SideMenuicon
          className="text-2xl cursor-pointer text-primarytext"
          onClick={() => setIsSidebarOpen(true)}
        />
      </div>

      <aside className={`
        fixed top-0 left-0 h-full z-50 bg-white border-r border-bordercolor
        w-60 transform transition-transform duration-300 ease-in-out
        md:static md:translate-x-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        flex flex-col
      `}>
        <div className="flex items-center justify-between md:hidden p-4 border-b border-bordercolor">
          <SideMenuicon
            className="text-2xl cursor-pointer text-primarytext"
            onClick={() => setIsSidebarOpen(false)}
          />
        </div>

        <div className="flex flex-col h-full items-center gap-2 px-1 py-5">
          <Link to='/chat' className="flex items-center py-2 px-3.5 cursor-pointer hover:bg-secondarybtn w-full gap-4 rounded-xl" >
            <Newchatlogo className="flex shrink-0" />
            <span className="text-sm font-normal text-primarytext flex items-center">
              New Chat
            </span>
          </Link>

          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center py-2 px-3.5 cursor-pointer hover:bg-secondarybtn w-full gap-4 rounded-xl"
          >
            <Searchlogo className="flex shrink-0" />
            <span className="text-sm font-normal text-primarytext flex items-center">
              Search Chat
            </span>
          </button>

          <div className="flex-1 overflow-y-auto mt-2 w-full px-2 custom-scrollbar">
            <h3 className="text-xs font-medium text-mutedtext mb-2 px-1.25">Chats</h3>
            
            <ChatList 
                chats={chats} 
                setChats={setChats} 
                loadMore={loadMore} 
                hasMore={hasMore} 
                loading={loading} 
            />
          </div>
        </div>
      </aside>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-25 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {isSearchOpen && (
        <SearchChatModal
          chats={chats}
          setChats={setChats}
          onClose={() => setIsSearchOpen(false)}
        />
      )}
    </>
  );
};

export default ChatSidebar;