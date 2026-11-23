import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#143826] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#dfa62c]/30 animate-bounce duration-300">
      <CheckCircle className="w-5 h-5 text-[#dfa62c] flex-shrink-0" />
      <span className="text-xs sm:text-sm font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 text-gray-400 hover:text-white text-xs font-bold"
      >
        ✕
      </button>
    </div>
  );
};
