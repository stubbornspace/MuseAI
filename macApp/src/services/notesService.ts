import { Note } from '../types';
import { tagsService } from './tagsService';

const BASE_URL = import.meta.env.VITE_API_ENDPOINT || 'https://your-api-url.execute-api.region.amazonaws.com/prod';
const API_KEY = import.meta.env.VITE_API_KEY || '';

const LOCAL_STORAGE_KEYS = {
  NOTES: 'museai_notes',
  LAST_SYNC: 'museai_last_sync',
};

const defaultHeaders = {
  'Content-Type': 'application/json',
  'x-api-key': API_KEY,
};

export const notesService = {
  // Local storage operations
  getLocalNotes: (): Note[] => {
    const notes = localStorage.getItem(LOCAL_STORAGE_KEYS.NOTES);
    return notes ? JSON.parse(notes) : [];
  },

  saveLocalNote: (note: Note): void => {
    const notes = notesService.getLocalNotes();
    const existingNoteIndex = notes.findIndex(n => n.id === note.id);
    
    if (existingNoteIndex >= 0) {
      // Decrement counts for old tags
      notes[existingNoteIndex].tagIds.forEach(tagId => {
        tagsService.decrementTagCount(tagId);
      });
      notes[existingNoteIndex] = note;
    } else {
      notes.push(note);
    }
    
    // Increment counts for new tags
    note.tagIds.forEach(tagId => {
      tagsService.incrementTagCount(tagId);
    });
    
    localStorage.setItem(LOCAL_STORAGE_KEYS.NOTES, JSON.stringify(notes));
  },

  deleteLocalNote: (noteId: string): void => {
    const notes = notesService.getLocalNotes();
    const noteToDelete = notes.find(n => n.id === noteId);
    if (noteToDelete) {
      // Decrement counts for all tags in the deleted note
      noteToDelete.tagIds.forEach(tagId => {
        tagsService.decrementTagCount(tagId);
      });
    }
    const updatedNotes = notes.filter(note => note.id !== noteId);
    localStorage.setItem(LOCAL_STORAGE_KEYS.NOTES, JSON.stringify(updatedNotes));
  },

  // API operations
  async saveNote(note: Note): Promise<Note> {
    try {
      const response = await fetch(`${BASE_URL}/notes`, {
        method: 'POST',
        headers: defaultHeaders,
        body: JSON.stringify({
          action: 'saveNote',
          note,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save note');
      }

      const savedNote = await response.json();
      notesService.saveLocalNote(savedNote);
      return savedNote;
    } catch (error) {
      console.error('Error saving note:', error);
      // Save locally even if API call fails
      notesService.saveLocalNote(note);
      return note;
    }
  },

  async deleteNote(noteId: string): Promise<boolean> {
    const confirmed = window.confirm('Are you sure you want to delete this note? This action cannot be undone.');
    if (!confirmed) {
      return false;
    }

    try {
      const response = await fetch(`${BASE_URL}/notes`, {
        method: 'DELETE',
        headers: defaultHeaders,
        body: JSON.stringify({ id: noteId }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete note');
      }

      notesService.deleteLocalNote(noteId);
      return true;
    } catch (error) {
      console.error('Error deleting note:', error);
      // Delete locally even if API call fails
      notesService.deleteLocalNote(noteId);
      return true;
    }
  },

  async getNotes(): Promise<Note[]> {
    try {
      const response = await fetch(`${BASE_URL}/notes`, {
        method: 'GET',
        headers: defaultHeaders,
      });

      if (!response.ok) {
        throw new Error('Failed to get notes');
      }

      const notes = await response.json();
      notes.forEach((note: Note) => {
        notesService.saveLocalNote(note);
      });
      return notes;
    } catch (error) {
      console.error('Error getting notes:', error);
      // Return local notes if API call fails
      return notesService.getLocalNotes();
    }
  },

  async syncNotes(): Promise<void> {
    try {
      const lastSync = localStorage.getItem(LOCAL_STORAGE_KEYS.LAST_SYNC) || '0';
      
      const response = await fetch(`${BASE_URL}/notes`, {
        method: 'POST',
        headers: defaultHeaders,
        body: JSON.stringify({
          action: 'syncNotes',
          note: { lastSync: parseInt(lastSync) },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to sync notes');
      }

      const { notes, syncTimestamp } = await response.json();
      
      // Update local storage with synced notes
      notes.forEach((note: Note) => {
        notesService.saveLocalNote(note);
      });

      // Update last sync timestamp
      localStorage.setItem(LOCAL_STORAGE_KEYS.LAST_SYNC, syncTimestamp.toString());
    } catch (error) {
      console.error('Error syncing notes:', error);
      // Continue with local notes if sync fails
    }
  },
}; 