import React, { useState } from "react";
import { IoSend } from "react-icons/io5";

const ChatInput = ({ onSendMessage, disable }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center border-t p-3 bg-white"
    >
      <input
        disabled={disable}
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        className="flex-grow p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-sky-500"
      />
      <button
        disabled={disable}
        type="submit"
        className="bg-sky-600 text-white p-2 rounded-r-md hover:bg-sky-700 transition-colors"
      >
        <IoSend className="h-5 w-5" />
      </button>
    </form>
  );
};

export default ChatInput;
