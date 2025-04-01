import React, { useState, useEffect, useRef } from "react";

type MessageType = {
  type: "user" | "bot" | "error";
  content: string;
};

// Use environment variables
const NEXT_AGI_API_KEY = "app-ruGmYX438Wm4TJR03TueyGmx"; 
const NEXT_AGI_BASE_URL = "http://api.next-agi.com/v1"; 

// Speech recognition setup
interface SpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: (event: any) => void;
  onerror: (event: any) => void;
  onend: () => void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
}

const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

const ChatComponent: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [conversationId, setConversationId] = useState<string>("");
  const [messages, setMessages] = useState<MessageType[]>([
    {
      type: "bot",
      content: "Welcome to our Insurance Assistant!\nHow can I help you today?"
    }
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isClosing, setIsClosing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Modify the useEffect for click outside handling
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      const chatButton = document.querySelector('.chat-button');
      
      // Don't close if clicking the chat button
      if (chatButton?.contains(target)) {
        return;
      }

      // Close if clicking outside and chat is open
      if (isOpen && chatContainerRef.current && !chatContainerRef.current.contains(target)) {
        setIsOpen(false);
      }
      
      // Close dropdown if clicking outside
      if (showDropdown && !target.closest('.dropdown')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, showDropdown]);

  // Initialize speech recognition
  useEffect(() => {
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setQuery(prev => prev + transcript);
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };
      } catch (error) {
        console.error("Error initializing speech recognition:", error);
      }
    }

    // Cleanup on unmount
    return () => {
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Toggle speech recognition
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error("Error starting speech recognition:", error);
      }
    }
  };

  const sendMessage = async () => {
    if (!query.trim() || isLoading) return;

    const payload = {
      inputs: {},
      query,
      response_mode: "streaming",
      conversation_id: conversationId,
      user: "abc-123",
      files: []
    };

    setIsLoading(true);
    setMessages((prev) => [...prev, { type: "user", content: query }]);
    setQuery("");

    try {
      const response = await fetch(`${NEXT_AGI_BASE_URL}/chat-messages`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${NEXT_AGI_API_KEY}`,
          "Content-Type": "application/json",
          Accept: "text/event-stream"
        },
        body: JSON.stringify(payload),
        duplex: "half"
      } as RequestInit);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      // Add a bot message that we'll update
      setMessages((prev) => [...prev, { type: "bot", content: "" }]);

      if (reader) {
        let fullAnswer = "";
        
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          const text = decoder.decode(value, { stream: true });
          text.split("\n").forEach((line) => {
            if (line.startsWith("data: ")) {
              try {
                const eventData = JSON.parse(line.slice(6));
                if (eventData.conversation_id) {
                  setConversationId(eventData.conversation_id);
                }
                if (eventData.answer) {
                  // Accumulate the answer chunks
                  fullAnswer += eventData.answer;
                  // Update the last message instead of adding a new one
                  setMessages((prev) => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = { 
                      type: "bot", 
                      content: fullAnswer 
                    };
                    return newMessages;
                  });
                }
              } catch (error) {
                console.error("Error parsing SSE event:", error);
              }
            }
          });
        }
      }
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        { type: "error", content: error.message || "Failed to connect to the chat service." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fixed the star rendering issue in the formatMessageContent function
  const formatMessageContent = (content: string) => {
    // First replace ** with proper bold tags to fix the stars issue
    let formattedContent = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Handle numbered lists
    const hasNumberedList = /\d+\.\s/.test(formattedContent);
    
    if (hasNumberedList) {
      // Split by new lines or numbered items
      const parts = formattedContent.split(/(?=\d+\.\s)/);
      
      // Get the introduction text (everything before the first numbered item)
      const intro = parts[0].trim().startsWith(/\d+\.\s/.test(parts[0]) ? '' : parts[0]);
      
      // Get all list items
      const listItems = parts.filter(part => /^\d+\.\s/.test(part.trim()));
      
      // Format each list item
      const formattedItems = listItems.map(item => {
        // Extract number and text
        const match = item.match(/(\d+)\.\s(.*)/s);
        if (!match) return `<li>${item}</li>`;
        
        const [_, number, text] = match;
        
        // Format with bold titles if there's a colon
        if (text.includes(':')) {
          const [title, ...rest] = text.split(':');
          return `<li><strong>${title.trim()}</strong>: ${rest.join(':').trim()}</li>`;
        }
        
        return `<li>${text}</li>`;
      });
      
      // Build the formatted HTML
      return `
        ${intro ? `<p>${intro}</p>` : ''}
        <ol class="list-decimal pl-5 my-4 space-y-2">
          ${formattedItems.join('\n')}
        </ol>
      `;
    }
    
    // Handle basic text with paragraphs
    return formattedContent.split('\n\n').map(paragraph => 
      `<p class="mb-4">${paragraph.replace(/\n/g, '<br />')}</p>`
    ).join('');
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 300); // Match this with animation duration
  };

  const handleReset = () => {
    // Reset messages to initial state
    setMessages([
      {
        type: "bot" as const,
        content: "Welcome to our Insurance Assistant! How can I help you today?"
      }
    ]);
    // Clear the input field
    setQuery("");
    // Reset conversation ID
    setConversationId("");
    // Close the dropdown
    setShowDropdown(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8">
      {/* Chat Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (isOpen) {
            handleClose();
          } else {
            setIsOpen(true);
          }
        }}
        className="bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-full p-3 sm:p-4 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center chat-button"
      >
        <img 
          src="/xpectrumLogo.png"
          alt="Chat" 
          className="h-6 w-6 sm:h-7 sm:w-7" 
        />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div 
          ref={chatContainerRef}
          className={`absolute bottom-20 right-0 rounded-lg shadow-2xl 
            w-[90vw] sm:w-[400px] md:w-[450px] lg:w-[500px] 
            h-[80vh] sm:h-[600px] md:h-[650px] lg:h-[700px] 
            max-h-[85vh] flex flex-col overflow-hidden
            bg-gradient-to-b from-purple-600 via-purple-400 to-white
            ${isClosing 
              ? 'animate-bubbleClose' 
              : 'animate-bubbleOpen'
            }`}
          style={{
            animation: isClosing ? 'fadeOut 0.3s ease-out' : 'fadeIn 0.3s ease-out',
          }}
        >
          {/* Header - updated with more vibrant colors */}
          <div className="p-4 rounded-t-lg flex justify-between items-center bg-gradient-to-r from-purple-600 to-purple-500 shadow-md">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-white flex items-center justify-center shadow-md">
                <img 
                  src="/LadyProfile.jpg" 
                  alt="Assistant" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="h-10 w-18 overflow-hidden rounded-lg bg-white shadow-sm">
                <img 
                  src="/InsuranceLogo.jpg" 
                  alt="Insurance Logo" 
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative dropdown">
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="text-white hover:text-gray-200 focus:outline-none"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 dropdown-content">
                    <button 
                      onClick={handleReset}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-purple-100 flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Reset Chat
                    </button>
                    <button 
                      onClick={() => {
                        setShowDropdown(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-purple-100 flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Settings
                    </button>
                  </div>
                )}
              </div>
              <button onClick={handleClose} className="text-white hover:text-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages Area - completely redesigned to remove boxes */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gradient-to-b from-purple-50 to-white">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"} animate-fadeInUp visible`}
                style={{ 
                  animation: `fadeInUp 0.3s ease-out ${index * 0.1}s`,
                  opacity: 1
                }}
              >
                {/* User Avatar for bot messages */}
                {msg.type === "bot" && (
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-white flex-shrink-0 mr-2 shadow-sm">
                    <img 
                      src="/LadyProfile.jpg" 
                      alt="Assistant" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                {/* Message Content - styled differently based on type */}
                <div
                  className={`message-content max-w-[85%] sm:max-w-[80%] ${
                    msg.type === "user"
                      ? "text-right text-purple-900 pl-4"
                      : msg.type === "bot"
                      ? "text-left text-gray-800"
                      : "text-left text-red-800 italic"
                  }`}
                >
                  <div 
                    className={`inline-block px-4 py-3 rounded-2xl ${
                      msg.type === "user"
                        ? "bg-gradient-to-r from-purple-400 to-purple-600 text-white"
                        : msg.type === "bot"
                        ? "bg-white shadow-md border-l-4 border-purple-400"
                        : "bg-red-100"
                    } text-base leading-relaxed`}
                    dangerouslySetInnerHTML={{ 
                      __html: formatMessageContent(msg.content) 
                    }}
                  />
                </div>
                
                {/* User Avatar for user messages */}
                {msg.type === "user" && (
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-purple-600 flex-shrink-0 ml-2 shadow-sm flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
            
            {/* Enhanced typing indicator with bouncing dots */}
            {isLoading && (
              <div className="flex justify-start animate-fadeInUp visible" style={{animation: 'fadeInUp 0.3s ease-out'}}>
                <div className="w-8 h-8 rounded-full overflow-hidden bg-white flex-shrink-0 mr-2 shadow-sm">
                  <img 
                    src="/LadyProfile.jpg" 
                    alt="Assistant" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="bg-white px-4 py-3 rounded-2xl shadow-md inline-block">
                  <div className="typing-dots">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area - improved with glass effect */}
          <div className="p-4 bg-white bg-opacity-70 backdrop-filter backdrop-blur-sm border-t border-purple-200 shadow-inner">
            <div className="flex items-center gap-3">
              <button
                onClick={toggleListening}
                disabled={isLoading}
                className={`p-3 rounded-full transition-colors duration-200 ${
                  isListening 
                    ? 'bg-red-500 hover:bg-red-600 text-white shadow-md' 
                    : 'bg-white hover:bg-gray-50 text-purple-600 shadow-sm'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </button>
              
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 border border-purple-200 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white shadow-sm"
                placeholder="Type your message..."
                disabled={isLoading}
                onKeyDown={(e) => e.key === "Enter" && !isLoading && sendMessage()}
              />
              
              <button
                onClick={sendMessage}
                disabled={isLoading || !query.trim()}
                className={`p-3 rounded-full transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-md ${
                  !query.trim() || isLoading 
                    ? 'bg-purple-400 text-white cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-500 to-purple-700 text-white'
                }`}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-6 w-6" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* CSS for animations */}
      <style>{`
        /* Animations for the chat window */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeOut {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(20px); }
        }
        
        /* More elegant slide up animation */
        @keyframes fadeInUp {
          from { 
            opacity: 0; 
            transform: translateY(10px);
          }
          to { 
            opacity: 1; 
            transform: translateY(0);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.4s ease-out forwards;
        }
        
        /* Typing dots animation */
        .typing-dots {
          display: flex;
          gap: 4px;
          padding: 4px 0;
        }
        
        .dot {
          width: 8px;
          height: 8px;
          background-color: #8b5cf6; /* Purple-500 */
          border-radius: 50%;
          display: inline-block;
          animation: bounce 1.4s infinite ease-in-out both;
        }
        
        .dot:nth-child(1) { 
          animation-delay: -0.32s; 
        }
        
        .dot:nth-child(2) { 
          animation-delay: -0.16s; 
        }
        
        @keyframes bounce {
          0%, 80%, 100% { 
            transform: scale(0);
          }
          40% { 
            transform: scale(1.0);
          }
        }
        
        /* Animations for the dropdown menu */
        .dropdown-content {
          transform-origin: top right;
          animation: dropdownFade 0.2s ease-out;
        }
        
        @keyframes dropdownFade {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        /* Animation for bubbles */
        @keyframes bubbleOpen {
          0% { opacity: 0; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        
        @keyframes bubbleClose {
          0% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(0.9); }
        }
        
        .animate-bubbleOpen {
          animation: bubbleOpen 0.3s forwards;
        }
        
        .animate-bubbleClose {
          animation: bubbleClose 0.3s forwards;
        }
        
        /* Custom message styling */
        .message-content p {
          margin-bottom: 0.5rem;
        }
        
        .message-content p:last-child {
          margin-bottom: 0;
        }
        
        /* No message boxes, just styled text */
        .message-content strong {
          color: inherit;
          font-weight: 600;
        }
        
        /* Improved animation for new messages */
        .message-content {
          transform-origin: bottom;
          transition: all 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ChatComponent;