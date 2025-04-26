export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ChatRequest {
  userId: string;
  messages: ChatMessage[];
}

export interface ChatResponse {
  message: ChatMessage;
  conversationId: string;
}

export interface DynamoDBItem {
  userId: string;
  timestamp: number;
  conversationId: string;
  messages: ChatMessage[];
}

export interface BedrockRequest {
  modelId: string;
  messages: {
    role: string;
    content: string;
  }[];
  temperature: number;
  maxTokens: number;
} 