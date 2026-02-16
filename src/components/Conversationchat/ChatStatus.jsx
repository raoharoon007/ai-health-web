import Chatbotlogo from '../../assets/images/Chatbot.webp';
import ListeningAvatar from '../../assets/images/ListeningAvatar.webp';
import Reviewbot from '../../assets/images/Reviewbot.webp';
import Botvideo from '../../assets/videos/Botvideo.mp4';

const ChatStatus = ({ isRecording, isTranscribing, botStatus }) => {
    return (
        <div className="flex-none pt-4 sm:pt-8 pb-2 sm:pb-4 bg-white z-10 ">
            <div className="h-24 w-24 sm:h-35 sm:w-35 mx-auto transition-all duration-300 flex justify-center items-center rounded-full bg-blue-500/10">
                {botStatus === "replying" ? (
                    <video src={Botvideo} autoPlay loop muted={false} className="h-full w-full object-contain rounded-full" />
                ) : (
                    <img 
                        src={isRecording ? ListeningAvatar : (isTranscribing || botStatus === "reviewing") ? Reviewbot : Chatbotlogo} 
                        alt="Bot" 
                        className="h-full w-full object-contain rounded-full" 
                    />
                )}
            </div>
            <div className="h-6 flex items-center justify-center mt-2">
                <span className="text-black font-semibold text-sm sm:text-base">
                    {isRecording && <span className="animate-pulse">Listening....</span>}
                    {isTranscribing && !isRecording && "Transcribing...."}
                    {botStatus === "reviewing" && "Reviewing your input..."}
                    {botStatus === "replying" && "Speaking..."}
                </span>
            </div>
        </div>
    );
};

export default ChatStatus;