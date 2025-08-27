import { AIModel, AIParameters } from '@/types'

export const AI_MODELS: AIModel[] = [
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    description: 'Most capable GPT model with vision and reasoning',
    maxTokens: 128000,
    color: 'green',
    features: ['Text', 'Vision', 'Code', 'Function Calling']
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    description: 'Superior reasoning and analysis capabilities',
    maxTokens: 200000,
    color: 'orange',
    features: ['Text', 'Vision', 'Analysis', 'Safety']
  },
  {
    id: 'gemini-1-5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'Google',
    description: 'Multimodal model with Google Search integration',
    maxTokens: 128000,
    color: 'blue',
    features: ['Text', 'Vision', 'Audio', 'Search']
  },
  {
    id: 'copilot-gpt-4',
    name: 'Copilot',
    provider: 'Microsoft',
    description: 'GPT-4 with Bing Search and Office integration',
    maxTokens: 64000,
    color: 'purple',
    features: ['Text', 'Search', 'Office', 'Code']
  },
  {
    id: 'perplexity-sonar',
    name: 'Perplexity AI',
    provider: 'Perplexity',
    description: 'Research-focused with real-time citations',
    maxTokens: 32000,
    color: 'teal',
    features: ['Research', 'Citations', 'Web Search']
  },
  {
    id: 'llama-3-70b',
    name: 'Llama 3 70B',
    provider: 'Meta',
    description: 'Open-source model with strong performance',
    maxTokens: 8192,
    color: 'indigo',
    features: ['Text', 'Code', 'Open Source']
  }
]

export const DEFAULT_PARAMETERS: AIParameters = {
  temperature: 0.7,
  maxTokens: 2048,
  topP: 1.0,
  frequencyPenalty: 0,
  presencePenalty: 0
}