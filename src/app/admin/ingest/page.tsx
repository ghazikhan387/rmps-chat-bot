"use client";

import { useState } from "react";
import { Upload, CheckCircle, AlertCircle } from "lucide-react";

export default function AdminIngestPage() {
  const [content, setContent] = useState("");
  const [source, setSource] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{type: 'idle'|'success'|'error', msg: string}>({ type: 'idle', msg: '' });

  const handleIngest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    setLoading(true);
    setStatus({ type: 'idle', msg: '' });

    try {
      const res = await fetch('/api/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, source })
      });

      const data = await res.json();
      if (res.ok) {
        setStatus({ type: 'success', msg: data.message });
        setContent("");
        setSource("");
      } else {
        setStatus({ type: 'error', msg: data.error || 'Upload failed' });
      }
    } catch {
      setStatus({ type: 'error', msg: 'Network error. Check console.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neo-bg text-foreground p-8 md:p-16 selection:bg-neo-primary/30 selection:text-neo-primary">
      <div className="max-w-3xl mx-auto neo-box p-8">
        <div className="mb-8 border-b border-neo-border pb-4">
          <h1 className="text-3xl font-bold font-mono text-neo-primary mb-2">Knowledge Base Admin</h1>
          <p className="text-neo-muted">Upload Markdown data from Firecrawl to embed into the RMPSU Vector DB.</p>
        </div>

        <form onSubmit={handleIngest} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 font-mono uppercase tracking-widest text-neo-muted">Source Name / URL</label>
            <input 
              type="text" 
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="e.g., Syllabus_2024.md or https://rmpsu.org/about"
              className="w-full bg-neo-surface border border-neo-border p-3 focus:outline-none focus:border-neo-primary transition-colors text-sm"
              required
            />
          </div>

          <div>
             <label className="block text-sm font-medium mb-2 font-mono uppercase tracking-widest text-neo-muted">Markdown Content</label>
             <textarea 
               value={content}
               onChange={(e) => setContent(e.target.value)}
               placeholder="# Paste markdown content here..."
               className="w-full h-64 bg-neo-surface border border-neo-border p-3 focus:outline-none focus:border-neo-primary transition-colors font-mono text-sm resize-y"
               required
             />
          </div>

          <button 
            type="submit" 
            disabled={loading || !content.trim()}
            className="w-full flex items-center justify-center gap-2 bg-neo-primary hover:bg-neo-primary/90 text-white p-4 font-mono uppercase tracking-widest transition-colors disabled:opacity-50"
          >
            {loading ? (
              <span className="animate-pulse">Processing...</span>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Ingest to pgvector
              </>
            )}
          </button>

          {status.type !== 'idle' && (
            <div className={`p-4 flex items-start gap-3 border ${status.type === 'success' ? 'bg-neo-accent/10 border-neo-accent text-neo-accent' : 'bg-neo-secondary/10 border-neo-secondary text-neo-secondary'}`}>
              {status.type === 'success' ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
              <span className="text-sm">{status.msg}</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
