"use client";

import dynamic from 'next/dynamic';

const ChatUI = dynamic(() => import('./ChatUI'), { 
  ssr: false,
  loading: () => (
    <div className="flex h-screen bg-neo-bg text-foreground items-center justify-center">
      <div className="animate-pulse font-mono text-neo-primary uppercase tracking-widest text-sm">
        Initializing System...
      </div>
    </div>
  )
});

export default function ChatPage() {
  return <ChatUI />;
}
