import { useState } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import './NoteEditor.css';

interface NoteEditorProps {
  onClose: () => void;
  onContentChange: (content: string) => void;
  initialContent?: string;
  title?: string;
}

const NoteEditor = ({ onClose, onContentChange, initialContent = '', title = '' }: NoteEditorProps) => {
  const [content, setContent] = useState(initialContent);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    onContentChange(newContent);
  };

  return (
    <div className="note-editor">
      {title && (
        <div style={{ 
          position: 'fixed', 
          top: '2rem', 
          left: '0', 
          right: '0', 
          padding: '0 2rem',
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <button 
            style={{ 
              background: 'rgba(40, 40, 40, 0.2)',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.7)',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              cursor: 'pointer',
              padding: '0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s'
            }}
            onClick={onClose}
          >
            <IoArrowBack size={20} />
          </button>
          <h3 style={{ 
            color: 'rgba(255, 255, 255, 0.5)',
            margin: '0',
            fontSize: '1rem',
            fontWeight: 'normal',
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)'
          }}>
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