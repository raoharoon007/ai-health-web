import { useState, useRef, useEffect } from "react";
import Chatbotlogo from '../../assets/images/Chatbot.webp';
import ListeningAvatar from '../../assets/images/ListeningAvatar.webp';
import Reviewbot from '../../assets/images/Reviewbot.webp';
import Botvideo from '../../assets/videos/Botvideo.mp4';
import ChatInput from "./ChatInput";
import AuthOverlay from "../Authoverlay/AuthOverlay";

const NewChat = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [messages, setMessages] = useState([]);
    const [botStatus, setBotStatus] = useState("idle");
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [displayedText, setDisplayedText] = useState(""); // Typewriter text state
    const messagesEndRef = useRef(null);
    const [showOverlay, setShowOverlay] = useState(false);
    const typingIntervalRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Scroll trigger on messages and typing text
    useEffect(() => {
        scrollToBottom();
    }, [messages, displayedText]);

    // Show Auth Overlay on mount
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowOverlay(true);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const handleRecordingChange = (recordingState) => {
        setIsRecording(recordingState);
        if (recordingState === false) {
            setIsTranscribing(true);
            setTimeout(() => {
                setIsTranscribing(false);
            }, 1500);
        } else {
            setIsTranscribing(false);
        }
    };
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
                clearInterval(typingIntervalRef.current);
                setMessages((prev) => {
                    const lastMsg = prev[prev.length - 1];
                    if (lastMsg && lastMsg.isTyping) {
                        const newMsgs = [...prev];
                        newMsgs[newMsgs.length - 1] = { role: "assistant", text: fullText };
                        return newMsgs;
                    }
                    return prev;
                });
                setDisplayedText("");
                setBotStatus("idle");
            }
        }, 40);
    };

    
    const handleStopChat = () => {
        if (typingIntervalRef.current) {
            clearInterval(typingIntervalRef.current); 
            typingIntervalRef.current = null;
        }
        setMessages((prev) => {
            const lastMsg = prev[prev.length - 1];
            if (lastMsg && lastMsg.isTyping) {
                const newMsgs = [...prev];
                newMsgs[newMsgs.length - 1] = { role: "assistant", text: displayedText };
                return newMsgs;
            }
            return prev;
        });

        setDisplayedText("");
        setBotStatus("idle"); 
    };


    const handleSendMessage = (text, attachedFiles = []) => {
        if (!text.trim() && attachedFiles.length === 0) return;
        setIsRecording(false);
        setIsTranscribing(false);
        const userMsg = {
            role: "user",
            text: text,
            files: attachedFiles
        };

        setMessages((prev) => [...prev, userMsg]);
        setBotStatus("reviewing");

        setTimeout(() => {
            setBotStatus("replying");
            const botFullReply = "I have received your message and analyzed the details. How else can I assist you today?";

            setMessages((prev) => [...prev, { role: "assistant", text: "", isTyping: true }]);

            startTyping(botFullReply);
        }, 2000);
    };

    return (
        <div className="relative flex flex-col w-full h-full bg-white overflow-x-hidden sm:px-4 px-1">
            <AuthOverlay
                isOpen={showOverlay}
                onClose={() => setShowOverlay(false)}
            />

            {/* 1. TOP FIXED SECTION: Bot Icon aur Heading (No Scroll) */}
            <div className={`flex-none flex flex-col items-center transition-all duration-500 bg-white z-10 ${messages.length === 0 ? "justify-center flex-1 pt-4 pb-2" : "py-5 "
                }`}>
                <div className="max-w-5xl mx-auto w-full flex flex-col items-center">
                    {/* Bot Icon */}
                    <div className={`${messages.length === 0 ? "2xl:h-60 2xl:w-60 h-40 w-40 mb-6 rounded-[260px] bg-blue-500/10" : "h-35 w-35 mb-2 rounded-[260px] bg-blue-500/10"
                        } transition-all duration-500 flex justify-center items-center`}>
                        {botStatus === "replying" ? (
                            <video src={Botvideo} autoPlay loop muted className="h-full w-full object-contain rounded-full" />
                        ) : (
                            <img
                                src={isRecording ? ListeningAvatar : botStatus === "reviewing" ? Reviewbot : Chatbotlogo}
                                alt="Status"
                                className="h-full w-full object-contain rounded-full"
                            />
                        )}
                    </div>
                    <div className="mt-4 h-6 flex items-center justify-center">
                        {isRecording && (
                            <p className="text-black font-semibold animate-pulse text-base">Listening....</p>
                        )}

                        {isTranscribing && !isRecording && (
                            <p className="text-black font-semibold text-base">Transcribing....</p>
                        )}

                        {botStatus === "reviewing" && (
                            <p className="text-black font-semibold text-base">Reviewing your input...</p>
                        )}
                    </div>

                    {/* Heading & Input (only in start screen ) */}
                    {messages.length === 0 && (
                        <div className="w-full flex flex-col items-center  py-3 2xl:py-10 px-4">
                            <h1 className="text-xl lg:text-[28px] font-medium text-primarytext mb-6.5 2xl:mb-9.5 text-center animate-left-to-right">
                                What health concern would you like to discuss?
                            </h1>
                            <div className="w-full max-w-5xl">
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
                    )}
                </div>
            </div>

            {/* 2. MIDDLE SCROLLABLE SECTION: Only scroll*/}
            {messages.length > 0 && (
                <div className="flex-1 overflow-y-auto custom-scrollbar px-4 bg-white">
                    <div className="max-w-5xl mx-auto w-full space-y-6 py-8">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                <div className={`
                                    max-w-[85%] sm:max-w-[70%] px-5 py-3 rounded-2xl text-base  leading-relaxed
                                    wrap-break-word whitespace-pre-wrap 
                                    ${msg.role === "user" ? "bg-primary text-white rounded-tr-none" : "bg-white text-primarytext border border-bordercolor rounded-tl-none"}
                                `}>
                                    {/* File Previews logic */}
                                    {msg.files && msg.files.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {msg.files.map((f, i) => (
                                                <div key={i} className="rounded-xl overflow-hidden border border-white/20">
                                                    {f.preview ? <img src={f.preview} alt="upload" className="h-28 w-28 object-cover" /> :
                                                        <div className="h-20 w-28 flex items-center justify-center bg-gray-100 text-[10px] font-bold p-2 uppercase">{f.file.name.split('.').pop()} File</div>}
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
            )}

            {/* 3. BOTTOM FIXED INPUT: only in chat starts*/}
            {messages.length > 0 && (
                <div className="flex-none bg-white ">
                    <div className="max-w-5xl mx-auto">
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
            )}
        </div>
    );
};

export default NewChat;