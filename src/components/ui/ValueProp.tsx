"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

export function ValueProp() {
  const points = [
    "Eliminates hours spent searching through PDFs",
    "Provides 24/7 answers to prospective and current students",
    "Contextual understanding of RMPSU's complex structures",
    "Scalable foundation for future admission automations"
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 w-full">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
                Redefining the Student Experience
              </h2>
            <p className="text-lg text-neo-muted mb-8 max-w-xl">
                The RMPSU Virtual Guide seamlessly integrates vast amounts of university 
                data into a single, conversational interface. It&apos;s not just a search engine; 
                it&apos;s your automated concierge.
            </p>
              
              <ul className="space-y-4">
                {points.map((point, index) => (
                  <motion.li 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    className="flex items-start gap-3"
                  >
                    <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-neo-primary/20 flex items-center justify-center border border-neo-primary/50">
                      <Check className="w-3 h-3 text-neo-primary" />
                    </div>
                    <span className="text-foreground/90">{point}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>

          <div className="flex-1 w-full relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="neo-box p-1 bg-gradient-to-br from-neo-primary/20 to-neo-accent/20 aspect-square max-w-md mx-auto relative group"
            >
              <div className="absolute inset-0 bg-grid-pattern opacity-50"></div>
              <div className="w-full h-full bg-neo-surface border border-neo-border flex flex-col justify-center items-center p-8 text-center mix-blend-overlay">
                 {/* Abstract geometric composition */}
                 <div className="w-32 h-32 border-2 border-neo-primary rounded-full relative animate-spin-slow">
                    <div className="absolute -top-2 left-1/2 w-4 h-4 bg-neo-accent -translate-x-1/2"></div>
                 </div>
                 <h3 className="text-2xl font-bold font-mono mt-8 tracking-widest text-neo-primary">RMPSU_CORE</h3>
                 <p className="text-xs text-neo-muted mt-2 uppercase tracking-widest">System Online</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
