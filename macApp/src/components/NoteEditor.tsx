import { useState } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import type { Tag } from '../types';
import './NoteEditor.css';

interface NoteEditorProps {
  onClose: () => void;
  onContentChange: (content: string) => void;
  initialContent?: string;
  title?: string;
  tag?: string;
  availableTags?: Tag[];
}

const NoteEditor = ({ 
  onClose, 
  onContentChange, 
  initialContent = '', 
  title = '', 
  tag = '',
  availableTags = []
}: NoteEditorProps) => {
  const [content, setContent] = useState(initialContent);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    onContentChange(newContent);
  };

  // Find the tag name from the tag ID
  const getTagName = (tagId: string) => {
    const tag = availableTags.find(t => t.id === tagId);
    return tag ? tag.name : '';
  };

  return (
    <div className="note-editor">
      {(title || tag) && (
        <div className="title-container">
          <button 
            className="back-button"
            onClick={onClose}
          >
            <IoArrowBack size={20} />
          </button>
          <h3 className="note-title">
            {tag && <span className="note-tag">{tag}</span>}
            {tag && title && <span className="title-separator"> / </span>}
            {title}
          </h3>
        </div>
      )}
      <textarea
        className="note-content"
        value={content}
        onChange={handleContentChange}
        placeholder="Start typing your note..."
        autoFocus
      />
    </div>
  );
};

export default NoteEditor; 