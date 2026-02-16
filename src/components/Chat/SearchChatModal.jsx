import { useState } from "react";
import ChatList from "./ChatList";
import CrossIcon from '../../assets/icons/Cross-icon.svg?react';

const SearchChatModal = ({ chats, onClose }) => {
  const [query, setQuery] = useState("");


  return (
    <div className="fixed inset-0 z-50 bg-black/5 backdrop-blur-sm flex items-center justify-center px-5">
      <div className="bg-white w-154.25 rounded-xl shadow-lg">
        <div className="flex justify-between items-center px-6 py-4 border-b border-bordercolor">
          <h3 className="text-lg text-primarytext font-medium">Search Chat</h3>
          <button onClick={onClose} className="cursor-pointer"><CrossIcon /></button>
        </div>

        <div className="p-6">
          <input
            placeholder="Search Chat"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full border font-normal text-sm text-primarytext placeholder:text-mutedtext focus:placeholder-transparent outline-none border-bordercolor rounded-xl px-4 py-3 hover:border-primary focus:outline-none"
          />
        </div>


        <div className="px-6 pb-6 max-h-64 overflow-y-auto space-y-3">
          <ChatList chats={chats} setChats={() => { }} query={query} onChatClick={onClose} showOptionsMenu={false} />
        </div>

      </div>
    </div>
  );
};

export default SearchChatModal;
