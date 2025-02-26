export interface ChatRequestType {
  model?: string
  stream?: boolean
  messages: {
    role: string
    content: string
  }[]
}

export interface ChatResponseType {
  code: number
  message: string
}
