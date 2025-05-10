import { useState, useEffect, useRef } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import type { Tag } from '../types';
import './NoteEditor.css';

interface NoteEditorProps {
  onClose: () => void;
  onContentChange: (content: string) => void;
  initialContent?: string;
  title?: string;
  tag?: string;
  availableTags?: Tag[];
  onSendToChatbot?: (text: string) => Promise<string>;
}

const NoteEditor = ({ 
  onClose, 
  onContentChange, 
  initialContent = '', 
  title = '', 
  tag = '',
  availableTags = [],
  onSendToChatbot
}: NoteEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start typing your note...',
      }),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onContentChange(html);
    },
  });

  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    text: string;
  }>({
    visible: false,
    x: 0,
    y: 0,
    text: '',
  });

  const editorRef = useRef<HTMLDivElement>(null);

  // Update editor content when initialContent changes
  useEffect(() => {
    if (editor && initialContent !== editor.getHTML()) {
      editor.commands.setContent(initialContent);
    }
  }, [initialContent, editor]);

  // Handle context menu
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      const selection = window.getSelection();
      const selectedText = selection?.toString().trim();

      if (selectedText && editorRef.current?.contains(e.target as Node)) {
        setContextMenu({
          visible: true,
          x: e.clientX,
          y: e.clientY,
          text: selectedText,
        });
      } else {
        setContextMenu(prev => ({ ...prev, visible: false }));
      }
    };

    const handleClick = () => {
      setContextMenu(prev => ({ ...prev, visible: false }));
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  const handleProofread = async () => {
    if (!onSendToChatbot || !editor) return;

    try {
      const response = await onSendToChatbot(contextMenu.text);
      if (response) {
        // Replace the selected text with the response
        const { from, to } = editor.state.selection;
        editor.commands.deleteRange({ from, to });
        editor.commands.insertContent(response);
      }
    } catch (error) {
      console.error('Error proofreading text:', error);
    }

    setContextMenu(prev => ({ ...prev, visible: false }));
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
      <div className="editor-container" ref={editorRef}>
        <EditorContent editor={editor} className="note-content" />
      </div>
      {contextMenu.visible && (
        <div 
          className="context-menu"
          style={{ 
            position: 'fixed',
            top: contextMenu.y,
            left: contextMenu.x,
          }}
        >
          <button onClick={handleProofread}>
            Proofread with AI
          </button>
        </div>
      )}
    </div>
  );
};

export default NoteEditor; 