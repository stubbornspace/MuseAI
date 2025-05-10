import { useState, useEffect, useRef } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import type { Tag } from '../types';
import ProofreadPreviewModal from './ProofreadPreviewModal';
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

  const [previewModal, setPreviewModal] = useState<{
    open: boolean;
    originalText: string;
    improvedText: string;
    mode: 'proofread' | 'shorten';
  }>({
    open: false,
    originalText: '',
    improvedText: '',
    mode: 'proofread',
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

  const handleTextProcessing = async (mode: 'proofread' | 'shorten') => {
    if (!onSendToChatbot || !editor) return;

    try {
      const prompt = mode === 'proofread' 
        ? `Please proofread and improve the following text. Return only the improved text without any explanations: ${contextMenu.text}`
        : `Please condense the following text while keeping all main points. Return only the condensed text without any explanations: ${contextMenu.text}`;

      const response = await onSendToChatbot(prompt);
      if (response) {
        setPreviewModal({
          open: true,
          originalText: contextMenu.text,
          improvedText: response,
          mode,
        });
      }
    } catch (error) {
      console.error(`Error ${mode}ing text:`, error);
    }

    setContextMenu(prev => ({ ...prev, visible: false }));
  };

  const handleApplyChanges = () => {
    if (!editor) return;

    const { from, to } = editor.state.selection;
    editor.commands.deleteRange({ from, to });
    editor.commands.insertContent(previewModal.improvedText);
    setPreviewModal(prev => ({ ...prev, open: false }));
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
          <button onClick={() => handleTextProcessing('proofread')}>
            Proofread
          </button>
          <button onClick={() => handleTextProcessing('shorten')}>
            Shorten
          </button>
        </div>
      )}
      <ProofreadPreviewModal
        open={previewModal.open}
        onClose={() => setPreviewModal(prev => ({ ...prev, open: false }))}
        onApply={handleApplyChanges}
        originalText={previewModal.originalText}
        improvedText={previewModal.improvedText}
        mode={previewModal.mode}
      />
    </div>
  );
};

export default NoteEditor; 