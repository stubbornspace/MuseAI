import { useState } from 'react';
import { Dialog, DialogContent, DialogActions, Button, TextField, Box } from '@mui/material';
import { IoClose, IoCheckmark } from 'react-icons/io5';
import './SaveNoteModal.css';

interface SaveNoteModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (title: string, tags: string) => void;
}

const SaveNoteModal = ({ open, onClose, onSave }: SaveNoteModalProps) => {
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');

  const handleSave = () => {
    onSave(title, tags);
    setTitle('');
    setTags('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} className="save-note-dialog">
      <DialogContent>
        <Box className="save-note-form">
          <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="save-note-field"
            autoFocus
          />
          <TextField
            fullWidth
            label="Tags (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="save-note-field"
            placeholder="e.g. work, ideas, personal"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button 
          className="save-note-button"
          onClick={onClose}
          aria-label="Cancel"
        >
          <IoClose size={20} />
        </Button>
        <Button 
          className="save-note-button"
          onClick={handleSave}
          aria-label="Save"
          disabled={!title.trim()}
        >
          <IoCheckmark size={20} />
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SaveNoteModal; 