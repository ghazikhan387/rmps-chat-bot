"use client";

import { X, AlertTriangle } from "lucide-react";
import { useEffect } from "react";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName?: string;
}

export function DeleteModal({ isOpen, onClose, onConfirm, itemName = "conversation" }: DeleteModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />
      <div className="relative bg-neo-surface border border-neo-border w-full max-w-md animate-in zoom-in-95 fade-in duration-200 shadow-2xl shadow-black/50">
        <div className="absolute top-0 left-0 w-3 h-3 bg-neo-secondary" />
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-neo-accent" />
        
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="shrink-0 w-12 h-12 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-foreground mb-1">
                Delete {itemName}?
              </h3>
              <p className="text-sm text-neo-muted leading-relaxed">
                This action cannot be undone. The {itemName} and all its messages will be permanently removed from the system.
              </p>
            </div>
            <button
              onClick={onClose}
              className="shrink-0 p-1.5 rounded hover:bg-neo-bg text-neo-muted hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="flex gap-3 p-4 pt-0">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-lg border border-neo-border bg-neo-bg text-foreground font-medium text-sm hover:bg-neo-surface transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium text-sm transition-colors shadow-lg shadow-red-500/20"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
