import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Chatbotlogo from '../assets/images/Chatbot.webp';
import ListeningAvatar from '../assets/images/ListeningAvatar.webp';
import Reviewbot from '../assets/images/Reviewbot.webp';
import Botvideo from '../assets/videos/Botvideo.mp4';
import ChatInput from "../components/Chat/ChatInput";


const initialConversations = {
    "1": [
        { role: "user", text: "I am feeling constant body pain." },
        { role: "assistant", text: "Can you tell me where exactly the pain is?" },
        { role: "user", text: "Mostly in my lower back and legs." },
        { role: "assistant", text: "This could be muscle fatigue or posture related." }
    ],
    "2": [
        { role: "user", text: "How can I manage stress daily?" },
        { role: "assistant", text: "Start with small breathing exercises." },
        { role: "user", text: "Does meditation really help?" },
        { role: "assistant", text: "Yes, even 5 minutes daily can help." }
    ],
    "3": [
        { role: "user", text: "I have frequent headaches." },
        { role: "assistant", text: "Do they happen at a specific time?" },
        { role: "user", text: "Mostly in the evening." },
        { role: "assistant", text: "That may be screen fatigue." }
    ],
    "4": [
        { role: "user", text: "How to improve sleep quality?" },
        { role: "assistant", text: "Avoid screens before bedtime." },
        { role: "user", text: "Any natural remedy?" },
        { role: "assistant", text: "Chamomile tea can help." }
    ],
    "5": [
        { role: "user", text: "My knee hurts while walking." },
        { role: "assistant", text: "Is there swelling present?" },
        { role: "user", text: "Yes, slightly." },
        { role: "assistant", text: "You should rest and apply ice." }
    ],
    "6": [
        { role: "user", text: "Seasonal allergies are bothering me." },
        { role: "assistant", text: "Do you experience sneezing or itching?" },
        { role: "user", text: "Yes, both." },
        { role: "assistant", text: "Antihistamines can help." }
    ],
    "7": [
        { role: "user", text: "Where can I find mental health resources?" },
        { role: "assistant", text: "Online therapy platforms are useful." },
        { role: "user", text: "Are they affordable?" },
        { role: "assistant", text: "Many offer free initial sessions." }
    ],
    "8": [
        { role: "user", text: "What are treatment options for anxiety?" },
        { role: "assistant", text: "Therapy and lifestyle changes work well." },
        { role: "user", text: "Is medication required?" },
        { role: "assistant", text: "Only in moderate to severe cases." }
    ],
    "9": [
        { role: "user", text: "I want to understand my diagnosis." },
        { role: "assistant", text: "What symptoms are you experiencing?" },
        { role: "user", text: "Fatigue and weakness." },
        { role: "assistant", text: "Blood tests may be required." }
    ],
    "10": [
        { role: "user", text: "How can I control IBS symptoms?" },
        { role: "assistant", text: "Diet plays a major role." },
        { role: "user", text: "Any food to avoid?" },
        { role: "assistant", text: "Avoid spicy and processed foods." }
    ],
    "11": [
        { role: "user", text: "IBS is affecting my routine." },
        { role: "assistant", text: "Have you tried a low FODMAP diet?" },
        { role: "user", text: "No, what is that?" },
        { role: "assistant", text: "It reduces digestive stress." }
    ],
    "12": [
        { role: "user", text: "How to manage chronic pain?" },
        { role: "assistant", text: "Physical therapy helps a lot." },
        { role: "user", text: "Any home exercises?" },
        { role: "assistant", text: "Stretching daily is effective." }
    ],
    "13": [
        { role: "user", text: "How to cope with anxiety?" },
        { role: "assistant", text: "Grounding techniques are useful." },
        { role: "user", text: "Can you suggest one?" },
        { role: "assistant", text: "Try the 5-4-3-2-1 method." }
    ],
    "14": [
        { role: "user", text: "How is arthritis treated?" },
        { role: "assistant", text: "Pain management is key." },
        { role: "user", text: "Is exercise safe?" },
        { role: "assistant", text: "Yes, low-impact exercise helps." }
    ],
    "15": [
        { role: "user", text: "I need emotional support." },
        { role: "assistant", text: "I am here to listen." },
        { role: "user", text: "I feel overwhelmed." },
        { role: "assistant", text: "You're not alone in this." }
    ],
    "16": [
        { role: "user", text: "Let's talk about health habits." },
        { role: "assistant", text: "Sure, where do you want to start?" },
        { role: "user", text: "Daily routine." },
        { role: "assistant", text: "Consistency is the key." }
    ]
};

const ChatConversation = () => {
    const { chatId } = useParams();
    const [isRecording, setIsRecording] = useState(false);
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [allConversations, setAllConversations] = useState(initialConversations);
    const [botStatus, setBotStatus] = useState("idle");
    const [displayedText, setDisplayedText] = useState(""); // For Typewriter effect 
    const messagesEndRef = useRef(null);
    const typingIntervalRef = useRef(null);

    const currentMessages = allConversations[chatId] || [];
    const handleRecordingChange = (state) => {
        setIsRecording(state);
        if (state === false) {
            setIsTranscribing(true);
            setTimeout(() => {
                setIsTranscribing(false);
            }, 1500);
        } else {
            setIsTranscribing(false);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatId, allConversations, displayedText]);

    // Typewriter Effect Logic
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

                setAllConversations((prev) => {
                    const currentChat = [...(prev[chatId] || [])];
                    const lastMsgIndex = currentChat.length - 1;

                    if (lastMsgIndex >= 0 && currentChat[lastMsgIndex].isTyping) {
                        currentChat[lastMsgIndex] = { role: "assistant", text: fullText };
                    }
                    return { ...prev, [chatId]: currentChat };
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

        setAllConversations((prev) => {
            const currentChat = [...(prev[chatId] || [])];
            const lastMsgIndex = currentChat.length - 1;

            if (lastMsgIndex >= 0 && currentChat[lastMsgIndex].isTyping) {
                currentChat[lastMsgIndex] = { role: "assistant", text: displayedText };
            }
            return { ...prev, [chatId]: currentChat };
        });

        setDisplayedText("");
        setBotStatus("idle");
    };

    const handleSendMessage = (text, attachedFiles = []) => {
        if (!text.trim() && attachedFiles.length === 0) return;
        setIsRecording(false);
        setIsTranscribing(false);

        const newMessage = {
            role: "user",
            text: text,
            files: attachedFiles
        };

        setAllConversations(prev => ({
            ...prev,
            [chatId]: [...(prev[chatId] || []), newMessage]
        }));

        setBotStatus("reviewing");

        setTimeout(() => {
            setBotStatus("replying");
            const botFullReply = "I have received your message and analyzed the details. How else can I assist you today?";

            setAllConversations(prev => ({
                ...prev,
                [chatId]: [...(prev[chatId] || []), { role: "assistant", text: "", isTyping: true }]
            }));

            startTyping(botFullReply);
        }, 2000);
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