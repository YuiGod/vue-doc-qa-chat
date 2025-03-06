export interface ChatRequestType {
  model?: string
  stream?: boolean
  messages: {
    role: string
    content: string
  }
}

export interface ChatResponseType {
  code: number
  message: string
}

export interface ChatHistoryResponseType {
  id: string
  role: string
  content: string
  think: string
  chat_session_id: string
  date: string
}
