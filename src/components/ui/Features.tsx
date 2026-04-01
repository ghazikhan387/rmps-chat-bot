"use client";

import { motion } from "framer-motion";
import { BookOpen, MapPin, MessageSquare, Zap } from "lucide-react";

const features = [
  {
    icon: <MessageSquare className="w-6 h-6 text-neo-primary" />,
    title: "Natural Conversations",
    description: "Ask questions in plain English or Hindi. The AI understands context and follows up perfectly."
  },
  {
    icon: <BookOpen className="w-6 h-6 text-neo-accent" />,
    title: "Grounded Knowledge",
    description: "Answers are sourced directly from RMPSU official notices, prospectus, and syllabus documents."
  },
  {
    icon: <Zap className="w-6 h-6 text-neo-secondary" />,
    title: "Instant Retrieval",
    description: "Powered by advanced vector search, finding the exact paragraph you need in milliseconds."
  },
  {
    icon: <MapPin className="w-6 h-6 text-neo-primary" />,
    title: "Campus Navigation",
    description: "Get contextual guidance about facilities, departments, and event locations."
  }
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-neo-surface/30 relative border-y border-neo-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Algorithmic Intelligence for Students
          </h2>
          <p className="text-lg text-neo-muted max-w-2xl mx-auto">
            The RMPSU AI Tour Guide is built on a robust RAG (Retrieval-Augmented Generation) pipeline, 
            ensuring every answer is accurate and fact-checked against official data.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="neo-box p-6 bg-neo-bg hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="w-12 h-12 flex items-center justify-center bg-neo-surface border border-neo-border mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-neo-muted text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
