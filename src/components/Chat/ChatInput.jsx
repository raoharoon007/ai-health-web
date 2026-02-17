import { useState, useEffect, useRef } from "react";
import FileAttachIcon from '../../assets/icons/File-attachment.svg?react';
import MicIcon from '../../assets/icons/Mic-icon.svg?react';
import SendIcon from '../../assets/icons/Send-icon.svg?react';
import RecordingIcon from '../../assets/icons/Recording-icon.svg?react';
import CrossFileIcon from '../../assets/icons/Cross-file.svg?react';
import Linespinner from '../../assets/icons/Line-Spinner.svg?react';
import VoiceWave from "./VoiceWave";
import api from "../../api/axiosInstance";


const ChatInput = ({ 
    onRecordingChange = () => { }, 
    onSend = () => { }, 
    onStop = () => { }, 
    onTranscribingStatus = () => { }, 
    disabled = false, 
    isTranscribing = false 
}) => {

    const [message, setMessage] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [files, setFiles] = useState([]);
    const [fileLimitError, setFileLimitError] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false); 
    const [audioStream, setAudioStream] = useState(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const fileInputRef = useRef(null);
    const textareaRef = useRef(null);
    const [isMultiline, setIsMultiline] = useState(false);
    const MAX_FILES = 3;

    const isFileDisabled = isRecording;

    const startRecording = async () => {
        if (disabled) return;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setAudioStream(stream);

            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };
            
            mediaRecorder.onstop = async () => {
                setIsProcessing(true);
                onTranscribingStatus(true); 
                
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                const audioFile = new File([audioBlob], "voice_message.wav", { type: "audio/wav" });
                
                await handleTranscribe(audioFile);
                
                stream.getTracks().forEach(track => track.stop());
                setAudioStream(null);
            };

            mediaRecorder.start();
            setIsRecording(true);
            onRecordingChange(true);

        } catch (error) {
            console.error("Microphone access denied:", error);
            alert("Could not access microphone. Please allow permissions.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop(); 
            setIsRecording(false);
            onRecordingChange(false);
        }
    };

    const handleTranscribe = async (audioFile) => {
        const formData = new FormData();
        formData.append("audio", audioFile);

        try {
            const response = await api.post("/chat/speech-to-text", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            let transcribedText = "";

            if (response.data.response) {
                const rawResponse = response.data.response;
                if (typeof rawResponse === 'string' && rawResponse.includes("transcribedText:")) {
                    const match = rawResponse.match(/transcribedText:\s*(.*?)(?:,\s*Language|$)/);
                    if (match && match[1]) {
                        transcribedText = match[1];
                    } else {
                        transcribedText = rawResponse;
                    }
                } else {
                    transcribedText = rawResponse;
                }
            } else {
                transcribedText = response.data.text || response.data.transcript || "";
            }

            if (transcribedText) {
                setMessage((prev) => (prev ? prev + " " + transcribedText : transcribedText));
                setTimeout(() => adjustHeight(), 100);
            }

        } catch (error) {
            console.error("Transcription failed:", error);
        } finally {
            setIsProcessing(false);
            onTranscribingStatus(false); 
        }
    };

    const adjustHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            const newHeight = Math.min(textarea.scrollHeight, 200);
            textarea.style.height = `${newHeight}px`;
            setIsMultiline(newHeight > 60);
        }
    };

    const handleFileChange = (e) => {
        if (isFileDisabled) return;
        const selectedFiles = Array.from(e.target.files);
        if (files.length + selectedFiles.length > MAX_FILES) {
            setFileLimitError(true);
            setTimeout(() => setFileLimitError(false), 2500);
            return;
        }
        const mappedFiles = selectedFiles.map(file => ({
            file,
            preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : null
        }));
        setFiles(prev => [...prev, ...mappedFiles]);
        e.target.value = "";
    };

    const handleAction = () => {
        if (disabled) return;

        if (isRecording) {
            stopRecording();
        } else {
            if (message.trim().length > 0 || files.length > 0) {
                onSend(message, files);
                setMessage("");
                setFiles([]);
                if (textareaRef.current) textareaRef.current.style.height = "auto";
            }
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleAction();
        }
    };

    const showSpinner = isTranscribing || isProcessing;

    return (
        <div className={`relative w-full max-w-5xl flex justify-center mx-auto py-2 sm:py-4 gap-1.5 sm:gap-4 items-end bg-transparent transition-opacity ${disabled ? "opacity-70" : "opacity-100"}`}>

            <FileAttachIcon
                className={`transition-all w-8 h-8 sm:w-14 sm:h-14 ${isFileDisabled ? "cursor-not-allowed grayscale opacity-50" : "cursor-pointer"}`}
                onClick={() => !isFileDisabled && fileInputRef.current?.click()}
            />
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                multiple
                disabled={isFileDisabled}
                accept="image/*,video/*,.pdf,.doc,.docx"
            />

            {fileLimitError && (
                <div className="absolute -top-12 left-0 bg-warning text-white text-[10px] sm:text-xs px-3 py-2 rounded-lg shadow-lg z-50">
                    You can upload up to 3 files only
                </div>
            )}

            <div className={`relative flex flex-col flex-1 bg-white border-2 overflow-hidden transition-all duration-300 
                 ${disabled ? "bg-gray-50 border-gray-200" : "border-bordercolor focus-within:border-primary"}
                   ${(isMultiline || files.length > 0) ? "rounded-2xl" : "rounded-full"} 
                  `}>

                {files.length > 0 && !isRecording && (
                    <div className="flex flex-wrap gap-2 p-2 sm:p-3 pb-0">
                        {files.map((f, i) => {
                            const fileType = f.file.type;
                            const extension = f.file.name.split('.').pop().toUpperCase();

                            return (
                                <div key={i} className="relative group">
                                    {fileType.startsWith("image/") ? (
                                        <img src={f.preview} alt="preview" className="h-14 w-14 sm:h-20 sm:w-20 object-cover rounded-lg sm:rounded-xl border border-bordercolor" />
                                    ) : (
                                        <div className="h-14 w-14 sm:h-20 sm:w-20 flex flex-col items-center justify-center bg-gray-50 rounded-lg sm:rounded-xl border border-dashed border-gray-300">
                                            <span className={`text-[8px] sm:text-[10px] font-bold px-1 sm:px-2 py-0.5 rounded ${extension === 'PDF' ? 'bg-red-100 text-warning' : 'bg-blue-100 text-primary'}`}>
                                                {extension}
                                            </span>
                                        </div>
                                    )}

                                    {!disabled && (
                                        <button
                                            onClick={() => setFiles(prev => prev.filter((_, idx) => idx !== i))}
                                            className="absolute -top-1 -right-1 bg-warning text-white rounded-full w-4 h-4 sm:w-5 sm:h-5 cursor-pointer flex items-center justify-center shadow-sm"
                                        >
                                            <CrossFileIcon style={{ width: '8px' }} />
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                <div className="relative flex items-center w-full min-h-10 sm:min-h-14 px-3 sm:px-5">
                    <div className="w-full" style={{ display: isRecording ? 'block' : 'none' }}>
                        <VoiceWave active={isRecording} audioStream={audioStream} color="#1D1D1B" />
                    </div>

                    {!isRecording && (
                        <div className="relative w-full flex items-center">
                            {showSpinner && (
                                <div className="absolute inset-0 flex items-center gap-2 bg-white z-10">
                                    <Linespinner className="animate-spin w-4 h-4" />
                                    <span className="text-secondarytext text-sm sm:text-base font-light italic">
                                        Transcribing....
                                    </span>
                                </div>
                            )}
                            <textarea
                                ref={textareaRef}
                                rows={1}
                                value={message}
                                onChange={(e) => {
                                    setMessage(e.target.value);
                                    adjustHeight();
                                }}
                                onKeyDown={handleKeyDown}
                                placeholder="Describe your Symptoms"
                                className="w-full bg-transparent py-2 sm:py-3 text-sm sm:text-base font-medium placeholder:font-normal text-primarytext focus:outline-none resize-none max-h-40 sm:max-h-50 overflow-y-auto custom-scrollbar"
                                style={{ minHeight: '36px' }}
                                data-gramm="false"
                                data-enable-grammarly="false"
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 xl:gap-4 pr-1">
                {isRecording || disabled ? (
                    <RecordingIcon
                        className="cursor-pointer w-8 h-8 sm:w-14 sm:h-14"
                        onClick={isRecording ? stopRecording : onStop}
                    />
                ) : (
                    <>
                        <MicIcon
                            className={`transition-all w-8 h-8 sm:w-14 sm:h-14 ${showSpinner ? "cursor-not-allowed grayscale opacity-30" : "cursor-pointer"}`}
                            onClick={() => !showSpinner && startRecording()}
                        />
                        {(message.trim().length > 0 || files.length > 0) && (
                            <SendIcon className="cursor-pointer transition-all w-8 h-8 sm:w-14 sm:h-14" onClick={handleAction} />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ChatInput;