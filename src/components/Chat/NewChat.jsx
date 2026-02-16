import { useState, useEffect, useRef } from "react";
import Chatbotlogo from '../../assets/images/Chatbot.webp';
import ListeningAvatar from '../../assets/images/ListeningAvatar.webp';
import Reviewbot from '../../assets/images/Reviewbot.webp';
import Botvideo from '../../assets/videos/Botvideo.mp4';
import ChatInput from "../Chat/ChatInput";
import AuthOverlay from "../Authoverlay/AuthOverlay";
import MessageList from "../Conversationchat/MessageList";
import ChatStatus from "../Conversationchat/ChatStatus";
import { useOutletContext, useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";

const NewChat = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [botStatus, setBotStatus] = useState("idle");
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);
    const { setChats } = useOutletContext();
    const navigate = useNavigate();
    const [apiError, setApiError] = useState("");
    const isRequestCancelled = useRef(false);

    const [localMessages, setLocalMessages] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            const timer = setTimeout(() => setShowOverlay(true), 500);
            return () => clearTimeout(timer);
        } else {
            setShowOverlay(false);
        }
    }, []);

    const handleRecordingChange = (recordingState) => {
        setIsRecording(recordingState);
    };

    const handleTranscribingStatus = (status) => {
        setIsTranscribing(status);
    };

    const handleStopChat = () => {
        setBotStatus("idle");
        setIsRecording(false);
        setIsTranscribing(false);
        setLocalMessages([]);
        isRequestCancelled.current = true;
    };

    const handleSendMessage = async (text, attachedFiles = []) => {
        if (!text?.trim() && attachedFiles.length === 0) return;

        setIsRecording(false);
        setIsTranscribing(false);
        setApiError("");

        isRequestCancelled.current = false;
        setBotStatus("reviewing");

        const userMsg = { role: "user", text, files: attachedFiles };
        const botPlaceholder = { role: "assistant", text: "", isTyping: true };
        setLocalMessages([userMsg, botPlaceholder]);

        try {
            let titleText = "";
            let contentToSend = "";

            if (text && text.trim().length > 0) {
                titleText = text.trim();
                contentToSend = text.trim();
            }
            else if (attachedFiles.length > 0) {
                const fileName = attachedFiles[0].file.name;
                titleText = fileName.replace(/\.[^/.]+$/, "");
                contentToSend = titleText;
            }
            else {
                titleText = "New Conversation";
                contentToSend = "New Conversation";
            }
            const correctTitle = titleText.length > 30 ? titleText.substring(0, 30) + "..." : titleText;
            let imageUrl = null;
            if (attachedFiles.length > 0) {
                const uploadFormData = new FormData();
                uploadFormData.append("file", attachedFiles[0].file);

                const uploadResponse = await api.post("/chat/upload-medical-image", uploadFormData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });

                imageUrl = uploadResponse.data.url;
            }

            if (isRequestCancelled.current) { setBotStatus("idle"); return; }
            const payload = {
                content: contentToSend,
                title: correctTitle
            };

            if (imageUrl) payload.image_uri = imageUrl;

            const response = await api.post("/chat/create-new-chat", payload);

            if (isRequestCancelled.current) { setBotStatus("idle"); return; }

            const newConversationId = response.data.conversation_id || response.data.id || response.data._id;

            const getSafeString = (val) => {
                if (!val) return "";
                if (typeof val === 'string') return val;
                if (typeof val === 'object') return getSafeString(val.response || val.content);
                return String(val);
            };

            const rawResponse = response.data["llm response"] || response.data.response;
            const aiReplyText = getSafeString(rawResponse) || "I can help you with that.";

            if (!newConversationId) {
                setApiError("Error: Server did not return a valid Chat ID.");
                setBotStatus("idle");
                return;
            }

            setChats((prev) => {
                const exists = prev.find(c => String(c.id) === String(newConversationId));
                if (exists) return prev;

                return [
                    {
                        id: newConversationId,
                        title: correctTitle,
                        messages: [userMsg]
                    },
                    ...prev
                ];
            });

            navigate(`/chat/${newConversationId}`, {
                state: {
                    triggerBot: false,
                    firstMessage: text,
                    aiResponse: aiReplyText
                },
                replace: true
            });

        } catch (error) {
            console.error("New chat error:", error);
            setApiError("Failed to start conversation.");
            setBotStatus("idle");
        }
    };

    const isChatActive = localMessages.length > 0;

    return (
        <div className={`relative flex flex-col w-full h-full bg-white sm:px-4 px-2 ${isChatActive
                ? "overflow-hidden"
                : "justify-start pt-5 items-center overflow-x-hidden"
            }`}>
            <AuthOverlay isOpen={showOverlay} onClose={() => setShowOverlay(false)} />

            {isChatActive ? (
                <>
                    <ChatStatus isRecording={isRecording} isTranscribing={isTranscribing} botStatus={botStatus} />
                    <MessageList messages={localMessages} displayedText="" />
                    <div className="shrink-0 pb-4 w-full max-w-5xl mx-auto">
                        <div className="w-full">
                            <ChatInput
                                onRecordingChange={handleRecordingChange}
                                onTranscribingStatus={handleTranscribingStatus}
                                onSend={handleSendMessage}
                                onStop={handleStopChat}
                                disabled={botStatus !== "idle"}
                                isTranscribing={isTranscribing}
                            />
                            {apiError && <div className="mt-2 text-warning text-xs text-center italic font-medium">{apiError}</div>}
                            <div className="flex justify-center py-2">
                                <span className="text-center text-mutedtext font-light text-[11px] sm:text-sm px-4">
                                    AI can make mistakes. Consider checking important information.
                                </span>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div className="w-full max-w-5xl flex flex-col items-center z-10">
                    <div className="2xl:h-60 2xl:w-60 lg:h-48 lg:w-48 h-32 w-32 mb-4 sm:mb-6 rounded-full bg-blue-500/10 flex justify-center items-center shrink-0">
                        {botStatus === "replying" ? (
                            <video src={Botvideo} autoPlay loop muted className="h-full w-full object-contain rounded-full" />
                        ) : (
                            <img
                                src={isRecording ? ListeningAvatar : (isTranscribing || botStatus === "reviewing") ? Reviewbot : Chatbotlogo}
                                alt="Status"
                                className="h-full w-full object-contain rounded-full"
                            />
                        )}
                    </div>
                    <div className="h-6 flex items-center justify-center mt-2 shrink-0">
                        <p className="text-black font-semibold text-sm sm:text-base">
                            {isRecording && <span className="animate-pulse">Listening....</span>}
                            {isTranscribing && !isRecording && "Transcribing...."}
                            {botStatus === "reviewing" && "Reviewing your input..."}
                        </p>
                    </div>
                    <h1 className="text-lg sm:text-xl lg:text-[28px] font-medium text-primarytext mt-6 mb-4 sm:mb-6 text-center animate-left-to-right px-2 shrink-0">
                        What health concern would you like to discuss?
                    </h1>
                    <div className="w-full">
                        <ChatInput
                            onRecordingChange={handleRecordingChange}
                            onTranscribingStatus={handleTranscribingStatus}
                            onSend={handleSendMessage}
                            onStop={handleStopChat}
                            disabled={botStatus !== "idle"}
                            isTranscribing={isTranscribing}
                        />
                        {apiError && <div className="mt-2 text-warning text-xs text-center italic font-medium">{apiError}</div>}
                        <div className="flex justify-center py-2">
                            <span className="text-center text-mutedtext font-light text-[11px] sm:text-sm px-4">
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