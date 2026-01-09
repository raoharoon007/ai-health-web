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

    // Typewriter Logic

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

        // Update Global State
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
        <div className="relative flex flex-col w-full h-full bg-white overflow-hidden px-4">

            {/* 1. TOP FIXED SECTION: Bot Icon remains fixed*/}
            <div className="flex-none pt-8 pb-4 bg-white z-10 ">
                <div className="h-35 w-35 mx-auto transition-all duration-300 flex justify-center items-center rounded-[260px] bg-blue-500/10">
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
                    {isRecording && (
                        <span className="text-black font-semibold text-base animate-pulse">Listening....</span>
                    )}
                    {isTranscribing && !isRecording && (
                        <span className="text-black font-semibold text-base">Transcribing....</span>
                    )}
                    {botStatus === "reviewing" && (
                        <span className="text-black font-semibold text-base">Reviewing your input...</span>
                    )}
                </div>
            </div>

            {/* 2. MIDDLE SCROLLABLE SECTION: only messages scroll*/}
            <div className="flex-1 overflow-y-auto px-5 custom-scrollbar bg-white">
                <div className="max-w-5xl mx-auto w-full space-y-6 py-8">
                    {currentMessages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                            <div className={`
                                max-w-[85%] sm:max-w-[75%] px-5 py-3 rounded-2xl text-[15px] leading-relaxed
                                wrap-break-word whitespace-pre-wrap overflow-hidden
                                ${msg.role === "user" ? "bg-primary text-white rounded-tr-none" : "bg-white text-primarytext border border-bordercolor rounded-tl-none"}
                            `}>
                                {msg.files && msg.files.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {msg.files.map((f, i) => (
                                            <div key={i} className="relative rounded-lg overflow-hidden border border-white/20">
                                                {f.preview ? (
                                                    <img src={f.preview} alt="upload" className="h-32 w-32 object-cover rounded-lg" />
                                                ) : (
                                                    <div className="h-16 w-32 flex items-center justify-center bg-black/10 rounded-lg text-[10px] font-bold uppercase p-2">
                                                        {f.file.name.split('.').pop()} File
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
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

            {/* 3. BOTTOM FIXED SECTION: Input aur Disclaimer */}
            <div className="flex-none bg-white px-5 ">
                <div className="max-w-5xl mx-auto py-2">
                    <ChatInput
                        onRecordingChange={handleRecordingChange}
                        onSend={handleSendMessage}
                        onStop={handleStopChat}
                        disabled={botStatus !== "idle"}
                        isTranscribing={isTranscribing}
                    />
                    <div className="flex justify-center py-2">
                        <span className="text-center text-mutedtext font-light text-sm">
                            AI can make mistakes. Consider checking important information.
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatConversation;