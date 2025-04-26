import { useState } from "react";
import { HiMenu, HiChat, HiPlus, HiCog } from "react-icons/hi";
import { MdOutlineSaveAs } from "react-icons/md";
import "./App.css";
import Chatbot from "./components/Chatbot";
import MusicPlayer from "./components/MusicPlayer";
import SettingsModal from "./components/SettingsModal";

function App() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(16);

  const handleFontSizeChange = (newSize: number) => {
    setFontSize(newSize);
    document.documentElement.style.fontSize = `${newSize}px`;
  };

  return (
    <div className="app" style={{ fontSize: `${fontSize}px` }}>
      <div className="menu-container">
        <button 
          className="menu-button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Menu"
        >
          <HiMenu size={20} />
        </button>
        {isMenuOpen && (
          <div className="dropdown-menu">
            <button className="dropdown-item">
              <HiPlus size={20} />
            </button>
            <button className="dropdown-item">
              <MdOutlineSaveAs size={20} />
            </button>
            <button 
              className="dropdown-item"
              onClick={() => {
                setIsSettingsOpen(true);
                setIsMenuOpen(false);
              }}
            >
              <HiCog size={20} />
            </button>
          </div>
        )}
      </div>
      <main className={`main-content ${isChatbotOpen ? 'chatbot-open' : ''}`}>
        <div className="content-wrapper">
          <h2>Welcome to MuseAI</h2>
          <p>Start taking notes by clicking the menu button above.</p>
          <h2>Welcome to MuseAI</h2>
          <p>Start taking notes by clicking the menu button above.</p>
          <h2>Welcome to MuseAI</h2>
          <p>Start taking notes by clicking the menu button above.</p>
        </div>
      </main>
      {!isChatbotOpen && (
        <button 
          className="chatbot-toggle"
          onClick={() => setIsChatbotOpen(!isChatbotOpen)}
          aria-label="Chat"
        >
          <HiChat size={20} />
        </button>
      )}
      <Chatbot 
        isOpen={isChatbotOpen} 
        onClose={() => setIsChatbotOpen(false)} 
      />
      <MusicPlayer />
      <SettingsModal
        open={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onFontSizeChange={handleFontSizeChange}
        currentFontSize={fontSize}
      />
    </div>
  );
}

export default App;
