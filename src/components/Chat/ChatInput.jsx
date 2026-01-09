import { useState, useEffect, useRef } from "react";
import FileAttachIcon from '../../assets/icons/File-attachment.svg?react';
import MicIcon from '../../assets/icons/Mic-icon.svg?react';
import SendIcon from '../../assets/icons/Send-icon.svg?react';
import RecordingIcon from '../../assets/icons/Recording-icon.svg?react';
import CrossFileIcon from '../../assets/icons/Cross-file.svg?react';
import Linespinner from '../../assets/icons/Line-Spinner.svg?react';
import VoiceWave from "./VoiceWave";

const ChatInput = ({ onRecordingChange = () => { }, onSend = () => { }, onStop = () => { }, disabled = false, isTranscribing = false }) => {

    const [message, setMessage] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [files, setFiles] = useState([]);
    const [fileLimitError, setFileLimitError] = useState(false);
    const recognitionRef = useRef(null);
    const fileInputRef = useRef(null);
    const textareaRef = useRef(null);
    const MAX_FILES = 3;

    const isFileDisabled = isRecording;

    const startRecording = () => {
        if (disabled) return;
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return alert("Speech recognition not supported");

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.onresult = (event) => {
            let transcript = "";
            for (let i = event.resultIndex; i < event.results.length; i++) {
                transcript += event.results[i][0].transcript;
            }
            setMessage(transcript);
        };

        recognition.start();
        recognitionRef.current = recognition;
        setIsRecording(true);
        onRecordingChange(true);
    };

    const stopRecording = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            recognitionRef.current.abort();
            recognitionRef.current = null;
        }
        setIsRecording(false);
        onRecordingChange(false);
    };

    const adjustHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
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
            setTimeout(() => {
                if (message.trim().length > 0 || files.length > 0) {
                    onSend(message, files);
                    setMessage("");
                    setFiles([]);
                    if (textareaRef.current) textareaRef.current.style.height = "auto";
                }
            }, 100);
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

    return (
        <div className={`relative w-full max-w-5xl flex justify-center mx-auto py-2 sm:py-4 gap-1.5 sm:gap-4 items-end bg-transparent transition-opacity ${disabled ? "opacity-70" : "opacity-100"}`}>

            {/* File Attachment Icon - Adjusted size for mobile */}
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

            {/* Main Input Container - Border radius and padding adjusted */}
            <div className={`relative flex flex-col flex-1 bg-white border rounded-2xl sm:rounded-3xl overflow-hidden transition-all ${disabled ? "bg-gray-50 border-gray-200" : "border-bordercolor focus-within:border-primary"}`}>

                {/* --- FILES MAPPING --- */}
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
                        <VoiceWave active={isRecording} color="#1D1D1B" />
                    </div>

                    {!isRecording && (
                        <div className="relative w-full flex items-center">
                            {isTranscribing && (
                                <div className="absolute inset-0 flex items-center gap-2 bg-white z-10">
                                    <Linespinner className="animate-spin w-4 h-4" />
                                    <span className="text-secondarytext text-sm sm:text-base font-light italic">Transcribing....</span>
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
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Action Buttons (Mic/Send) - Adjusted sizes for mobile */}
            <div className="flex items-center gap-1 sm:gap-2 pr-1">
                {isRecording || disabled ? (
                    <RecordingIcon
                        className="cursor-pointer w-8 h-8 sm:w-14 sm:h-14"
                        onClick={isRecording ? stopRecording : onStop}
                    />
                ) : (
                    <>
                        {(message.trim().length > 0 || files.length > 0) && (
                            <SendIcon className="cursor-pointer transition-all w-8 h-8 sm:w-14 sm:h-14" onClick={handleAction} />
                        )}

                        <MicIcon
                            className={`transition-all w-8 h-8 sm:w-14 sm:h-14 ${isTranscribing ? "cursor-not-allowed grayscale opacity-30" : "cursor-pointer"}`}
                            onClick={() => !isTranscribing && startRecording()}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default ChatInput;