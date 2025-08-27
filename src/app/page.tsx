'use client'

import dynamic from 'next/dynamic'

const ChatInterface = dynamic(() => import('@/components/chat-interface'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading AI Interface...</p>
      </div>
    </div>
  )
})

export default function Home() {
  return <ChatInterface />
}