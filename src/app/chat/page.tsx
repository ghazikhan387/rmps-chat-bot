"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { Send, Bot, User, Menu, FileText, LogOut, Plus, Trash2, X } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useChat } from "@ai-sdk/react";
import { v4 as uuidv4 } from "uuid";
import { DeleteModal } from "@/components/ui/DeleteModal";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatPage() {
  const supabase = createClient();
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [chats, setChats] = useState<{id: string, title: string, created_at: string}[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { messages, input, handleInputChange, isLoading, setMessages, append, setInput } = useChat({
    api: '/api/chat',
    initialMessages: [
      { id: '1', role: 'assistant', content: "Hello. I am the RMPSU System. How can I assist you today?" }
    ]
  });

  const loadChats = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/");
      return;
    }
    const { data } = await supabase.from('chats').select('id, title, created_at').order('created_at', { ascending: false });
    if (data) setChats(data);
    setIsLoadingHistory(false);
  }, [router, supabase]);

  useEffect(() => {
    const init = async () => {
      await loadChats();
    };
    init();
  }, [loadChats]);

  const loadChatHistory = async (chatId: string) => {
    setIsLoadingHistory(true);
    setActiveChatId(chatId);
    const { data } = await supabase.from('messages').select('*').eq('chat_id', chatId).order('timestamp', { ascending: true });
    
    if (data && data.length > 0) {
      const formattedMessages: Message[] = data.map((msg, idx) => ({
        id: msg.id || String(idx),
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      }));
      setMessages(formattedMessages);
    } else {
      setMessages([{ id: '1', role: 'assistant', content: "Hello. I am the RMPSU System. How can I assist you today?" }]);
    }
    setIsLoadingHistory(false);
    setIsSidebarOpen(false); // Close sidebar on mobile after selection
  };

  const createNewChat = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    const newChatId = uuidv4();
    await supabase.from('chats').insert({ id: newChatId, user_id: user.id, title: 'New Conversation' });
    setActiveChatId(newChatId);
    setMessages([{ id: '1', role: 'assistant', content: "Hello. I am the RMPSU System. How can I assist you today?" }]);
    loadChats();
    setIsSidebarOpen(false); // Close sidebar on mobile after creation
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    let currentChatId = activeChatId;
    if (!currentChatId) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      currentChatId = uuidv4();
      await supabase.from('chats').insert({ id: currentChatId, user_id: user.id, title: input.substring(0, 30) + '...' });
      setActiveChatId(currentChatId);
      loadChats();
    }
    
    append({ role: 'user', content: input }, { body: { chatId: currentChatId } });
    setInput('');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const deleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setChatToDelete(chatId);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!chatToDelete) return;
    await supabase.from('messages').delete().eq('chat_id', chatToDelete);
    await supabase.from('chats').delete().eq('id', chatToDelete);
    if (activeChatId === chatToDelete) {
      setActiveChatId(null);
      setMessages([{ id: '1', role: 'assistant', content: "Hello. I am the RMPSU System. How can I assist you today?" }]);
    }
    loadChats();
    setDeleteModalOpen(false);
    setChatToDelete(null);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div className="flex h-screen bg-neo-bg text-foreground overflow-hidden selection:bg-neo-primary/30 selection:text-neo-primary">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed md:relative z-50 md:z-auto h-full w-64 border-r border-neo-border bg-neo-surface flex flex-col transition-transform duration-300 md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>

        <div className="p-4 border-b border-neo-border flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center overflow-hidden border border-neo-primary/20 p-0.5">
              <img 
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsBCF6c3aQB33JzRSCPD_0fZNvMaENEamqDA&s" 
                alt="Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="font-mono text-xs tracking-widest text-neo-primary font-bold group-hover:text-neo-accent transition-colors">RMPSU</div>
          </Link>
          <div className="flex items-center gap-1">
            <button onClick={createNewChat} className="p-1 text-neo-primary hover:bg-neo-primary/10 rounded transition-colors">
              <Plus className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden p-1 text-neo-muted hover:text-foreground rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
          <div className="text-xs text-neo-muted uppercase font-mono mb-2 tracking-wider">Recent Access</div>
          {chats.map(chat => (
            <div
              key={chat.id}
              className={`group flex items-center gap-2 p-2 rounded text-sm transition-colors ${activeChatId === chat.id ? 'bg-neo-primary/10 text-neo-primary border border-neo-primary/20' : 'hover:bg-neo-bg text-neo-muted hover:text-foreground border border-transparent'}`}
            >
              <button
                onClick={() => loadChatHistory(chat.id)}
                className="flex items-center gap-2 flex-1 min-w-0 text-left"
              >
                <FileText className="w-4 h-4 shrink-0" />
                <span className="truncate">{chat.title}</span>
              </button>
              <button
                onClick={(e) => deleteChat(chat.id, e)}
                className="shrink-0 opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20 hover:text-red-400 transition-all"
                title="Delete conversation"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          {chats.length === 0 && !isLoadingHistory && (
            <div className="text-xs text-neo-muted italic">No records found.</div>
          )}
        </div>

        <div className="p-4 border-t border-neo-border">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 p-2 w-full rounded hover:bg-neo-bg text-sm text-left transition-colors text-neo-muted hover:text-neo-secondary"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Terminate Session</span>
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative w-full h-full">
        {/* Header */}
        <header className="h-14 border-b border-neo-border bg-neo-bg flex items-center px-4 justify-between md:justify-end shrink-0">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden p-2 text-neo-muted hover:text-foreground"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-neo-accent animate-pulse' : 'bg-neo-primary'}`} />
            <span className="text-xs font-mono text-neo-muted uppercase tracking-widest">
              {isLoading ? 'Processing Query' : (isLoadingHistory ? 'Accessing Archives' : 'System Ready')}
            </span>
          </div>
        </header>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-8 scroll-smooth relative">
           <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
           
           <div className="flex flex-col gap-8 max-w-3xl mx-auto w-full z-10 pb-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                {msg.role !== 'user' && (
                  <div className="w-8 h-8 rounded shrink-0 bg-neo-primary flex items-center justify-center text-white">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                
                <div className={`px-4 py-3 text-sm max-w-[85%] leading-relaxed neo-box flex flex-col gap-2 ${
                  msg.role === 'user' 
                    ? 'bg-neo-surface border-neo-border rounded-bl-xl rounded-tl-xl rounded-br-xl ml-12' 
                    : 'bg-neo-bg border-neo-primary/30 rounded-br-xl rounded-tr-xl rounded-bl-xl mr-12'
                }`}>
                  <span className="whitespace-pre-wrap">{msg.content}</span>
                </div>

                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded shrink-0 bg-neo-surface border border-neo-border flex items-center justify-center text-neo-muted">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 bg-neo-bg border-t border-neo-border shrink-0">
          <div className="max-w-3xl mx-auto relative">
            <form onSubmit={handleCustomSubmit} className="flex relative items-end neo-box bg-neo-surface focus-within:border-neo-primary transition-colors">
              <textarea
                value={input}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if(input.trim()) {
                       const event = new Event('submit', { cancelable: true, bubbles: true });
                       e.currentTarget.form?.dispatchEvent(event);
                    }
                  }
                }}
                placeholder="Query system..."
                className="w-full max-h-32 min-h-[56px] border-none bg-transparent resize-none focus:outline-none p-4 text-sm"
                rows={1}
                disabled={isLoading}
              />
              <button 
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-4 text-neo-primary hover:text-neo-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
            <div className="text-center mt-2 text-[10px] text-neo-muted font-mono uppercase tracking-widest">
              Shift+Enter for newline • AI responses can be hallucinated
            </div>
          </div>
        </div>
      </div>
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setChatToDelete(null);
        }}
        onConfirm={confirmDelete}
        itemName="conversation"
      />
    </div>
  );
}
