import { useState } from "react";
import { HiMenu, HiChat, HiPlus, HiCog } from "react-icons/hi";
import { MdOutlineSaveAs } from "react-icons/md";
import "./App.css";
import Chatbot from "./components/Chatbot";
import MusicPlayer from "./components/MusicPlayer";
import SettingsModal from "./components/SettingsModal";
import NoteEditor from "./components/NoteEditor";
import SaveNoteModal from "./components/SaveNoteModal";
import NotesList from "./components/NotesList";

interface Note {
  title: string;
  content: string;
  tags: string[];
}

function App() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNoteEditorOpen, setIsNoteEditorOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [backgroundImage, setBackgroundImage] = useState('wave.png');
  const [noteContent, setNoteContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const handleFontSizeChange = (newSize: number) => {
    setFontSize(newSize);
    document.documentElement.style.fontSize = `${newSize}px`;
  };

  const handleBackgroundChange = (image: string) => {
    setBackgroundImage(image);
    // Update the background image in the app container
    const appContainer = document.querySelector('.app');
    if (appContainer) {
      appContainer.setAttribute('style', `font-size: ${fontSize}px; background-image: url(${image})`);
    }
  };

  const handleNewNote = () => {
    setIsNoteEditorOpen(true);
    setIsMenuOpen(false);
  };

  const handleSaveNote = (title: string, tagString: string) => {
    const newTags = tagString.split(',').map(tag => tag.trim()).filter(tag => tag);
    const newNote: Note = {
      title,
      content: noteContent,
      tags: newTags
    };
    
    setNotes(prevNotes => [...prevNotes, newNote]);
    setTags(prevTags => [...new Set([...prevTags, ...newTags])]);
    
    setIsNoteEditorOpen(false);
    setNoteContent('');
  };

  const handleNoteContentChange = (content: string) => {
    setNoteContent(content);
  };

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag);
  };

  const handleBackFromNotes = () => {
    setSelectedTag(null);
  };

  const getNotesForTag = (tag: string) => {
    return notes.filter(note => note.tags.includes(tag));
  };

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
    setNoteContent(note.content);
    setIsNoteEditorOpen(true);
  };

  return (
    <div 
      className="app" 
      style={{ 
        fontSize: `${fontSize}px`,
        backgroundImage: `url(${backgroundImage})`
      }}
    >
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
            <button 
              className="dropdown-item"
              onClick={handleNewNote}
            >
              <HiPlus size={20} />
            </button>
            <button 
              className="dropdown-item"
              onClick={() => {
                setIsSaveModalOpen(true);
                setIsMenuOpen(false);
              }}
            >
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
        {isNoteEditorOpen ? (
          <NoteEditor 
            onClose={() => {
              setIsNoteEditorOpen(false);
              setSelectedNote(null);
              setNoteContent('');
            }} 
            onContentChange={handleNoteContentChange}
            initialContent={selectedNote?.content || ''}
            title={selectedNote?.title || ''}
          />
        ) : selectedTag ? (
          <NotesList 
            tag={selectedTag}
            notes={getNotesForTag(selectedTag)}
            onBack={handleBackFromNotes}
            onNoteClick={handleNoteClick}
          />
        ) : (
          <div className="tags-container">
            {tags.length > 0 ? (
              <ul className="tags-list">
                {tags.map((tag, index) => (
                  <li 
                    key={index} 
                    className="tag-item"
                    onClick={() => handleTagClick(tag)}
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-tags-message">No tags yet. Create a note to get started.</p>
            )}
          </div>
        )}
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
        onBackgroundChange={handleBackgroundChange}
        currentFontSize={fontSize}
        currentBackground={backgroundImage}
      />
      <SaveNoteModal
        open={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onSave={handleSaveNote}
      />
    </div>
  );
}

export default App;
