export interface AIModel {
  id: string
  name: string
  provider: string
  description: string
  maxTokens: number
  color: string
  features: string[]
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  model?: string
  tokens?: {
    input: number
    output: number
  }
}

export interface AIParameters {
  temperature: number
  maxTokens: number
  topP: number
  frequencyPenalty: number
  presencePenalty: number
}

export interface Conversation {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: Date
  updatedAt: Date
  model: string
  parameters: AIParameters
}