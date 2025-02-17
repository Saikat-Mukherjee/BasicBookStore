import React, { useState, useRef, useEffect } from 'react';
import { FaRegCommentDots, FaPaperPlane, FaMinus, FaBookOpen } from 'react-icons/fa';
import api from '../services/ai';

const initialMessages = [
  {
    text: "Hi! I'm BookBot, your friendly bookstore assistant. How can I help you today?",
    isBot: true,
    timestamp: new Date(),
  },
];

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessageToBot_old = async (message) => {
    try {
      const response = await api.post(`/chat`, { message: message });
      return response.data.response;
    } catch (error) {
      console.error(error);
      return 'Sorry, I encountered an error. Please try again.';
    }
  };

  const sendMessageToBot = async (message,onChunk) => {
    try {
      //const response = await api.post(`/stream-chat`, { message: message });
      const response = await fetch(`http://localhost:5000/stream-chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error("Network error");
      }
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let done = false;
      let result = "";
      
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunk = decoder.decode(value);
        result += chunk;
        // Callback to update UI for every received chunk
        onChunk && onChunk(chunk);
      }
      
      return result;
    } catch (error) {
      console.error(error);
      return "Sorry, I encountered an error. Please try again.";
    }
      
  };

  const handleSend_old = async () => {
    if (!input.trim()) return;

    const userMessage = {
      text: input,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate bot typing delay
    setTimeout(async () => {
      setIsTyping(true);
      const botResponseText = await sendMessageToBot(input);
      setIsTyping(false);
      const botResponse = {
        text: botResponseText,
        isBot: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);

    setInput('');
  };

  const handleSend = async () => {
    if (!input.trim()) return;
  
    const userMessage = {
      text: input,
      isBot: false,
      timestamp: new Date(),
    };
  
    setMessages((prev) => [...prev, userMessage]);
  
    // Insert a placeholder bot message
    const botMessage = {
      text: "",
      isBot: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, botMessage]);
  
    setIsTyping(true);
    
    // Function to update the bot message as chunks come in
    const onChunk = (chunk) => {
      setMessages((prev) => {
        // update the last message with the new chunk
        const updated = [...prev];
        updated[updated.length - 1].text += chunk;
        return updated;
      });
    };
  
    // Receive the complete response (optional since you're updating on each chunk)
    await sendMessageToBot(input, onChunk);
    
    setIsTyping(false);
    setInput("");
  };

  const TypingIndicator = () => (
    <div className="flex space-x-2 p-3 bg-gray-100 rounded-lg max-w-[90%]">
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  );

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        >
          <FaRegCommentDots size={24} />
        </button>
      ) : (
        <div className="bg-white rounded-lg shadow-xl w-80 h-[500px] flex flex-col">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center gap-2">
              <FaBookOpen size={24} />
              <h3 className="font-semibold">BookBot Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-blue-700 p-1 rounded"
            >
              <FaMinus size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.isBot
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  {message.text}
                  <div
                    className={`text-xs mt-1 ${
                      message.isBot ? 'text-gray-500' : 'text-blue-100'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            ))}
             {isTyping && (
              <div className="flex justify-start">
                <TypingIndicator />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:border-blue-600"
              />
              <button
                onClick={handleSend}
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaPaperPlane size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;