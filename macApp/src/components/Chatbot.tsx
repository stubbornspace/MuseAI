import './Chatbot.css';
import { VscSend } from 'react-icons/vsc';

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

const Chatbot = ({ isOpen, onClose }: ChatbotProps) => {
  return (
    <div className={`chatbot ${isOpen ? 'open' : ''}`}>
      <div className="chatbot-header">
        <p>Chat Assistant</p>
        <button onClick={onClose} className="close-button">×</button>
      </div>
      <div className="chatbot-content">
        <div className="chat-messages">
          <p>Hello! How can I help you today?</p>
        </div>
        <div className="chat-input">
          <input type="text" placeholder="Type your message..." />
          <button className="send-button">
            <VscSend size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot; 