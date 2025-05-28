export interface ChatMessage {
  text: string;
  sender: 'user' | 'bot';
}

export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  response: string;
  error?: string;
}