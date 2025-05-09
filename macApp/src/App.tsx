import { useState, useEffect } from "react";
import { HiChat, HiPlus, HiCog, HiTrash, HiHome } from "react-icons/hi";
import { MdOutlineSaveAs } from "react-icons/md";
import "./App.css";
import Chatbot from "./components/Chatbot";
import MusicPlayer from "./components/MusicPlayer";
import SettingsModal from "./components/SettingsModal";
import NoteEditor from "./components/NoteEditor";
import SaveNoteModal from "./components/SaveNoteModal";
import NotesList from "./components/NotesList";
import { notesService } from "./services/notesService";
import { tagsService } from "./services/tagsService";
import type { Note, Tag } from "./types";

function App() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNoteEditorOpen, setIsNoteEditorOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [backgroundImage, setBackgroundImage] = useState('wave.png');
  const [noteContent, setNoteContent] = useState('');
  const [tags, setTags] = useState<Tag[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  // Load notes and tags from local storage and sync with API on startup
  useEffect(() => {
    const loadData = async () => {
      // First load from local storage
      const localNotes = notesService.getLocalNotes();
      const localTags = tagsService.getLocalTags();
      setNotes(localNotes);
      setTags(localTags);
      
      // Then sync with API
      await notesService.syncNotes();
      
      // Update state with synced data
      const syncedNotes = notesService.getLocalNotes();
      const syncedTags = tagsService.getLocalTags();
      setNotes(syncedNotes);
      setTags(syncedTags);
    };
    
    loadData();
  }, []);

  const handleFontSizeChange = (newSize: number) => {
    setFontSize(newSize);
    document.documentElement.style.fontSize = `${newSize}px`;
  };

  const handleBackgroundChange = (image: string) => {
    setBackgroundImage(image);
    const appContainer = document.querySelector('.app');
    if (appContainer) {
      appContainer.setAttribute('style', `font-size: ${fontSize}px; background-image: url(${image})`);
    }
  };

  const handleNewNote = () => {
    setIsNoteEditorOpen(true);
  };

  const handleSaveNote = async (title: string, tagString: string) => {
    const tagNames = tagString.split(',')
      .map(tag => tag.trim())
      .filter(tag => tag && tag.length > 0);
    
    // Get or create tags and their IDs
    const tagIds = tagNames.map(name => tagsService.getOrCreateTag(name).id);
    
    if (selectedNote) {
      // Get old tag IDs for comparison
      const oldTagIds = selectedNote.tagIds || [];
      
      // Update existing note
      const updatedNote = {
        ...selectedNote,
        title,
        tagIds,
        updatedAt: Date.now()
      };
      
      // Update tag counts
      // Decrement counts for removed tags
      oldTagIds.forEach(tagId => {
        if (!tagIds.includes(tagId)) {
          tagsService.decrementTagCount(tagId);
        }
      });
      
      // Increment counts for new tags
      tagIds.forEach(tagId => {
        if (!oldTagIds.includes(tagId)) {
          tagsService.incrementTagCount(tagId);
        }
      });
      
      await notesService.saveNote(updatedNote);
      setNotes(prevNotes => 
        prevNotes.map(note => 
          note === selectedNote ? updatedNote : note
        )
      );
    } else {
      // Create new note
      const newNote: Note = {
        id: Date.now().toString(),
        title,
        content: noteContent,
        tagIds,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      
      // Increment counts for all tags
      tagIds.forEach(tagId => {
        tagsService.incrementTagCount(tagId);
      });
      
      const savedNote = await notesService.saveNote(newNote);
      setNotes(prevNotes => [...prevNotes, savedNote]);
    }
    
    // Update tags list
    setTags(tagsService.getLocalTags());
    
    setIsNoteEditorOpen(false);
    setNoteContent('');
    setSelectedNote(null);
  };

  const handleNoteContentChange = (content: string) => {
    setNoteContent(content);
  };

  const handleTagClick = (tag: Tag) => {
    setSelectedTag(tag);
  };

  const handleBackFromNotes = () => {
    setSelectedTag(null);
  };

  const getNotesForTag = (tag: Tag) => {
    const notesUnderTag = notes.filter(note => {
      // Handle old notes that still use 'tag' instead of 'tagIds'
      if (!note.tagIds) {
        note.tagIds = note.tag ? [note.tag] : [];
        // Remove the old tag property
        delete note.tag;
      }
      return note.tagIds.includes(tag.id);
    });
    return notesUnderTag;
  };

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
    setNoteContent(note.content);
    setIsNoteEditorOpen(true);
  };

  const handleDeleteNote = async () => {
    if (selectedNote) {
      const success = await notesService.deleteNote(selectedNote.id);
      if (success) {
        setNotes(prevNotes => prevNotes.filter(note => note !== selectedNote));
        // Update tags list
        setTags(tagsService.getLocalTags());
        // Navigate back to home
        handleHome();
      }
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
      </div>
      {!isChatbotOpen && (
        <button 
          className="menu-item chatbot-button"
          onClick={() => setIsChatbotOpen(!isChatbotOpen)}
          aria-label="Chat"
        >
          <HiChat size={20} />
        </button>
      )}
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
            tag={selectedNote?.tagIds?.[0] ? tags.find(t => t.id === selectedNote.tagIds[0])?.name || '' : ''}
            availableTags={tags}
          />
        ) : selectedTag ? (
          <NotesList 
            tag={selectedTag.name}
            notes={getNotesForTag(selectedTag)}
            onBack={handleBackFromNotes}
            onNoteClick={handleNoteClick}
          />
        ) : (
          <div className="tags-container">
            {tags.length > 0 ? (
              <ul className="tags-list">
                {tags.map((tag) => (
                  <li 
                    key={tag.id} 
                    className="tag-item"
                    onClick={() => handleTagClick(tag)}
                  >
                    {tag.name}
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
        initialTags={selectedTag?.name || ''}
        existingTags={tags.map(tag => tag.name)}
      />
    </div>
  );
}

export default App;
