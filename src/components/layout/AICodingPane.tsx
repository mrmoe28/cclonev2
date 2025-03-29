'use client';

import React, { useState, useRef, useEffect } from 'react';
import { AIAgent } from '@/lib/aiAgent';
import CodePreview from '@/components/features/CodePreview';
import { WebPreview } from '@/components/features/WebPreview';
import { editor } from 'monaco-editor';

interface CodeState {
  html: string;
  css: string;
  javascript: string;
}

interface AICodingPaneProps {
  className?: string;
}

type TabType = 'html' | 'css' | 'javascript';

export default function AICodingPane({ className }: AICodingPaneProps) {
  const [activeTab, setActiveTab] = useState<TabType>('html');
  const [code, setCode] = useState<CodeState>({ html: '', css: '', javascript: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const aiAgentRef = useRef<AIAgent | null>(null);

  // Initialize AI agent and restore code state
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    if (apiKey) {
      aiAgentRef.current = new AIAgent();
      
      // Try to restore code from localStorage
      try {
        const savedCode = localStorage.getItem('code');
        if (savedCode) {
          const parsedCode = JSON.parse(savedCode);
          setCode(parsedCode);
        }
      } catch (err) {
        console.error('Failed to restore saved state:', err);
      }
    } else {
      setError('OpenAI API key not found. Please set NEXT_PUBLIC_OPENAI_API_KEY in your environment.');
    }
  }, []);

  // Save code state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('code', JSON.stringify(code));
  }, [code]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiAgentRef.current) {
      setError('AI Agent not initialized. Please check your API key.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    
    try {
      const response = await aiAgentRef.current.generateCode(prompt, code);
      setCode(response);
      setPrompt('');
    } catch (err) {
      setError((err as Error).message);
      console.error('Error generating code:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClearCode = () => {
    if (!aiAgentRef.current) return;
    
    setCode({ html: '', css: '', javascript: '' });
    aiAgentRef.current.clearHistory();
    
    // Clear localStorage
    localStorage.removeItem('code');
  };

  const editorOptions: editor.IStandaloneEditorConstructionOptions = {
    minimap: { enabled: false },
    fontSize: 14,
    lineNumbers: 'on',
    scrollBeyondLastLine: false,
    automaticLayout: true,
    wordWrap: 'on',
    renderWhitespace: 'selection',
    tabSize: 2,
    insertSpaces: true,
    bracketPairColorization: { enabled: true },
    guides: { bracketPairs: true },
    folding: true,
    foldingStrategy: 'indentation',
    suggestOnTriggerCharacters: true,
    acceptSuggestionOnEnter: 'on',
    snippetSuggestions: 'top',
    formatOnPaste: true,
    formatOnType: true,
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      <div className="flex-none h-10 bg-[#2D2D2D] border-b border-[#3C3C3C]">
        <div className="flex items-center justify-between px-4 h-full">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-[#CCCCCC]">AI Code Generator</span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setActiveTab('html')}
                className={`px-2 py-1 text-xs rounded ${
                  activeTab === 'html'
                    ? 'bg-[#3C3C3C] text-white'
                    : 'text-[#CCCCCC] hover:bg-[#3C3C3C]'
                }`}
              >
                HTML
              </button>
              <button
                onClick={() => setActiveTab('css')}
                className={`px-2 py-1 text-xs rounded ${
                  activeTab === 'css'
                    ? 'bg-[#3C3C3C] text-white'
                    : 'text-[#CCCCCC] hover:bg-[#3C3C3C]'
                }`}
              >
                CSS
              </button>
              <button
                onClick={() => setActiveTab('javascript')}
                className={`px-2 py-1 text-xs rounded ${
                  activeTab === 'javascript'
                    ? 'bg-[#3C3C3C] text-white'
                    : 'text-[#CCCCCC] hover:bg-[#3C3C3C]'
                }`}
              >
                JavaScript
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        {/* AI Agent Section */}
        <div className="flex-none border-b border-[#3C3C3C] bg-[#252526]">
          {/* Chat Messages */}
          <div className="max-h-48 overflow-y-auto p-4 space-y-4">
            {error && (
              <div className="text-red-500 mb-4">Error: {error}</div>
            )}
          </div>

          {/* Prompt Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-[#3C3C3C]">
            <div className="flex space-x-2">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={isProcessing ? 'Processing...' : 'Ask the AI to generate code...'}
                className="flex-1 bg-[#3C3C3C] text-white placeholder-[#808080] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#264F78]"
                disabled={isProcessing}
              />
              <button
                type="submit"
                disabled={isProcessing || !aiAgentRef.current}
                title="Send prompt to AI"
                className={`px-4 py-2 rounded-md transition-colors ${
                  isProcessing || !aiAgentRef.current
                    ? 'bg-[#3C3C3C] text-[#808080]'
                    : 'bg-[#264F78] text-white hover:bg-[#264F78]/80'
                }`}
              >
                Send
              </button>
            </div>
          </form>
        </div>

        {/* Editor/Preview Section */}
        <div className="flex-1 flex min-h-0">
          <div className="flex-1 overflow-hidden">
            <CodePreview
              value={activeTab === 'html' ? code.html : activeTab === 'css' ? code.css : code.javascript}
              onChange={(value: string) => {
                if (activeTab === 'html') setCode(prev => ({ ...prev, html: value }));
                else if (activeTab === 'css') setCode(prev => ({ ...prev, css: value }));
                else setCode(prev => ({ ...prev, javascript: value }));
              }}
              language={activeTab === 'javascript' ? 'javascript' : activeTab === 'css' ? 'css' : 'html'}
              theme="vs-dark"
              options={editorOptions}
            />
          </div>
          
          <div className="w-1/2 border-l border-[#3C3C3C] overflow-hidden">
            <WebPreview code={code} />
          </div>
        </div>
      </div>
    </div>
  );
} 