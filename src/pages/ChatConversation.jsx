import { useState, useEffect, useRef } from "react";
import Chatbotlogo from '../assets/images/Chatbot.webp';
import ListeningAvatar from '../assets/images/ListeningAvatar.webp';
import Reviewbot from '../assets/images/Reviewbot.webp';
import Botvideo from '../assets/videos/Botvideo.mp4';
import ChatInput from "../components/Chat/ChatInput";
import { useLocation, useParams, useOutletContext } from "react-router-dom";

const ChatConversation = () => {
    const { chatId } = useParams();
    const { chats, setChats } = useOutletContext();
    const { state } = useLocation();
    const [isRecording, setIsRecording] = useState(false);
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [botStatus, setBotStatus] = useState("idle");
    const [displayedText, setDisplayedText] = useState("");
    const lastProcessedChatId = useRef(null);
    const messagesEndRef = useRef(null);
    const typingIntervalRef = useRef(null);
    const currentChat = chats.find(c => c.id === chatId);
    const currentMessages = currentChat ? currentChat.messages : [];

    useEffect(() => {
        if (currentMessages.length === 1 && state?.triggerBot) {
            if (lastProcessedChatId.current !== chatId) {
                lastProcessedChatId.current = chatId;
                handleBotReply();
            }
        }
    }, [currentChat, chatId, state]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [currentMessages, displayedText]);

    const startTyping = (fullText) => {
        let index = 0;
        setDisplayedText("");
        if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = setInterval(() => {
            if (index < fullText.length) {
                setDisplayedText((prev) => prev + fullText.charAt(index));
                index++;
            } else {
                completeTyping(fullText);
            }
        }, 40);
    };

    const completeTyping = (fullText) => {
        clearInterval(typingIntervalRef.current);
        setChats(prev => prev.map(chat =>
            chat.id === chatId
                ? {
                    ...chat,
                    messages: chat.messages.map((m, idx) =>
                        (idx === chat.messages.length - 1 && m.isTyping)
                            ? { role: "assistant", text: fullText }
                            : m
                    )
                }
                : chat
        ));
        setDisplayedText("");
        setBotStatus("idle");
    };

    const handleSendMessage = (text, attachedFiles = []) => {
        if (!text.trim() && attachedFiles.length === 0) return;
        setIsRecording(false);
        setIsTranscribing(false);
        lastProcessedChatId.current = chatId;
        const userMsg = { role: "user", text, files: attachedFiles };
        setChats(prev => prev.map(chat =>
            chat.id === chatId ? { ...chat, messages: [...chat.messages, userMsg] } : chat
        ));
        handleBotReply();
    };

    const handleBotReply = () => {
        setBotStatus("reviewing");
        setTimeout(() => {
            setBotStatus("replying");
            const botFullReply = "I have received your message and analyzed the details. How else can I assist you today?";
            setChats(prev => prev.map(chat =>
                chat.id === chatId
                    ? { ...chat, messages: [...chat.messages, { role: "assistant", text: "", isTyping: true }] }
                    : chat
            ));
            startTyping(botFullReply);
        }, 2000);
    };

    const handleStopChat = () => {
        if (typingIntervalRef.current) {
            completeTyping(displayedText);
        }
    };

    const handleRecordingChange = (s) => {
        setIsRecording(s);
        if (!s) {
            setIsTranscribing(true);
            setTimeout(() => setIsTranscribing(false), 1500);
        }
    };

    return (
        <div className="relative flex flex-col w-full h-full bg-white overflow-hidden sm:px-4 px-2">

            {/* 1. TOP FIXED SECTION */}
            <div className="flex-none pt-4 sm:pt-8 pb-2 sm:pb-4 bg-white z-10 ">
                <div className="h-24 w-24 sm:h-35 sm:w-35 mx-auto transition-all duration-300 flex justify-center items-center rounded-full bg-blue-500/10">
                    {botStatus === "replying" ? (
                        <video src={Botvideo} autoPlay loop muted className="h-full w-full object-contain rounded-full" />
                    ) : (
                        <img
                            src={isRecording ? ListeningAvatar : botStatus === "reviewing" ? Reviewbot : Chatbotlogo}
                            alt="Bot"
                            className="h-full w-full object-contain rounded-full"
                        />
                    )}
                </div>
                <div className="h-6 flex items-center justify-center mt-2">
                    <span className="text-black font-semibold text-sm sm:text-base">
                        {isRecording && <span className="animate-pulse">Listening....</span>}
                        {isTranscribing && !isRecording && "Transcribing...."}
                        {botStatus === "reviewing" && "Reviewing your input..."}
                    </span>
                </div>
            </div>

            {/* 2. MIDDLE SCROLLABLE SECTION */}
            <div className="flex-1 overflow-y-auto px-2 sm:px-5 custom-scrollbar bg-white">
                <div className="max-w-5xl mx-auto w-full space-y-4 sm:space-y-6 py-4 sm:py-8">
                    {currentMessages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                            <div className={`
                                max-w-[90%] sm:max-w-[75%] px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl text-[14px] sm:text-[15px] leading-relaxed
                                wrap-break-word whitespace-pre-wrap overflow-hidden
                                ${msg.role === "user" ? "bg-primary text-white rounded-tr-none" : "bg-white text-primarytext border border-bordercolor rounded-tl-none"}
                            `}>
                                {/* --- UPDATED FILES DISPLAY --- */}
                                {msg.files && msg.files.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {msg.files.map((f, i) => {
                                            // Agar preview nahi hai (state se aya hai), to naya URL banayein
                                            const fileUrl = f.preview || (f.file ? URL.createObjectURL(f.file) : null);
                                            const isImage = f.file?.type?.startsWith("image/");
                                            const isVideo = f.file?.type?.startsWith("video/");

                                            return (
                                                <div key={i} className="relative rounded-lg overflow-hidden border border-bordercolor shadow-sm bg-gray-50">
                                                    {isImage ? (
                                                        <img src={fileUrl} alt="upload" className="h-24 w-24 sm:h-32 sm:w-32 object-cover" />
                                                    ) : isVideo ? (
                                                        <video src={fileUrl} className="h-24 w-24 sm:h-32 sm:w-32 object-cover" controls={false} />
                                                    ) : (
                                                        <div className="h-20 w-20 sm:h-24 sm:w-24 flex flex-col items-center justify-center p-2 text-center">
                                                            <span className="text-[10px] font-bold text-primary uppercase">
                                                                {f.file?.name?.split('.').pop() || 'FILE'}
                                                            </span>
                                                            <p className="text-[8px] truncate w-full mt-1 text-gray-500">
                                                                {f.file?.name}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                                {/* --- END FILES DISPLAY --- */}

                                <div>
                                    {msg.isTyping ? displayedText : msg.text}
                                    {msg.isTyping && displayedText === "" && <span className="animate-pulse">...</span>}
                                </div>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* 3. BOTTOM FIXED SECTION */}
            <div className="flex-none bg-white px-1 sm:px-5">
                <div className="max-w-5xl mx-auto py-2">
                    <div className="w-full">
                        <ChatInput
                            onRecordingChange={handleRecordingChange}
                            onSend={handleSendMessage}
                            onStop={handleStopChat}
                            disabled={botStatus !== "idle"}
                            isTranscribing={isTranscribing}
                        />
                    </div>
                    <div className="flex justify-center py-2">
                        <span className="text-center text-mutedtext font-light text-[10px] sm:text-sm">
                            AI can make mistakes. Consider checking important information.
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatConversation;