'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export interface TerminalProps {
  onSubmit: (prompt: string) => Promise<void>;
  onClear: () => void;
  isProcessing: boolean;
  conversation: string[];
}

export function Terminal({ onSubmit, onClear, isProcessing, conversation }: TerminalProps) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isProcessing) return;

    await onSubmit(prompt);
    setPrompt('');
  };

  return (
    <div className="flex h-full flex-col bg-[#1E1E1E] text-white">
      <div className="flex-1 overflow-y-auto p-4">
        {conversation.map((message, i) => (
          <div key={i} className="mb-4 whitespace-pre-wrap font-mono">{message}</div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-[#3C3C3C] p-4">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={isProcessing ? 'Processing...' : 'Enter your prompt...'}
          disabled={isProcessing}
          className="flex-1 bg-[#3C3C3C] px-4 py-2 text-white placeholder-gray-400 focus:outline-none disabled:opacity-50"
        />
        <Button
          type="submit"
          disabled={isProcessing || !prompt.trim()}
          className="bg-[#264F78] text-white hover:bg-[#264F78]/90 disabled:opacity-50"
        >
          {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send'}
        </Button>
        <Button
          type="button"
          onClick={onClear}
          variant="outline"
          className="border-[#3C3C3C] text-white hover:bg-[#3C3C3C]"
        >
          Clear
        </Button>
      </form>
    </div>
  );
} 