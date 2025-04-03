import React, { useEffect, useState } from "react";
import { HiOutlineChatBubbleLeft } from "react-icons/hi2";
import { FaSpinner } from "react-icons/fa";
import ChatHistory from "../components/Chat/ChatHistory";
import ChatInput from "../components/Chat/ChatInput";
import { useDispatch, useSelector } from "react-redux";
import { loadChatHistory, sendMessage } from "../redux/slice/chatSlice";

const ChatPage = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const dispatch = useDispatch();
  const { user, guestId } = useSelector((state) => state.auth);
  const { messages, loading } = useSelector((state) => state.chat);

  // Load chat history when the component mounts
  useEffect(() => {
    dispatch(loadChatHistory({ userId: user?._id, guestId }));
  }, []);

  useEffect(() => {
    if (messages) {
      setChatHistory(messages);
    }
  }, [messages]);

  // Function to handle sending a new message
  const handleSendMessage = (message) => {
    // Add user message to the chat
    const userMessage = {
      content: message,
      role: "user",
      timestamp: new Date(),
    };

    setChatHistory((prev) => [...prev, userMessage]);
    setChatHistory((prev) => [
      ...prev,
      { content: "Bot is typing...", role: "model", timestamp: new Date() },
    ]);

    dispatch(sendMessage({ message, guestId, userId: user?._id }));
  };

  return (
    <div className="container mx-auto max-w-4xl p-4">
      <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-[80vh]">
        {/* Chat Header */}
        <div className="bg-sky-600 text-white p-4 flex items-center">
          <HiOutlineChatBubbleLeft className="h-6 w-6 mr-2" />
          <h2 className="text-xl font-semibold">Chat Support</h2>
        </div>
        {/* Chat Messages */}
        <ChatHistory messages={chatHistory} />
        {/* Chat Input */}
        <ChatInput onSendMessage={handleSendMessage} disable={loading} />
      </div>
    </div>
  );
};

export default ChatPage;
