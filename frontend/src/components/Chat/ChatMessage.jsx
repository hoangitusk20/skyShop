import React from "react";

const ChatMessage = ({ message, isUser }) => {
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-[75%] rounded-lg p-3 ${
          isUser
            ? "bg-sky-600 text-white rounded-tr-none"
            : "bg-gray-200 text-gray-800 rounded-tl-none"
        }`}
      >
        <p className="text-sm whitespace-pre-line">{message}</p>
      </div>
    </div>
  );
};

export default ChatMessage;
