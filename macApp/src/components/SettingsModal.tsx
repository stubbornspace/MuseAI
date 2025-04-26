import { useState } from 'react';
import { Dialog, DialogContent, DialogActions, Button, Slider, Typography, Box } from '@mui/material';
import { IoClose, IoCheckmark } from 'react-icons/io5';
import './SettingsModal.css';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  onFontSizeChange: (size: number) => void;
  currentFontSize: number;
}

const SettingsModal = ({ open, onClose, onFontSizeChange, currentFontSize }: SettingsModalProps) => {
  const [fontSize, setFontSize] = useState(currentFontSize);

  const handleFontSizeChange = (event: Event, newValue: number | number[]) => {
    setFontSize(newValue as number);
  };

  const handleSave = () => {
    onFontSizeChange(fontSize);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} className="settings-dialog">
      <DialogContent>
        <Box className="font-size-display">
          <Typography 
            className="font-size-text" 
            sx={{ fontSize: `${fontSize}px` }}
          >
            Font Size
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <span 
              className="size-number" 
              style={{ fontSize: `${fontSize}px` }}
            >
              {fontSize}
            </span>
            <span className="size-unit">px</span>
          </Box>
        </Box>
        <Slider
          className="settings-slider"
          value={fontSize}
          onChange={handleFontSizeChange}
          aria-labelledby="font-size-slider"
          min={12}
          max={24}
          step={1}
        />
      </DialogContent>
      <DialogActions>
        <Button 
          className="settings-button"
          onClick={onClose}
          aria-label="Cancel"
        >
          <IoClose size={20} />
        </Button>
        <Button 
          className="settings-button"
          onClick={handleSave}
          aria-label="Save"
        >
          <IoCheckmark size={20} />
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SettingsModal; 