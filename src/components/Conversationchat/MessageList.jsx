import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';

const MessageList = ({ messages, displayedText }) => {
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => { 
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); 
    };

    useEffect(() => { 
        scrollToBottom(); 
    }, [messages, displayedText]);

    return (
        <div className="flex-1 overflow-y-auto px-2 sm:px-5 custom-scrollbar bg-white">
            <div className="max-w-5xl mx-auto w-full space-y-4 sm:space-y-6 py-4 sm:py-8">
                {messages.map((msg, index) => (
                    <MessageBubble 
                        key={index} 
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