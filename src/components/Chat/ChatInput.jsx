import { useState, useRef } from "react";
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
        if (disabled) return; // Block recording if disabled
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
        if (isFileDisabled) return; // Block file change if disabled
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
        <div className={`relative w-full max-w-5xl flex justify-center mx-auto py-4 sm:gap-4 gap-2 items-end bg-transparent transition-opacity ${disabled ? "opacity-70" : "opacity-100"}`}>

            {/* File Attachment Icon */}
            <FileAttachIcon
                className={`transition-all ${isFileDisabled ? "cursor-not-allowed grayscale opacity-50" : "cursor-pointer"}`}
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
                <div className="absolute -top-12 left-0 bg-warning text-white text-xs px-3 py-2 rounded-lg shadow-lg">
                    You can upload up to 3 files only
                </div>
            )}

            <div className={`relative flex flex-col flex-1 bg-white border rounded-3xl overflow-hidden transition-all ${disabled ? "bg-gray-50 border-gray-200" : "border-bordercolor focus-within:border-primary"}`}>

                {/* --- FILES MAPPING START --- */}
                {files.length > 0 && !isRecording && (
                    <div className="flex flex-wrap gap-3 p-3 pb-0">
                        {files.map((f, i) => {
                            const fileType = f.file.type;
                            const extension = f.file.name.split('.').pop().toUpperCase();

                            return (
                                <div key={i} className="relative group">
                                    {fileType.startsWith("image/") ? (
                                        <img src={f.preview} alt="preview" className="h-20 w-20 object-cover rounded-xl border border-bordercolor" />
                                    ) : (
                                        /* PDF, DOC, Video Icon UI */
                                        <div className="h-20 w-20 flex flex-col items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${extension === 'PDF' ? 'bg-red-100 text-warning' :
                                                extension === 'DOC' || extension === 'DOCX' ? 'bg-blue-100 text-primary' :
                                                    'bg-gray-200 text-gray-700'
                                                }`}>
                                                {extension}
                                            </span>
                                            <p className="text-[8px] text-center mt-2 px-1 truncate w-full text-gray-500">
                                                {f.file.name}
                                            </p>
                                        </div>
                                    )}

                                    {!disabled && (
                                        <button
                                            onClick={() => setFiles(prev => prev.filter((_, idx) => idx !== i))}
                                            className="absolute -top-1.5 -right-1.5 bg-warning text-white rounded-full w-5 h-5 cursor-pointer flex items-center justify-center shadow-sm"
                                        >
                                            <CrossFileIcon style={{ width: '10px' }} />
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
                {/* --- FILES MAPPING END --- */}

                <div className="relative flex items-center w-full min-h-14 px-5">
                    <div className="w-full" style={{ display: isRecording ? 'block' : 'none' }}>
                        <VoiceWave active={isRecording} color="#1D1D1B" />
                    </div>

                    {!isRecording && (
                        <div className="relative w-full flex items-center">
                            {isTranscribing && (
                                <div className="absolute inset-0 flex items-center gap-2 bg-white z-10">
                                    <Linespinner className="animate-spin" />
                                    <span className="text-secondarytext text-base font-light italic">Transcribing....</span>
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
                                className="w-full bg-transparent py-3 font-medium placeholder:font-normal text-primarytext focus:outline-none resize-none max-h-50 overflow-y-auto custom-scrollbar"
                                style={{ minHeight: '44px' }}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Action Buttons (Mic/Send) */}
            <div className="min-w-12 flex items-center gap-2">
                {isRecording || disabled ? (
                    <RecordingIcon
                        className="cursor-pointer"
                        onClick={isRecording ? stopRecording : onStop}
                    />
                ) : (
                    <>
                        {(message.trim().length > 0 || files.length > 0) && (
                            <SendIcon className="cursor-pointer transition-all" onClick={handleAction} />
                        )}

                        <MicIcon
                            className={`transition-all ${isTranscribing ? "cursor-not-allowed grayscale opacity-30" : "cursor-pointer"}`}
                            onClick={() => !isTranscribing && startRecording()}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default ChatInput;