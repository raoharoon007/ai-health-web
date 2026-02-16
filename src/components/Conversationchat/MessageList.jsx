import React, { useEffect, useRef, useLayoutEffect } from 'react';
import MessageBubble from './MessageBubble';

const MessageList = ({ messages, displayedText, loadMore, hasMore, loading }) => {
    const messagesEndRef = useRef(null);
    const containerRef = useRef(null);
    const prevScrollHeight = useRef(0); 
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleScroll = () => {
        const container = containerRef.current;
        if (!container) return;

        if (container.scrollTop === 0 && hasMore && !loading) {
            prevScrollHeight.current = container.scrollHeight;
            loadMore(); 
        }
    };

    useLayoutEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        if (prevScrollHeight.current > 0) {
            const newScrollHeight = container.scrollHeight;
            container.scrollTop = newScrollHeight - prevScrollHeight.current;
            
            prevScrollHeight.current = 0;
        } 
        else {
            scrollToBottom();
        }
    }, [messages, displayedText]); 

    return (
        <div 
            ref={containerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto px-2 sm:px-5 custom-scrollbar bg-white"
        >
            <div className="max-w-5xl mx-auto w-full space-y-4 sm:space-y-6 py-4 sm:py-8">
                
                {loading && hasMore && (
                    <div className="flex justify-center py-2 w-full">
                        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}

                {messages.map((msg, index) => (
                    <MessageBubble 
                        key={msg.id || index} 
                        msg={msg} 
                        displayedText={displayedText} 
                    />
                ))}
                
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
};

export default MessageList;