'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Send, Copy, ThumbsUp, ThumbsDown, Menu, Sun, Moon, Bot, User, Plus, MessageCircle } from 'lucide-react'
import { AI_MODELS, DEFAULT_PARAMETERS } from '@/lib/constants'
import { AIModel, ChatMessage, AIParameters, Conversation } from '@/types'
import { cn } from '@/lib/utils'

export default function ChatInterface() {
  const [mounted, setMounted] = useState(false)
  const [selectedModel, setSelectedModel] = useState('gpt-4o')
  const [parameters, setParameters] = useState<AIParameters>(DEFAULT_PARAMETERS)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      title: 'React Component Help',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      model: 'gpt-4o',
      parameters: DEFAULT_PARAMETERS,
    },
  ])
  const [currentConversationId, setCurrentConversationId] = useState<string>('1')

  const currentModel = AI_MODELS.find((model) => model.id === selectedModel) || AI_MODELS[0]
  const currentConversation = conversations.find((conv) => conv.id === currentConversationId)

  const getModelTheme = (modelId: string) => {
    const themes = {
      'gpt-4o': { bg: 'bg-emerald-50 dark:bg-emerald-950', accent: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800' },
      'claude-3-5-sonnet': { bg: 'bg-orange-50 dark:bg-orange-950', accent: 'text-orange-600 dark:text-orange-400', border: 'border-orange-200 dark:border-orange-800' },
      'gemini-1-5-pro': { bg: 'bg-blue-50 dark:bg-blue-950', accent: 'text-blue-600 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800' },
      'copilot-gpt-4': { bg: 'bg-purple-50 dark:bg-purple-950', accent: 'text-purple-600 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-800' },
      'perplexity-sonar': { bg: 'bg-teal-50 dark:bg-teal-950', accent: 'text-teal-600 dark:text-teal-400', border: 'border-teal-200 dark:border-teal-800' },
      'llama-3-70b': { bg: 'bg-indigo-50 dark:bg-indigo-950', accent: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-200 dark:border-indigo-800' },
    }
    return themes[modelId as keyof typeof themes] || themes['gpt-4o']
  }

  const modelTheme = getModelTheme(selectedModel)

  useEffect(() => {
    setMounted(true)

    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme')
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches

      const shouldBeDark = savedTheme === 'dark' || (!savedTheme && systemDark)
      setDarkMode(shouldBeDark)

      if (shouldBeDark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }

      const saved = localStorage.getItem('ai-conversations')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          setConversations(
            parsed.map((conv: any) => ({
              ...conv,
              createdAt: new Date(conv.createdAt),
              updatedAt: new Date(conv.updatedAt),
              messages: conv.messages.map((msg: any) => ({
                ...msg,
                timestamp: new Date(msg.timestamp),
              })),
            }))
          )
        } catch (error) {
          console.error('Error loading conversations:', error)
        }
      }
    }
  }, [])

  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return

    if (darkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [darkMode, mounted])

  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      localStorage.setItem('ai-conversations', JSON.stringify(conversations))
    }
  }, [conversations, mounted])

  useEffect(() => {
    const conversation = conversations.find((conv) => conv.id === currentConversationId)
    if (conversation) {
      setMessages(conversation.messages)
      setSelectedModel(conversation.model)
      setParameters(conversation.parameters)
    }
  }, [currentConversationId, conversations])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'n') {
        e.preventDefault()
        handleNewChat()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const generateChatTitle = (firstMessage: string): string => {
    const words = firstMessage.split(' ').slice(0, 6).join(' ')
    return words.length > 30 ? words.substring(0, 30) + '...' : words
  }

  const handleNewChat = () => {
    const newId = Date.now().toString()
    const newConversation: Conversation = {
      id: newId,
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      model: selectedModel,
      parameters: parameters,
    }

    setConversations((prev) => [newConversation, ...prev])
    setCurrentConversationId(newId)
    setMessages([])
    setInput('')
    setIsLoading(false)

    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setSidebarOpen(false)
    }
  }

  const handleRemoveChat = (conversationId: string) => {
    setConversations((prev) => prev.filter((conv) => conv.id !== conversationId))

    if (currentConversationId === conversationId) {
      if (conversations.length > 1) {
        const newConv = conversations.find((conv) => conv.id !== conversationId)
        if (newConv) setCurrentConversationId(newConv.id)
      } else {
        handleNewChat()
      }
    }
  }

  const updateCurrentConversation = (updates: Partial<Conversation>) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === currentConversationId ? { ...conv, ...updates, updatedAt: new Date() } : conv
      )
    )
  }

  const switchConversation = (conversationId: string) => {
    setCurrentConversationId(conversationId)
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setSidebarOpen(false)
    }
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }

    const newMessages = [...messages, userMessage]
    setMessages(newMessages)

    if (messages.length === 0) {
      const title = generateChatTitle(input.trim())
      updateCurrentConversation({
        title,
        messages: newMessages,
        model: selectedModel,
        parameters: parameters,
      })
    } else {
      updateCurrentConversation({
        messages: newMessages,
        model: selectedModel,
        parameters: parameters,
      })
    }

    setInput('')
    setIsLoading(true)

    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateMockResponse(userMessage.content, selectedModel),
        timestamp: new Date(),
        model: currentModel.name,
        tokens: {
          input: Math.ceil(userMessage.content.length / 4),
          output: 120,
        },
      }

      const finalMessages = [...newMessages, aiResponse]
      setMessages(finalMessages)
      updateCurrentConversation({ messages: finalMessages })
      setIsLoading(false)
    }, 1500)
  }

  const generateMockResponse = (prompt: string, modelId: string): string => {
    const responses = {
      'gpt-4o': `I'm GPT-4o from OpenAI. Regarding "${prompt}", I can provide comprehensive assistance with analysis, creative tasks, and problem-solving.

**Key capabilities:**
- Advanced reasoning and analysis
- Code generation and debugging  
- Creative writing and ideation
- Complex problem solving

How can I help you explore this topic further?`,

      'claude-3-5-sonnet': `Hello! I'm Claude 3.5 Sonnet from Anthropic. About "${prompt}" - I aim to provide thoughtful, nuanced responses while prioritizing safety and accuracy.

**My approach:**
- Thorough analysis with multiple perspectives
- Safety-first reasoning
- Honest acknowledgment of limitations
- Helpful and harmless responses

What specific aspect would you like me to focus on?`,

      'gemini-1-5-pro': `Hi! I'm Gemini 1.5 Pro from Google. For "${prompt}", I can leverage my multimodal capabilities and real-time information access.

**What I offer:**
- Google Search integration
- Multimodal analysis (text, images, audio)
- Large context window processing
- Workspace integration

Would you like me to search for current information on this topic?`,

      'copilot-gpt-4': `I'm Microsoft Copilot powered by GPT-4. Regarding "${prompt}", I can assist with:

**Available tools:**
- Bing Search for latest information
- Office 365 integration
- Code assistance and debugging
- DALL-E 3 image generation

How would you like to proceed with this query?`,

      'perplexity-sonar': `I'm Perplexity AI. I'll research "${prompt}" using real-time web search with verified citations.

**Research methodology:**
- Real-time web search
- Source verification and citations
- Fact-checking and validation
- Academic and reliable sources

Let me search for the most current information on this topic.`,

      'llama-3-70b': `I'm Llama 3 70B from Meta. For "${prompt}", I can provide assistance as an open-source language model.

**Open-source benefits:**
- Transparent model architecture
- Community-driven development
- Customizable for specific needs
- No vendor lock-in

How can I help you with this topic?`,
    }

    return responses[modelId as keyof typeof responses] || responses['gpt-4o']
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading AI Interface...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('flex h-screen bg-background', modelTheme.bg)}>
      {/* Sidebar */}
      <div
        className={cn(
          'w-80 bg-card border-r flex flex-col transition-transform duration-300 ease-in-out',
          'lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          'fixed lg:relative z-40 h-full'
        )}
      >
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Conversations</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNewChat}
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>New Chat</span>
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {conversations.map((conv) => (
            <Card
              key={conv.id}
              className={cn(
                'p-3 cursor-pointer transition-colors hover:bg-muted/50 flex justify-between items-center',
                currentConversationId === conv.id ? 'bg-muted border-primary' : ''
              )}
              onClick={() => switchConversation(conv.id)}
            >
              <div className="flex items-start space-x-2">
                <MessageCircle className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate" title={conv.title}>
                    {conv.title}
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center justify-between">
                    <span>{conv.messages.length} messages</span>
                    <span>{conv.model.split('-')[0].toUpperCase()}</span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemoveChat(conv.id)
                }}
                aria-label={`Delete conversation ${conv.title}`}
                className="transition-colors hover:text-destructive"
              >
                ✕
              </Button>
            </Card>
          ))}
        </div>

        <div className="p-4 border-t">
          <div className="text-xs text-muted-foreground text-center"></div>
        </div>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col" style={{ minHeight: 0 }}>
        <header
          className={cn(
            'h-16 border-b bg-card/95 backdrop-blur flex items-center justify-between px-4',
            modelTheme.border
          )}
        >
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            <div className={cn('text-lg font-semibold', modelTheme.accent)}>AI Assistant</div>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className={cn(
                'px-3 py-2 border rounded-md bg-background text-sm font-medium min-w-[200px] focus:outline-none focus:ring-2 focus:ring-ring',
                modelTheme.border
              )}
            >
              {AI_MODELS.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name} - {model.provider}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <div className="text-xs text-muted-foreground hidden md:block">
              {darkMode ? 'Dark' : 'Light'} Mode
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="transition-colors hover:text-primary"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ minHeight: 0 }}>
          {messages.length === 0 ? (
            <div className={cn('flex flex-col items-center justify-center h-full text-center')}>
              <div className="flex flex-col gap-2 text-sm mb-4">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      'w-2 h-2 rounded-full',
                      currentModel.color === 'green'
                        ? 'bg-green-500'
                        : currentModel.color === 'orange'
                        ? 'bg-orange-500'
                        : currentModel.color === 'blue'
                        ? 'bg-blue-500'
                        : currentModel.color === 'purple'
                        ? 'bg-purple-500'
                        : currentModel.color === 'teal'
                        ? 'bg-teal-500'
                        : 'bg-indigo-500'
                    )}
                  />
                  <span>Currently: {currentModel.name}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span>{currentModel.maxTokens.toLocaleString()} max tokens</span>
                </div>
              </div>
              <div className={cn('p-4 rounded-full mb-4', modelTheme.bg)}>
                <Bot className={cn('h-12 w-12', modelTheme.accent)} />
              </div>
              <h3 className="text-lg font-medium mb-2">Welcome to AI Assistant</h3>
              <p className="text-muted-foreground max-w-md mb-6">
                Start a conversation with {currentModel.name}. Your chat will be automatically
                saved with a meaningful title.
              </p>
              <Button variant="outline" onClick={handleNewChat} className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Start New Chat</span>
              </Button>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex space-x-3 max-w-4xl',
                  message.role === 'user' ? 'ml-auto flex-row-reverse space-x-reverse' : 'mr-auto'
                )}
              >
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                    message.role === 'user'
                      ? 'bg-primary/10'
                      : cn(modelTheme.bg, modelTheme.border, 'border')
                  )}
                >
                  {message.role === 'user' ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className={cn('w-4 h-4', modelTheme.accent)} />
                  )}
                </div>

                <Card
                  className={cn(
                    'flex-1 p-4',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : cn('bg-card', modelTheme.border, 'border')
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2 text-xs opacity-70">
                      <span className="font-medium">
                        {message.role === 'user' ? 'You' : message.model || currentModel.name}
                      </span>
                      <span>{formatTimestamp(message.timestamp)}</span>
                      {message.tokens && <span>{message.tokens.input + message.tokens.output} tokens</span>}
                    </div>

                    {message.role === 'assistant' && (
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 hover:text-primary transition-colors"
                          onClick={() => copyToClipboard(message.content)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 hover:text-primary transition-colors"
                        >
                          <ThumbsUp className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 hover:text-primary transition-colors"
                        >
                          <ThumbsDown className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="whitespace-pre-wrap">{message.content}</div>
                </Card>
              </div>
            ))
          )}

          {isLoading && (
            <div className="flex space-x-3 max-w-4xl mr-auto">
              <div
                className={cn('w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0', modelTheme.bg, modelTheme.border, 'border')}
              >
                <Bot className={cn('w-4 h-4', modelTheme.accent)} />
              </div>
              <Card className={cn('flex-1 p-4 bg-card', modelTheme.border, 'border')}>
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-muted-foreground">{currentModel.name} is thinking...</span>
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Input Section */}
        <div className="border-t p-4">
          <div className="flex space-x-3">
            <div className="flex-1">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Type your message to ${currentModel.name}...`}
                className="min-h-[80px] resize-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
              />
              <div className="flex items-center justify-between mt-2">
                <div className="text-xs text-muted-foreground">
                  {input.length} characters • Press Ctrl+Enter to send
                </div>
                <div className="text-xs text-muted-foreground">
                  Model: {currentModel.name} • Max: {parameters.maxTokens} tokens
                </div>
              </div>
            </div>
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              size="lg"
              className={cn(
                'self-end bg-primary text-primary-foreground hover:bg-primary/90',
                'dark:bg-primary/80 dark:hover:bg-primary/100 dark:text-primary-foreground',
                'transition-colors duration-200 ease-in-out transform hover:scale-105'
              )}
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
