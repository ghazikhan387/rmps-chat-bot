"use client";

import { motion } from "framer-motion";
import { Send, Bot, User } from "lucide-react";

export function ChatPreview() {
  return (
    <section className="py-24 bg-neo-bg relative border-t border-neo-border">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-ado">
          Experience the Guide
        </h2>
        <p className="text-lg text-neo-muted mb-12">
          An intuitive chat interface powered by pgvector retrieval and generative AI.
        </p>
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="neo-box rounded-lg shadow-2xl bg-neo-surface border border-neo-border overflow-hidden text-left"
        >
          {/* Mac-style Window Header */}
          <div className="flex items-center px-4 py-3 border-b border-neo-border bg-neo-bg/50">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-neo-border/50" />
              <div className="w-3 h-3 rounded-full bg-neo-border/50" />
              <div className="w-3 h-3 rounded-full bg-neo-border/50" />
            </div>
            <div className="mx-auto text-xs font-mono text-neo-muted tracking-widest uppercase">RMPSU Chat Interface</div>
          </div>

          {/* Chat Body Mock */}
          <div className="p-6 h-96 overflow-y-auto flex flex-col gap-6 bg-neo-bg/50">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded shrink-0 bg-neo-surface border border-neo-border flex items-center justify-center text-neo-muted">
                <User className="w-4 h-4" />
              </div>
              <div className="bg-neo-surface border border-neo-border px-4 py-3 rounded-br-xl rounded-bl-xl rounded-tr-xl text-sm">
                What are the eligibility criteria for the B.Tech Computer Science program?
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded shrink-0 bg-neo-primary flex items-center justify-center text-white">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-neo-surface border border-neo-primary/20 px-4 py-3 rounded-br-xl rounded-bl-xl rounded-tr-xl text-sm leading-relaxed">
                <p className="mb-2">For B.Tech Computer Science Engineering at RMPSU, the eligibility criteria typically are:</p>
                <ul className="list-disc pl-5 space-y-1 mb-2 text-neo-muted">
                  <li>Passed 10+2 examination with Physics and Mathematics as compulsory subjects.</li>
                  <li>Obtained at least 45% marks (40% for reserved categories) in the above subjects taken together.</li>
                  <li>Valid score in UPSEE / JEE Main entrance examination.</li>
                </ul>
                <p className="text-xs text-neo-primary mt-2">Source: Prospectus 2024-25, Page 14</p>
              </div>
            </div>
          </div>

          {/* Chat Input Mock */}
          <div className="p-4 border-t border-neo-border bg-neo-bg">
            <div className="flex items-center gap-2 neo-box bg-neo-surface px-4 py-2 hover:border-neo-primary transition-colors cursor-text">
              <input 
                type="text" 
                placeholder="Ask about admissions, facilities, or rules..." 
                className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-neo-muted" 
                disabled 
              />
              <button className="p-2 text-neo-primary hover:bg-neo-primary/10 transition-colors">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
