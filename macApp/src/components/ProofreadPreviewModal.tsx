import { Dialog, DialogContent, DialogActions, Button, Box } from '@mui/material';
import { IoClose, IoCheckmark } from 'react-icons/io5';
import './ProofreadPreviewModal.css';

interface ProofreadPreviewModalProps {
  open: boolean;
  onClose: () => void;
  onApply: () => void;
  originalText: string;
  improvedText: string;
  mode: 'proofread' | 'shorten';
}

const ProofreadPreviewModal = ({ 
  open, 
  onClose, 
  onApply, 
  originalText, 
  improvedText,
  mode
}: ProofreadPreviewModalProps) => {
  const getTitle = (type: 'original' | 'improved') => {
    if (type === 'original') return 'Original Text';
    return mode === 'proofread' ? 'Improved Text' : 'Condensed Text';
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      className="proofread-preview-dialog"
      maxWidth="md"
      fullWidth
    >
      <DialogContent>
        <Box className="proofread-preview-container">
          <div className="text-column">
            <h3>{getTitle('original')}</h3>
            <div className="text-content">{originalText}</div>
          </div>
          <div className="text-column">
            <h3>{getTitle('improved')}</h3>
            <div className="text-content">{improvedText}</div>
          </div>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button 
          className="preview-button"
          onClick={onClose}
          aria-label="Cancel"
        >
          <IoClose size={20} />
        </Button>
        <Button 
          className="preview-button"
          onClick={onApply}
          aria-label="Apply Changes"
        >
          <IoCheckmark size={20} />
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProofreadPreviewModal; 