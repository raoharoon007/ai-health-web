import React from 'react';

const MessageBubble = ({ msg, displayedText }) => {
    const isUser = msg.role === "user";
    const hasFiles = msg.files && msg.files.length > 0;
    const hasText = msg.isTyping || (msg.text && msg.text.trim().length > 0);

    return (
        <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
            <div className="max-w-[90%] sm:max-w-[85%] flex flex-col gap-2">
                {hasFiles && (
                    <div className="flex justify-end flex-wrap gap-2">
                        {msg.files.map((f, i) => (
                            <div key={i} className="relative rounded-lg overflow-hidden border border-bordercolor bg-gray-50">
                                {f.preview ? (
                                    <img src={f.preview} className="h-24 w-24 object-cover" alt="attachment" />
                                ) : (
                                    f.file && f.file.type?.startsWith("image/") ? (
                                        <img src={URL.createObjectURL(f.file)} className="h-24 w-24 object-cover" alt="attachment" />
                                    ) : (
                                        <div className="h-20 w-20 flex items-center justify-center">FILE</div>
                                    )
                                )}
                            </div>
                        ))}
                    </div>
                )}
                {hasText && (
                    <div className={`
                        px-5 sm:px-6 py-3.5 sm:py-4 rounded-2xl text-[15px] sm:text-[16px] leading-[1.6]
                        wrap-break-word whitespace-pre-wrap overflow-hidden 
                        ${isUser
                            ? "bg-primary text-white rounded-tr-none font-medium"
                            : "bg-white text-primarytext border border-bordercolor rounded-tl-none font-normal tracking-wide"}
                    `}>
                        <div>
                            {msg.isTyping && displayedText ? (
                                <span>
                                    {displayedText}
                                    <span className="inline-block w-0.5 h-4 ml-1 align-middle bg-primary animate-pulse"></span>
                                </span>
                            ) : (
                                !msg.isTyping && msg.text
                            )}

                            {msg.isTyping && displayedText === "" && (
                                <div className="flex items-center gap-1.5 py-1">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
      
export default MessageBubble;