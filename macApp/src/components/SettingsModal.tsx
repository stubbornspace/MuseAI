import { useState } from 'react';
import { Dialog, DialogContent, DialogActions, Button, Slider, Typography, Box } from '@mui/material';
import { IoClose, IoCheckmark } from 'react-icons/io5';
import './SettingsModal.css';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  onFontSizeChange: (size: number) => void;
  onBackgroundChange: (image: string) => void;
  currentFontSize: number;
  currentBackground: string;
}

const backgroundOptions = [
  { value: 'wave.png', label: 'Wave', thumbnail: 'wave.png' },
  { value: 'nyc.png', label: 'New York City', thumbnail: 'nyc.png' },
  { value: 'ocean.png', label: 'Ocean', thumbnail: 'ocean.png' },
  { value: 'galaxy.png', label: 'Galaxy', thumbnail: 'galaxy.png' }
];

const SettingsModal = ({ 
  open, 
  onClose, 
  onFontSizeChange, 
  onBackgroundChange,
  currentFontSize,
  currentBackground 
}: SettingsModalProps) => {
  const [fontSize, setFontSize] = useState(currentFontSize);
  const [background, setBackground] = useState(currentBackground);

  const handleFontSizeChange = (event: Event, newValue: number | number[]) => {
    setFontSize(newValue as number);
  };

  const handleBackgroundChange = (image: string) => {
    setBackground(image);
  };

  const handleSave = () => {
    onFontSizeChange(fontSize);
    onBackgroundChange(background);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} className="settings-dialog">
      <DialogContent>
        <Box className="settings-section">

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
        </Box>

        <Box className="settings-section">
        <Typography 
              className="font-size-text" 
              sx={{ fontSize: `${fontSize}px` }}
            >
              Background
            </Typography>
          <Box className="background-thumbnails">
            {backgroundOptions.map((option) => (
              <button
                key={option.value}
                className={`background-thumbnail ${background === option.value ? 'selected' : ''}`}
                onClick={() => handleBackgroundChange(option.value)}
                style={{
                  backgroundImage: `url(${option.thumbnail})`
                }}
                title={option.label}
              />
            ))}
          </Box>
        </Box>
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