import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ChatOptionsMenu from "./ChatOptionsMenu";
import api from "../../api/axiosInstance";

const ChatList = ({ chats, setChats = () => { }, query = "", onChatClick }) => {
  const navigate = useNavigate();
  const { chatId } = useParams();

  const [menuIndex, setMenuIndex] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [apiError, setApiError] = useState("");

  // Bad data remove karein
  const validChats = chats.filter(chat => chat.id !== undefined && chat.id !== null);

  // Filtering Logic
  const filteredChats = query
    ? validChats.filter(chat =>
      chat.title?.toLowerCase().includes(query.toLowerCase())
    )
    : validChats;
  const handleDelete = async (index) => {
    setApiError("");
    const chatIdToDelete = filteredChats[index].id;

    try {
      await api.delete(`/conversation/delete-conversation/${chatIdToDelete}`);

      setChats(prev => prev.filter((chat) => chat.id !== chatIdToDelete));
      setMenuIndex(null);
      navigate("/chat");

    } catch (error) {
      console.error("Delete error:", error);
      const message = error.response?.data?.detail || "Delete failed. Please try again.";
      setApiError(message);
    }
  };

  const saveRename = async (index) => {
    if (!editValue.trim()) return;
    setApiError("");

    const chatIdToUpdate = filteredChats[index].id;

    try {
      await api.patch(`/conversation/update-title`, {
        conversation_id: chatIdToUpdate,
        title: editValue
      });
      setChats(prev => {
        const chatToUpdate = prev.find(c => c.id === chatIdToUpdate);
        const updatedChat = { ...chatToUpdate, title: editValue };
        const otherChats = prev.filter(c => c.id !== chatIdToUpdate);
        return [updatedChat, ...otherChats];
      });

      setEditingIndex(null);
    } catch (error) {
      const message = error.response?.data?.detail || "Rename failed. Please try again.";
      setApiError(message);
      setEditingIndex(null);
    }
  };

  const handleRename = (index) => {
    setApiError("");
    setEditingIndex(index);
    setEditValue(chats[index].title);
    setMenuIndex(null);
  };

  return (
    <>
      <div className="space-y-1 flex-1">

        {/* --- 1. NOT FOUND CHECK --- */}
        {query && filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-secondarytext text-sm font-medium">
              No chat found matching "{query}"
            </p>
          </div>
        ) : (
          /* --- 2. EXISTING LIST MAPPING --- */
          filteredChats.map((chat, index) => {
            const isActive = String(chat.id) === String(chatId);
            const isRenaming = editingIndex === index;

            return (
              <div
                key={`${chat.id}-${index}`}
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
          })
        )}
      </div>

      {apiError && (
        <div className="mt-4 w-full bg-warning/10 border border-warning/20 text-warning text-[10px] py-2 px-3 rounded-lg text-center font-medium italic">
          {apiError}
        </div>
      )}
    </>
  );
};

export default ChatList;