export interface Note {
  id: string;
  title: string;
  content: string;
  tag?: string; // For backward compatibility
  tagIds: string[];
  createdAt: number;
  updatedAt: number;
}

export interface Tag {
  id: string;
  name: string;
  noteCount: number;
}

export interface Message {
  text: string;
  isUser: boolean;
}

export interface Settings {
  fontSize: number;
  backgroundImage: string;
} 