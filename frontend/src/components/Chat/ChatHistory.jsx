import React, { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";

const ChatHistory = ({ messages }) => {
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (containerRef.current && messagesEndRef.current) {
      // Scroll the container instead of using scrollIntoView
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      ref={containerRef}
      className="flex-grow p-4 overflow-y-auto  h-[400px]"
    >
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">Start a conversation...</p>
        </div>
      ) : (
        messages.map((msg, index) => (
          <ChatMessage
            key={index}
            message={msg.content}
            isUser={msg.role === "user"}
            timestamp={msg.timestamp}
          />
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatHistory;
