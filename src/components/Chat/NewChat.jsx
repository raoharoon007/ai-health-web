import { useState, useEffect } from "react";
import Chatbotlogo from '../../assets/images/Chatbot.webp';
import ListeningAvatar from '../../assets/images/ListeningAvatar.webp';
import Reviewbot from '../../assets/images/Reviewbot.webp';
import Botvideo from '../../assets/videos/Botvideo.mp4';
import ChatInput from "./ChatInput";
import AuthOverlay from "../Authoverlay/AuthOverlay";
import { useOutletContext, useNavigate } from "react-router-dom";

const NewChat = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [botStatus, setBotStatus] = useState("idle");
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);
    const { setChats } = useOutletContext();
    const navigate = useNavigate();

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
    
    const handleStopChat = () => {
        setBotStatus("idle");
        setIsRecording(false);
        setIsTranscribing(false);
    };

    const handleSendMessage = (text, attachedFiles = []) => {
        if (!text.trim() && attachedFiles.length === 0) return;

        setIsRecording(false);
        setIsTranscribing(false);
        setBotStatus("idle");

        const newId = Date.now().toString();
        const userMsg = { role: "user", text, files: attachedFiles };

        setChats((prev) => [
            {
                id: newId,
                title: text.substring(0, 25) + (text.length > 25 ? "..." : ""),
                messages: [userMsg]
            },
            ...prev
        ]);

        navigate(`/chat/${newId}`, { state: { triggerBot: true }, replace: true });
    };

    return (
        <div className="relative flex flex-col w-full h-full bg-white overflow-x-hidden sm:px-4 px-1">
            <AuthOverlay
                isOpen={showOverlay}
                onClose={() => setShowOverlay(false)}
            />

            {/* TOP SECTION: Always centered because NewChat is only for starting */}
            <div className="flex-none flex flex-col items-center justify-center pt-4 pb-2 bg-white z-10">
                <div className="max-w-5xl mx-auto w-full flex flex-col items-center">
                    
                    {/* Bot Icon */}
                    <div className="2xl:h-60 2xl:w-60 h-40 w-40 mb-6 rounded-[260px] bg-blue-500/10 transition-all duration-500 flex justify-center items-center">
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

                    {/* Heading & Input */}
                    <div className="w-full flex flex-col items-center py-3 2xl:py-10 px-4">
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
                </div>
            </div>
        </div>
    );
};

export default NewChat;