import React, { useState } from 'react';
import { Sparkles, Loader2, Check } from 'lucide-react';
import { generateProfessionalText } from '../services/geminiService';

interface AIGeneratorProps {
  onApply: (text: string) => void;
  context: 'Terms & Conditions' | 'Notes' | 'Invoice Description';
  placeholder?: string;
}

export const AIGenerator: React.FC<AIGeneratorProps> = ({ onApply, context, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState<string | null>(null);

  if (!process.env.API_KEY) return null; // Hide if no API key

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const result = await generateProfessionalText(prompt, context);
      setGenerated(result);
    } catch (e) {
      alert("Failed to generate text. Please check API configuration.");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (generated) {
      onApply(generated);
      setIsOpen(false);
      setGenerated(null);
      setPrompt('');
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 text-xs font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 px-2 py-1 rounded transition-colors mt-1"
      >
        <Sparkles className="w-3.5 h-3.5" />
        AI Assistant
      </button>
    );
  }

  return (
    <div className="mt-2 p-3 bg-purple-50/50 border border-purple-100 rounded-lg animate-in fade-in slide-in-from-top-2">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-bold text-purple-800 flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          Generate {context}
        </span>
        <button 
          onClick={() => setIsOpen(false)}
          className="text-slate-400 hover:text-slate-600 text-xs"
        >
          Cancel
        </button>
      </div>
      
      {!generated ? (
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 text-sm border border-purple-200 rounded px-2 py-1 focus:ring-2 focus:ring-purple-200 outline-none"
            placeholder={placeholder || "e.g., Payment due 30 days..."}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="bg-purple-600 text-white p-1.5 rounded hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-sm text-slate-700 bg-white p-2 rounded border border-purple-100 italic">
            "{generated}"
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setGenerated(null)}
              className="text-xs text-slate-500 hover:text-slate-800"
            >
              Retry
            </button>
            <button
              onClick={handleApply}
              className="flex items-center gap-1 text-xs bg-purple-600 text-white px-3 py-1.5 rounded hover:bg-purple-700"
            >
              <Check className="w-3 h-3" /> Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
