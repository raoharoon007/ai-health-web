import { useState, useEffect, useRef } from "react";
import { useLocation, useParams, useOutletContext } from "react-router-dom";
import api from "../api/axiosInstance";

import ChatStatus from "../components/Conversationchat/ChatStatus";
import MessageList from "../components/Conversationchat/MessageList";
import ChatFooter from "../components/Conversationchat/ChatFooter";

const ChatConversation = () => {
    const { chatId } = useParams();
    const { chats, setChats } = useOutletContext();
    const [apiError, setApiError] = useState("");
    const { state } = useLocation();

    const [isRecording, setIsRecording] = useState(false);
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [botStatus, setBotStatus] = useState(state?.aiResponse ? "reviewing" : "idle");
    const [displayedText, setDisplayedText] = useState("");

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const LIMIT = 20;

    const typingIntervalRef = useRef(null);
    const audioRef = useRef(null);
    const hasHandledInitial = useRef(false);
    const isStoppedRef = useRef(false);
    const activeTextRef = useRef("");
    const activeChatIdRef = useRef(chatId);

    const currentChat = chats.find(c => String(c.id) === String(chatId));
    const currentMessages = currentChat ? currentChat.messages : [];

    const getSafeString = (val) => {
        if (val === null || val === undefined) return "";
        if (typeof val === 'string') return val;
        if (typeof val === 'object') {
            if (val.response) return getSafeString(val.response);
            if (val.content) return getSafeString(val.content);
            return "";
        }
        return String(val);
    };

    const getSmartResponse = (data) => {
        if (!data) return "";
        if (data["llm response"]) return getSafeString(data["llm response"]);

        const pres = data.prescription || data;
        if (pres.response) return getSafeString(pres.response);

        if (pres.medicine) {
            const med = getSafeString(pres.medicine);
            if (med) {
                let parts = [med];
                if (pres.precautions && Array.isArray(pres.precautions)) {
                    parts.push("\nPrecautions: " + pres.precautions.join(", "));
                }
                if (pres.consult_doctor) {
                    parts.push("\n" + getSafeString(pres.consult_doctor));
                }
                return parts.join("\n");
            }
        }
        if (pres.consult_doctor) return getSafeString(pres.consult_doctor);
        return "I cannot provide a specific diagnosis. Please consult a doctor.";
    };

    useEffect(() => {
        activeChatIdRef.current = chatId;

        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
        if (typingIntervalRef.current) {
            clearInterval(typingIntervalRef.current);
            typingIntervalRef.current = null;
        }

        if (!state?.aiResponse) {
            setBotStatus("idle");
        }
        setIsRecording(false);
        setIsTranscribing(false);
        setDisplayedText("");
        setApiError("");
        isStoppedRef.current = false;

        setPage(1);
        setHasMore(true);
        setIsFetchingMore(false);

        fetchChatHistory(1);

        return () => {
            if (audioRef.current) audioRef.current.pause();
            if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
        };
    }, [chatId]);

    const fetchChatHistory = async (pageNum = 1) => {
        if (state?.aiResponse) return;
        if (state?.triggerBot === false && hasHandledInitial.current) return;
        if (!chatId || chatId === "new" || chatId.length < 15) return;

        const currentRequestId = chatId;
        if (pageNum > 1) setIsFetchingMore(true);

        try {
            const response = await api.post(`/chat/get-chat-by-conversation_id/${chatId}?page=${pageNum}&limit=${LIMIT}`);

            if (activeChatIdRef.current !== currentRequestId) return;
            const fetchedData = response.data.data || response.data || [];

            if (!Array.isArray(fetchedData) || fetchedData.length === 0) {
                setHasMore(false);
                setIsFetchingMore(false);
                return;
            }

            if (fetchedData.length < LIMIT) {
                setHasMore(false);
            }

            setPage(pageNum);

            const newMessages = fetchedData.reverse().map(msg => {
                const isUser = msg.chat_by_user === true;
                const rawText = isUser ? msg.content : getSmartResponse(msg);
                const messageText = getSafeString(rawText);

                const mappedFiles = [];
                if (msg.uri && typeof msg.uri === 'string' && msg.uri.length > 10) {
                    mappedFiles.push({
                        preview: msg.uri,
                        file: { type: 'image/jpeg' }
                    });
                }

                return {
                    role: isUser ? "user" : "assistant",
                    text: messageText,
                    files: mappedFiles,
                    id: msg._id,
                    isTyping: false
                };
            });

            setChats(prev => {
                const existingChat = prev.find(c => String(c.id) === String(chatId));
                if (existingChat && pageNum > 1) {
                    const allDuplicates = newMessages.every(newMsg =>
                        existingChat.messages.some(existing => existing.id === newMsg.id)
                    );
                    if (allDuplicates) {
                        setHasMore(false);
                        return prev;
                    }
                }

                if (existingChat) {
                    const combinedMessages = pageNum === 1
                        ? newMessages
                        : [...newMessages, ...existingChat.messages];

                    const uniqueMessages = Array.from(new Map(combinedMessages.map(m => [m.id, m])).values());

                    return prev.map(c =>
                        String(c.id) === String(chatId)
                            ? { ...c, messages: uniqueMessages }
                            : c
                    );
                } else {
                    return [...prev, { id: chatId, title: "Conversation", messages: newMessages }];
                }
            });

        } catch (error) {
            console.error("History fetch failed:", error);
            setHasMore(false);
        } finally {
            setIsFetchingMore(false);
        }
    };

    useEffect(() => {
        if (state?.aiResponse && chatId && !hasHandledInitial.current) {
            const existingChat = chats.find(c => String(c.id) === String(chatId));
            if (existingChat) {
                hasHandledInitial.current = true;
                if (activeChatIdRef.current !== chatId) return;

                setChats(prev => prev.map(chat =>
                    String(chat.id) === String(chatId)
                        ? { ...chat, messages: [...chat.messages, { role: "assistant", text: "", isTyping: true }] }
                        : chat
                ));
                playAndSync(state.aiResponse);
            }
        }
    }, [chatId, state, chats]);
    const handleStopChat = () => {
        isStoppedRef.current = true;
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
        if (botStatus === "replying" || botStatus === "reviewing") completeTyping(activeTextRef.current);
        setBotStatus("idle");
    };

    const playAndSync = async (text) => {
        const currentRequestId = chatId;
        const safeText = getSafeString(text);

        try {
            isStoppedRef.current = false;
            activeTextRef.current = safeText;
            setBotStatus("reviewing");
            setDisplayedText("");

            const response = await api.post("/chat/chat-tts", { text: safeText }, { responseType: 'blob' });

            if (activeChatIdRef.current !== currentRequestId || isStoppedRef.current) return;

            const audioUrl = URL.createObjectURL(response.data);
            if (audioRef.current) audioRef.current.pause();

            const audio = new Audio(audioUrl);
            audioRef.current = audio;

            audio.oncanplaythrough = () => {
                if (activeChatIdRef.current !== currentRequestId || isStoppedRef.current) return;
                audio.play().catch(e => console.error("Autoplay blocked:", e));
            };

            audio.onplay = () => {
                if (activeChatIdRef.current !== currentRequestId) { audio.pause(); return; }
                if (isStoppedRef.current) { audio.pause(); setBotStatus("idle"); return; }
                setBotStatus("replying");
                startTyping(safeText);
            };

            audio.onended = () => {
                if (activeChatIdRef.current !== currentRequestId || isStoppedRef.current) return;
                setBotStatus("idle");
            };
            audio.onerror = () => {
                if (activeChatIdRef.current !== currentRequestId || isStoppedRef.current) return;
                startTyping(safeText);
                setBotStatus("idle");
            };
        } catch (error) {
            console.error("TTS Error:", error);
            if (activeChatIdRef.current === currentRequestId && !isStoppedRef.current) {
                startTyping(safeText);
                setBotStatus("idle");
            }
        }
    };

    const startTyping = (fullText) => {
        let index = 0;
        setDisplayedText("");
        if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);

        typingIntervalRef.current = setInterval(() => {
            if (isStoppedRef.current) {
                clearInterval(typingIntervalRef.current);
                return;
            }
            if (index < fullText.length) {
                setDisplayedText((prev) => prev + fullText.charAt(index));
                index++;
            } else {
                completeTyping(fullText);
            }
        }, 25);
    };

    const completeTyping = (fullText) => {
        if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
        setChats(prev => prev.map(chat =>
            String(chat.id) === String(chatId)
                ? { ...chat, messages: chat.messages.map((m, idx) => (idx === chat.messages.length - 1 && m.isTyping) ? { role: "assistant", text: fullText, isTyping: false } : m) }
                : chat
        ));
        setDisplayedText("");
    };

    const handleSendMessage = async (text, attachedFiles = []) => {
        const currentRequestId = chatId;
        if (!text.trim() && attachedFiles.length === 0) return;

        setIsRecording(false);
        setIsTranscribing(false);
        isStoppedRef.current = false;
        setApiError("");
        if (audioRef.current) audioRef.current.pause();

        const userMsg = { role: "user", text, files: attachedFiles };
        const botPlaceholder = { role: "assistant", text: "", isTyping: true };

        setBotStatus("reviewing");

        setChats(prev => {
            const existing = prev.find(c => String(c.id) === String(chatId));
            if (existing) {
                const updatedChat = {
                    ...existing,
                    messages: [...existing.messages, userMsg, botPlaceholder]
                };
                const otherChats = prev.filter(c => String(c.id) !== String(chatId));
                return [updatedChat, ...otherChats];
            }
            return prev;
        });

        try {
            let imageUrl = null;
            if (attachedFiles.length > 0) {
                const uploadFormData = new FormData();
                uploadFormData.append("file", attachedFiles[0].file);
                const uploadResponse = await api.post("/chat/upload-medical-image", uploadFormData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                imageUrl = uploadResponse.data.url;
            }

            if (isStoppedRef.current) { setBotStatus("idle"); return; }
            if (activeChatIdRef.current !== currentRequestId) return;

            const payload = { conversation_id: chatId, content: text };
            if (imageUrl) payload.image_uri = imageUrl;

            const response = await api.post("/chat/existing-chat", payload);

            if (activeChatIdRef.current !== currentRequestId) return;
            if (isStoppedRef.current) { setBotStatus("idle"); return; }

            const aiReply = getSmartResponse(response.data);
            playAndSync(aiReply);

        } catch (error) {
            console.error("Error:", error);
            if (activeChatIdRef.current === currentRequestId) {
                setApiError("Failed to get response.");
                setBotStatus("idle");
                setChats(prev => prev.map(chat => String(chat.id) === String(chatId) ? { ...chat, messages: chat.messages.slice(0, -1) } : chat));
            }
        }
    };

    return (
        <div key={chatId} className="relative flex flex-col w-full h-full bg-white overflow-hidden sm:px-4 px-2">

            <ChatStatus
                isRecording={isRecording}
                isTranscribing={isTranscribing}
                botStatus={botStatus}
            />

            <MessageList
                messages={currentMessages}
                displayedText={displayedText}
                loadMore={() => fetchChatHistory(page + 1)}
                hasMore={hasMore}
                loading={isFetchingMore}
            />

            <ChatFooter
                onRecordingChange={setIsRecording}
                onTranscribingStatus={setIsTranscribing}
                onSend={handleSendMessage}
                onStop={handleStopChat}
                botStatus={botStatus}
                isTranscribing={isTranscribing}
                apiError={apiError}
            />
        </div>
    );
};

export default ChatConversation;