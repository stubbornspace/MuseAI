export interface Note {
  id: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export interface Message {
  text: string;
  isUser: boolean;
}

export interface Settings {
  fontSize: number;
  backgroundImage: string;
} 