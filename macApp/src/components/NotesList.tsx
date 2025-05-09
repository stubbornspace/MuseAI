import { IoArrowBack } from 'react-icons/io5';
import type { Note } from '../types';
import './NotesList.css';

interface NotesListProps {
  tag: string;
  notes: Note[];
  onBack: () => void;
  onNoteClick: (note: Note) => void;
}

const NotesList = ({ tag, notes, onBack, onNoteClick }: NotesListProps) => {
  return (
    <div className="notes-list-container">
      <div className="notes-list-header">
        <button className="back-button" onClick={onBack}>
          <IoArrowBack size={20} />
        </button>
        <h2 className="tag-title">{tag}</h2>
      </div>
      <div className="notes-list">
        {notes.length > 0 ? (
          notes.map((note, index) => (
            <div 
              key={index} 
              className="note-item"
              onClick={() => onNoteClick(note)}
            >
              <h3 className="note-title">{note.title}</h3>
            </div>
          ))
        ) : (
          <p className="no-notes-message">No notes with this tag yet.</p>
        )}
      </div>
    </div>
  );
};

export default NotesList; 