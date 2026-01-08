import { useState} from "react";
import { useNavigate, useParams } from "react-router-dom";
import ChatOptionsMenu from "./ChatOptionsMenu";

const ChatList = ({ chats, setChats = () => {}, query = "", onChatClick }) => {
  const navigate = useNavigate();
  const { chatId } = useParams(); // URL se ID nikalne ke liye

  const [menuIndex, setMenuIndex] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editValue, setEditValue] = useState("");

  const filteredChats = query
    ? chats.filter(chat =>
        chat.title.toLowerCase().includes(query.toLowerCase())
      )
    : chats;

  const handleDelete = (index) => {
    setChats(prev => prev.filter((_, i) => i !== index));
    setMenuIndex(null);
  };

  const handleRename = (index) => {
    setEditingIndex(index);
    setEditValue(chats[index].title);
    setMenuIndex(null);
  };

  const saveRename = (index) => {
    if (!editValue.trim()) return;

    setChats(prev =>
      prev.map((chat, i) =>
        i === index ? { ...chat, title: editValue } : chat
      )
    );
    setEditingIndex(null);
  };

  return (
    <div className="space-y-1">
      {filteredChats.map((chat, index) => {
        const isActive = String(chat.id) === String(chatId);
        const isRenaming = editingIndex === index; 

        return (
          <div
            key={chat.id}
            className={`group relative flex items-center justify-between rounded-lg px-2 transition-colors
              ${isActive || isRenaming ? "bg-secondarybtn" : "hover:bg-secondarybtn"}`} 
          >
            <button
              onClick={() => {
                if (!isRenaming) navigate(`/chat/${chat.id}`); 
                if (onChatClick) onChatClick();
              }}
              className="flex-1 text-left py-2 text-sm truncate cursor-pointer"
            >
              {isRenaming ? (
                <input
                  value={editValue}
                  autoFocus
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={() => saveRename(index)}
                  onKeyDown={(e) => e.key === "Enter" && saveRename(index)}
                  className="w-full bg-transparent outline-none text-sm text-primarytext border-b border-primary"
                />
              ) : (
                <span className={`${isActive ? "text-primary font-medium" : "text-secondarytext"}`}>
                  {chat.title}
                </span>
              )}
            </button>
            
            {!isRenaming && (
              <ChatOptionsMenu
                onRename={() => handleRename(index)}
                onDelete={() => handleDelete(index)}
                setMenuIndex={setMenuIndex}
                index={index}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ChatList;