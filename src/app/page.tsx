import { Hero, ValueProp, Features, ChatPreview } from "@/components/ui";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center w-full selection:bg-neo-primary/30 selection:text-neo-primary">
      <div className="w-full">
        <Hero />
        <ValueProp />
        <Features />
        <ChatPreview />
        
        {/* Footer */}
        <footer className="w-full py-8 border-t border-neo-border bg-neo-bg text-center text-sm text-neo-muted flex flex-col items-center justify-center gap-2">
          <p>© {new Date().getFullYear()} Raja Mahendra Pratap Singh University AI Tour Guide.</p>
          <p className="opacity-60 text-xs uppercase tracking-widest font-mono">System v1.0 • Neo-Geo Framework</p>
        </footer>
      </div>
    </main>
  );
}
