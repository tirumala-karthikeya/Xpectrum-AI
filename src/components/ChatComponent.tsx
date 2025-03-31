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
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isClosing, setIsClosing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Modify the useEffect for click outside handling
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const chatButton = document.querySelector('.chat-button');
      
      // Don't close if clicking the chat button
      if (chatButton?.contains(target)) {
        return;
      }

      // Close if clicking outside and chat is open
      if (isOpen && chatContainerRef.current && !chatContainerRef.current.contains(target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

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

  // Format message content with improved HTML
  const formatMessageContent = (content: string) => {
    // Step 1: Fix common text issues before formatting
    content = content
      // Fix spaces in words
      .replace(/you\s+r\b/g, "your")
      .replace(/\bto\s+term\b/g, "with term")
      
      // Fix missing subjects in sentences
      .replace(/\bcan provide\b/g, "I can provide")
      .replace(/\bcan assist\b/g, "I can assist")
      
      // Fix missing words in phrases
      .replace(/guide you the/g, "guide you through the")
      .replace(/easy get covered/g, "easy to get covered")
      .replace(/specific term/g, "about specific term")
      .replace(/available them/g, "available for them")
      .replace(/policy if\./g, "policy if needed.")
      .replace(/how I assist/g, "how I can assist")
      
      // Fix incomplete sentences
      .replace(/or managing a policy if\.\s*$/g, "or managing a policy if needed.");
    
    // Step 2: Fix list numbering issues - normalize all list items
    const lines = content.split('\n');
    let currentNumber = 0;
    
    // Process each line
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip empty lines
      if (!line) continue;
      
      // Check if this line starts with a number or a dot
      if (/^\d+\./.test(line)) {
        // Line starts with a number - extract it
        currentNumber = parseInt(line.match(/^(\d+)\./)[1]);
        // Keep the original numbered format
      } else if (/^\./.test(line)) {
        // Line starts with a dot - replace with next number
        currentNumber++;
        lines[i] = lines[i].replace(/^\.\s*/, `${currentNumber}. `);
      } else if (line.match(/^[A-Z].+:/) && !line.startsWith("Feel free")) {
        // Line starts with capitalized word followed by colon - likely a list item without a number
        currentNumber++;
        lines[i] = `${currentNumber}. ${line}`;
      }
    }
    
    // Reassemble content with fixed numbering
    content = lines.join('\n');
    
    // Step 3: Apply HTML formatting
    return content
      // Convert asterisks to strong tags
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      
      // Handle incomplete asterisks
      .replace(/\*\*([^*\n]+)(?!\*\*)/g, '<strong>$1</strong>')
      
      // Format numbered lists with consistent styling
      .replace(/^(\d+)\.\s+(.*?)$/gm, (match, number, text) => {
        // If text starts with a word followed by colon, make that part bold
        if (/^([A-Za-z][^:]+):\s*(.*)$/.test(text)) {
          const [_, label, rest] = text.match(/^([A-Za-z][^:]+):\s*(.*)$/);
          return `<li class="mb-3" value="${number}"><strong>${label}:</strong> ${rest}</li>`;
        }
        return `<li class="mb-3" value="${number}">${text}</li>`;
      })
      
      // Group consecutive list items into ordered lists
      .replace(/(<li[^>]*value="[^"]*"[^>]*>.*?<\/li>\s*)+/g, 
        '<ol class="list-decimal pl-5 my-4 space-y-2">$&</ol>')
      
      // Format paragraphs for better spacing
      .replace(/(.+?)(\n{2,}|$)/g, (match, text, ending) => {
        if (!text.includes('<li') && !text.includes('<ol') && !text.includes('<ul') && text.trim().length > 0) {
          return `<p class="mb-4">${text}</p>${ending}`;
        }
        return match;
      })
      
      // Convert single line breaks to <br> only within paragraphs
      .replace(/(<p[^>]*>.*?)(\n)(?!<\/p>)(.*?<\/p>)/g, '$1<br>$3')
      
      // Clean up any unnecessary line breaks
      .replace(/\n+/g, '\n')
      .replace(/(<\/(?:p|ol|ul|li)>)\n/g, '$1');
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 300); // Match this with animation duration
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
        className="bg-xpectrum-purple hover:bg-xpectrum-darkpurple text-white rounded-full p-3 sm:p-4 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center chat-button"
      >
        <img 
          src="/xpectrumLogo.png" 
          alt="Chat" 
          className="h-5 w-5 sm:h-6 sm:w-6" 
        />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div 
          ref={chatContainerRef}
          className={`absolute bottom-20 right-0 bg-white rounded-lg shadow-2xl w-[80vw] sm:w-[300px] md:w-[320px] lg:w-[350px] h-[70vh] sm:h-[500px] md:h-[520px] lg:h-[550px] max-h-[80vh] flex flex-col chat-container
            transition-all duration-300 ease-out
            ${isClosing 
              ? 'opacity-0 transform translate-y-full scale-95' 
              : 'opacity-100 transform translate-y-0 scale-100 animate-slideIn'
            }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-xpectrum-purple text-white p-2 sm:p-3 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center gap-2">
              {/* First Profile Icon */}
              <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                <img 
                  src="/LadyProfile.jpg" 
                  alt="Assistant Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Second Profile Icon */}
              <div className="w-12 h-8 rounded-md overflow-hidden">
                <img 
                  src="/InsuranceLogo.png" 
                  alt="Insurance Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClose();
              }}
              className="text-white hover:text-gray-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 sm:h-6 sm:w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <p>Hi there! I'm your insurance assistant.</p>
                <p className="mt-2">Ask me anything about our insurance services, policies, or claims.</p>
              </div>
            )}
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`message-bubble p-2 sm:p-3 ${
                    msg.type === "user"
                      ? "bg-xpectrum-purple text-white rounded-tl-lg rounded-tr-lg rounded-bl-lg"
                      : msg.type === "error"
                      ? "bg-red-100 text-red-800 rounded-tl-lg rounded-tr-lg rounded-br-lg"
                      : "bg-gray-100 text-gray-800 rounded-tl-lg rounded-tr-lg rounded-br-lg"
                  } max-w-[85%] sm:max-w-[80%]`}
                >
                  <div 
                    className="message-content text-sm sm:text-base"
                    dangerouslySetInnerHTML={{
                      __html: formatMessageContent(msg.content)
                    }}
                  />
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-2 sm:p-4 border-t">
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 border rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-xpectrum-purple chat-input"
                placeholder="Type your message..."
                disabled={isLoading}
                onKeyDown={(e) => e.key === "Enter" && !isLoading && sendMessage()}
              />
              
              <button
                onClick={toggleListening}
                disabled={isLoading}
                className={`px-3 py-2 rounded-lg ${
                  isListening
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                } transition-colors duration-200`}
                title={isListening ? "Stop listening" : "Start voice input"}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 sm:h-5 sm:w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
              </button>
              
              <button
                onClick={sendMessage}
                disabled={isLoading}
                className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-white chat-button ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-xpectrum-purple hover:bg-xpectrum-darkpurple"
                } transition-colors duration-200`}
              >
                {isLoading ? (
                  <svg
                    className="animate-spin h-4 w-4 sm:h-5 sm:w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 sm:h-5 sm:w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 2L11 13" />
                    <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatComponent; 