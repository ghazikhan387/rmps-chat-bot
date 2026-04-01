"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative pt-24 pb-20 md:pt-40 md:pb-32 overflow-hidden flex flex-col items-center justify-center text-center px-4 min-h-[90vh]">
      {/* University Building Background with Mask/Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center scale-105 blur-[2px] grayscale-[20%] opacity-20"
          style={{ backgroundImage: 'url("/assets/hero-bg-ai.png")' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-neo-bg via-transparent to-neo-bg" />
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      </div>

      {/* Top Logo / Navigation Header */}
      <div className="absolute top-8 left-0 right-0 z-20 px-8 flex justify-between items-center max-w-7xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center overflow-hidden border-2 border-neo-primary/20 group-hover:border-neo-primary/50 transition-all p-1">
            <img 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsBCF6c3aQB33JzRSCPD_0fZNvMaENEamqDA&s" 
              alt="RMPSU Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col items-start leading-none">
            <span className="text-sm font-bold tracking-tighter text-foreground group-hover:text-neo-primary transition-colors uppercase">RMPSU</span>
            <span className="text-[10px] font-mono text-neo-muted uppercase tracking-widest mt-1">State University</span>
          </div>
        </Link>
      </div>

      
      {/* Neo-Geo Decorative Elements */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="absolute top-1/4 left-10 md:left-24 w-64 h-64 border border-neo-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 dark:mix-blend-screen"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
        className="absolute bottom-1/4 right-10 md:right-24 w-72 h-72 border border-neo-accent/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 dark:mix-blend-screen"
      />

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1 text-sm text-neo-primary bg-neo-primary/10 border border-neo-primary/20 rounded-full mb-8 font-mono"
        >
          <Sparkles className="w-4 h-4" />
          <span>RMPSU Virtual Campus Guide v1.0</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-8"
        >
          Navigate Your Campus with{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neo-primary to-neo-accent">
            AI Precision
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-neo-muted max-w-2xl mb-10"
        >
          Instant, contextual answers about admissions, courses, and facilities. 
          Stop searching through PDFs—just ask the intelligent guide.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link href="/chat" className="neo-box px-8 py-3 bg-neo-primary text-white font-medium hover:bg-neo-primary/90 transition-colors flex items-center gap-2 group">
            Start Exploring
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a href="#features" className="neo-box px-8 py-3 bg-transparent text-foreground font-medium hover:bg-neo-surface transition-colors flex items-center justify-center">
            How it Works
          </a>
        </motion.div>
      </div>
    </section>
  );
}
