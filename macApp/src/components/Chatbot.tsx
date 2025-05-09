import './Chatbot.css';
import { VscSend } from 'react-icons/vsc';
import { VscCopy } from 'react-icons/vsc';
import { VscClearAll } from 'react-icons/vsc';
import { useState } from 'react';
import { Window } from '@tauri-apps/api/window';
import ReactMarkdown from 'react-markdown';

// API configuration
const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT 
const API_KEY = import.meta.env.VITE_API_KEY;

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  text: string;
  isUser: boolean;
}

const Chatbot = ({ isOpen, onClose }: ChatbotProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleClearChat = () => {
    setMessages([]);
  };

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const logError = async (error: any) => {
    console.error('Error:', error);
    // Log to Tauri's native console
    const appWindow = Window.getCurrent();
    await appWindow.emit('error', { 
      message: error.message || 'Unknown error',
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    setIsLoading(true);

    try {
      if (!API_KEY) {
        throw new Error('API key is not configured');
      }

      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
        },
        body: JSON.stringify({ message: userMessage }),
      });

      console.log('Raw response status:', response.status);
      const data = await response.json();
      console.log('API Response:', JSON.stringify(data, null, 2));
      
      if (data.error) {
        console.error('API Error:', data.error);
        await logError(new Error(`API Error: ${data.error}`));
        setMessages(prev => [...prev, { text: "Sorry, I encountered an error. Please try again.", isUser: false }]);
      } else if (data.message) {
        console.log('Setting message:', data.message);
        setMessages(prev => [...prev, { text: data.message, isUser: false }]);
      } else {
        console.error('Unexpected response format:', data);
        await logError(new Error(`Unexpected response format: ${JSON.stringify(data)}`));
        setMessages(prev => [...prev, { text: "Sorry, I couldn't generate a response. Please try again.", isUser: false }]);
      }
    } catch (error) {
      console.error('API Error:', error);
      await logError(error);
      setMessages(prev => [...prev, { text: "Sorry, I couldn't connect to the server. Please try again.", isUser: false }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={`chatbot ${isOpen ? 'open' : ''}`}>
      <div className="chatbot-header">
        <button onClick={onClose} className="close-button">×</button>
      </div>
      <div className="chatbot-content">
        <div className="chat-messages">
          {messages.map((message, index) => (
            <div key={index} className={`message-container ${message.isUser ? 'user-message' : 'bot-message'}`}>
              {message.isUser ? (
                <p>{message.text}</p>
              ) : (
                <div className="bot-message-content">
                  <ReactMarkdown
                    components={{
                      p: ({ node, ...props }) => <p {...props} />,
                      code: ({ children, ...props }: any) => 
                        props.inline ? <code {...props}>{children}</code> : <pre><code {...props}>{children}</code></pre>,
                      pre: ({ node, ...props }) => <pre {...props} />,
                    }}
                  >
                    {message.text}
                  </ReactMarkdown>
                  <button 
                    className="copy-button"
                    onClick={() => handleCopy(message.text, index)}
                    title="Copy message"
                  >
                    <VscCopy size={16} />
                    {copiedIndex === index && <span className="copy-tooltip">Copied!</span>}
                  </button>
                </div>
              )}
            </div>
          ))}
          {isLoading && <div className="message-container bot-message"><p>Thinking...</p></div>}
        </div>
        <div className="chat-input">
          <input 
            type="text" 
            placeholder="Type your message..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <div className="input-buttons">
            <button 
              onClick={handleClearChat} 
              className="clear-button"
              title="Clear chat history"
            >
              <VscClearAll size={20} />
            </button>
            <button 
              className="send-button" 
              onClick={handleSend}
              disabled={isLoading}
            >
              <VscSend size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot; 