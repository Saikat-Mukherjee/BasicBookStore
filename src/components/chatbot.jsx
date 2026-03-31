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
    <div className="flex space-x-2 p-4 bg-white border border-gray-100 rounded-2xl rounded-tl-none shadow-sm max-w-[90%] items-center">
      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
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
          className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 rounded-full shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 flex items-center gap-2 group"
        >
          <FaRegCommentDots size={28} className="group-hover:rotate-12 transition-transform" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap font-medium">
            Chat with us
          </span>
        </button>
      ) : (
        <div className="bg-white rounded-xl shadow-2xl w-[450px] h-[650px] flex flex-col border border-gray-200 font-sans">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white p-5 rounded-t-xl flex justify-between items-center shadow-md">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full">
                <FaBookOpen size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg tracking-wide">BookBot Assistant</h3>
                <p className="text-xs text-blue-100 font-medium">Your Personal Literary Guide</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 p-2 rounded-full transition-all duration-200"
            >
              <FaMinus size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-gray-50">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${
                    message.isBot
                      ? 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                      : 'bg-blue-600 text-white rounded-tr-none'
                  }`}
                >
                  <p className="leading-relaxed text-sm">{message.text}</p>
                  <div
                    className={`text-[10px] mt-2 text-right ${
                      message.isBot ? 'text-gray-400' : 'text-blue-200'
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
          <div className="p-4 bg-white border-t border-gray-100 rounded-b-xl">
            <div className="flex gap-3 items-center bg-gray-50 p-2 rounded-full border border-gray-200 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about books, authors, or recommendations..."
                className="flex-1 bg-transparent px-4 py-2 focus:outline-none text-sm text-gray-700 placeholder-gray-400"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className={`p-3 rounded-full transition-all duration-200 ${
                  input.trim() 
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md transform hover:scale-105' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <FaPaperPlane size={16} />
              </button>
            </div>
            <div className="text-center mt-2">
              <span className="text-[10px] text-gray-400">Powered by AI • BookStore Assistant</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;