import ChatInput from "../Chat/ChatInput"; 

const ChatFooter = ({ 
    onRecordingChange, 
    onTranscribingStatus, 
    onSend, 
    onStop, 
    botStatus, 
    isTranscribing, 
    apiError 
}) => {
    return (
        <div className="flex-none bg-white px-1 sm:px-5">
            <div className="max-w-5xl mx-auto py-2">
                <div className="w-full">
                    <ChatInput
                        onRecordingChange={onRecordingChange}
                        onTranscribingStatus={onTranscribingStatus}
                        onSend={onSend}
                        onStop={onStop}
                        disabled={botStatus !== "idle"}
                        isTranscribing={isTranscribing}
                    />
                </div>
                {apiError && <div className="mt-2 text-warning text-xs text-center italic font-medium">{apiError}</div>}
                <div className="flex justify-center py-2">
                    <span className="text-center text-mutedtext font-light text-[10px] sm:text-sm">
                        AI can make mistakes. Consider checking important information.
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ChatFooter;