import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogActions, Button, TextField, Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { IoClose, IoCheckmark } from 'react-icons/io5';
import './SaveNoteModal.css';

interface SaveNoteModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (title: string, tags: string) => void;
  initialTitle?: string;
  initialTags?: string;
  existingTags: string[];
}

const SaveNoteModal = ({ open, onClose, onSave, initialTitle = '', initialTags = '', existingTags }: SaveNoteModalProps) => {
  const [title, setTitle] = useState(initialTitle);
  const [selectedTag, setSelectedTag] = useState(initialTags);
  const [isNewTag, setIsNewTag] = useState(false);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (open) {
      setTitle(initialTitle);
      setSelectedTag(initialTags);
      setIsNewTag(false);
      setNewTag('');
    }
  }, [open, initialTitle, initialTags]);

  const handleSave = () => {
    const finalTags = isNewTag ? newTag : selectedTag;
    onSave(title, finalTags);
    setTitle('');
    setSelectedTag('');
    setNewTag('');
    setIsNewTag(false);
    onClose();
  };

  const handleTagChange = (event: any) => {
    const value = event.target.value;
    if (value === 'new') {
      setIsNewTag(true);
      setSelectedTag('');
    } else {
      setIsNewTag(false);
      setSelectedTag(value);
    }
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
          <FormControl fullWidth className="save-note-field">
            <InputLabel>Tag</InputLabel>
            <Select
              value={isNewTag ? 'new' : selectedTag}
              onChange={handleTagChange}
              label="Tag"
            >
              {existingTags.map((tag) => (
                <MenuItem key={tag} value={tag}>
                  {tag}
                </MenuItem>
              ))}
              <MenuItem value="new">+ Create New Tag</MenuItem>
            </Select>
          </FormControl>
          {isNewTag && (
            <TextField
              fullWidth
              label="New Tag"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="save-note-field"
              placeholder="Enter new tag name"
            />
          )}
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
          disabled={!title.trim() || (isNewTag && !newTag.trim())}
        >
          <IoCheckmark size={20} />
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SaveNoteModal; 