import { useState, useEffect, useRef } from 'react'; 
import { Outlet } from 'react-router-dom';
import ChatHeader from '../Chat/ChatHeader';
import ChatSidebar from '../Chat/ChatSidebar';
import api from '../../api/axiosInstance'; 

const MainLayout = () => {
  const [chats, setChats] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [isFetchingMore, setIsFetchingMore] = useState(false); 
  
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 15;

  const hasFetchedInfo = useRef(false);

  const fetchConversations = async (pageNum) => {
    try {
      if (pageNum > 1) setIsFetchingMore(true);

      const response = await api.get(`/conversation/get-all-conversation?page=${pageNum}&limit=${LIMIT}`);
      const newData = response.data.data || response.data || []; 

      if (!Array.isArray(newData) || newData.length === 0) {
        setHasMore(false);
        setIsFetchingMore(false);
        return;
      }

      const formattedChats = newData.map(conv => ({
        id: conv._id, 
        title: conv.title || "New Conversation",
        messages: [],
        createdAt: conv.created_at || conv.updated_at || new Date().toISOString()
      }));
      
      setChats(prev => {
        const allNewAreDuplicates = formattedChats.every(newChat => 
            prev.some(existing => existing.id === newChat.id)
        );

        if (allNewAreDuplicates && pageNum > 1) {
            setHasMore(false); 
            return prev; 
        }

        if (newData.length < LIMIT) {
            setHasMore(false);
        }

        const combined = [...prev, ...formattedChats];
        const uniqueChats = Array.from(new Map(combined.map(item => [item.id, item])).values());
        
        return uniqueChats.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      });

    } catch (error) {
      console.error("Error fetching conversations:", error);
      setHasMore(false); 
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
        setLoading(false);
        return; 
    }

    if (!hasFetchedInfo.current) {
        hasFetchedInfo.current = true;
        fetchConversations(1);
    }
  }, []);

  const loadMoreChats = () => {
    if (!loading && !isFetchingMore && hasMore) {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchConversations(nextPage);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-bodybg overflow-hidden z-0">
      <ChatHeader />
      <div className="flex flex-1 z-30 overflow-hidden">
        <ChatSidebar 
            chats={chats} 
            setChats={setChats} 
            loadMore={loadMoreChats} 
            hasMore={hasMore}
            loading={isFetchingMore} 
        />
        <main className="flex-1 flex justify-center overflow-y-auto">
          <Outlet context={{ chats, setChats }} />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;