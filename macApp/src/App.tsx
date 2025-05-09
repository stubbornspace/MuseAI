import { useState } from "react";
import { HiChat, HiPlus, HiCog, HiTrash, HiHome } from "react-icons/hi";
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
  };

  const handleSaveNote = (title: string, tagString: string) => {
    const newTags = tagString.split(',').map(tag => tag.trim()).filter(tag => tag);
    
    if (selectedNote) {
      // Get the old tags before updating
      const oldTags = selectedNote.tags;
      
      // Update existing note
      const updatedNote = {
        ...selectedNote,
        title,
        tags: newTags
      };
      setNotes(prevNotes => 
        prevNotes.map(note => 
          note === selectedNote ? updatedNote : note
        )
      );

      // Check if any old tags are no longer used
      setTags(prevTags => {
        const updatedTags = [...prevTags];
        oldTags.forEach(oldTag => {
          // Check if this tag is still used by any note
          const isTagStillUsed = notes.some(note => 
            note !== selectedNote && note.tags.includes(oldTag)
          );
          if (!isTagStillUsed) {
            // Remove the tag if it's not used by any other note
            const index = updatedTags.indexOf(oldTag);
            if (index > -1) {
              updatedTags.splice(index, 1);
            }
          }
        });
        // Add any new tags
        newTags.forEach(tag => {
          if (!updatedTags.includes(tag)) {
            updatedTags.push(tag);
          }
        });
        return updatedTags;
      });
    } else {
      // Create new note
      const newNote: Note = {
        title,
        content: noteContent,
        tags: newTags
      };
      setNotes(prevNotes => [...prevNotes, newNote]);
      
      // Add new tags
      setTags(prevTags => [...new Set([...prevTags, ...newTags])]);
    }
    
    setIsNoteEditorOpen(false);
    setNoteContent('');
    setSelectedNote(null);
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

  const handleDeleteNote = () => {
    if (selectedNote) {
      setNotes(prevNotes => prevNotes.filter(note => note !== selectedNote));
      setSelectedNote(null);
      setNoteContent('');
      setIsNoteEditorOpen(false);
    }
  };

  const handleHome = () => {
    setIsNoteEditorOpen(false);
    setSelectedNote(null);
    setNoteContent('');
    setSelectedTag(null);
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
          className="menu-item"
          onClick={handleHome}
          title="Home"
        >
          <HiHome size={20} />
        </button>
        {isNoteEditorOpen ? (
          <>
            <button 
              className="menu-item"
              onClick={() => {
                setIsSaveModalOpen(true);
              }}
            >
              <MdOutlineSaveAs size={20} />
            </button>
            <button 
              className="menu-item"
              onClick={handleDeleteNote}
            >
              <HiTrash size={20} />
            </button>
            <button 
              className="menu-item"
              onClick={() => {
                setIsSettingsOpen(true);
              }}
            >
              <HiCog size={20} />
            </button>
          </>
        ) : (
          <>
            <button 
              className="menu-item"
              onClick={handleNewNote}
            >
              <HiPlus size={20} />
            </button>
            <button 
              className="menu-item"
              onClick={() => {
                setIsSettingsOpen(true);
              }}
            >
              <HiCog size={20} />
            </button>
          </>
        )}
        <MusicPlayer />
        {!isChatbotOpen && (
          <button 
            className="menu-item"
            onClick={() => setIsChatbotOpen(!isChatbotOpen)}
            aria-label="Chat"
          >
            <HiChat size={20} />
          </button>
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
            tag={selectedTag || ''}
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
      <Chatbot 
        isOpen={isChatbotOpen} 
        onClose={() => setIsChatbotOpen(false)} 
      />
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
        initialTitle={selectedNote?.title || ''}
        initialTags={selectedTag || ''}
      />
    </div>
  );
}

export default App;
