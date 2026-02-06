import { useState, useEffect, useRef } from 'react'; 
import { Outlet } from 'react-router-dom';
import ChatHeader from '../Chat/ChatHeader';
import ChatSidebar from '../Chat/ChatSidebar';
import api from '../../api/axiosInstance'; 

const MainLayout = () => {
  const [chats, setChats] = useState([]); 
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
        setLoading(false);
        return; 
    }

    const fetchConversations = async () => {
      if (hasFetched.current) return;
      hasFetched.current = true;

      try {
        const response = await api.get("/conversation/get-all-conversation");
        const formattedChats = response.data.map(conv => ({
          id: conv._id, 
          title: conv.title || "New Conversation",
          messages: [],
          createdAt: conv.created_at || conv.updated_at || new Date().toISOString()
        }));
        
        formattedChats.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        setChats(prev => {
            const combined = [...formattedChats, ...prev];
            return Array.from(new Map(combined.map(item => [item.id, item])).values());
        });

      } catch (error) {
        console.error("Error fetching conversations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  return (
    <div className="h-screen flex flex-col bg-bodybg overflow-hidden z-0">
      <ChatHeader />
      <div className="flex flex-1 z-30 overflow-hidden">
        <ChatSidebar chats={chats} setChats={setChats} />
        <main className="flex-1 flex justify-center overflow-y-auto">
          <Outlet context={{ chats, setChats }} />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;