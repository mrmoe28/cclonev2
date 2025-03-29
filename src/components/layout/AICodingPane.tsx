'use client';

import React, { useState, useRef, useEffect } from 'react';
import { AIAgent } from '@/lib/aiAgent';
import CodePreview from '@/components/features/CodePreview';
import WebPreview from '@/components/features/WebPreview';

interface AICodingPaneProps {
  className?: string;
}

interface ParsedCode {
  html: string;
  css: string;
  javascript: string;
  fullCode: string;
}

export default function AICodingPane({ className = '' }: AICodingPaneProps) {
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversation, setConversation] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentCode, setCurrentCode] = useState('');
  const [parsedCode, setParsedCode] = useState<ParsedCode>({
    html: '',
    css: '',
    javascript: '',
    fullCode: ''
  });
  const [streamedResponse, setStreamedResponse] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
  const aiAgentRef = useRef<AIAgent | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    if (apiKey) {
      aiAgentRef.current = new AIAgent(apiKey);
    } else {
      setError('OpenAI API key not found. AI features are disabled.');
    }
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [conversation]);

  useEffect(() => {
    const code = extractCodeFromResponse(streamedResponse);
    setCurrentCode(code);
    const parsed = parseCodeBlocks(code);
    setParsedCode(parsed);
  }, [streamedResponse]);

  const parseCodeBlocks = (code: string): ParsedCode => {
    const result: ParsedCode = {
      html: '',
      css: '',
      javascript: '',
      fullCode: code
    };

    // Extract HTML
    const htmlMatch = code.match(/```html\n([\s\S]*?)```/);
    if (htmlMatch) result.html = htmlMatch[1].trim();

    // Extract CSS
    const cssMatch = code.match(/```css\n([\s\S]*?)```/);
    if (cssMatch) result.css = cssMatch[1].trim();

    // Extract JavaScript/TypeScript
    const jsMatch = code.match(/```(?:javascript|typescript)\n([\s\S]*?)```/);
    if (jsMatch) result.javascript = jsMatch[1].trim();

    // If no specific blocks found, try to guess the content type
    if (!htmlMatch && !cssMatch && !jsMatch) {
      if (code.includes('<')) {
        result.html = code;
      } else if (code.includes('{') && code.includes('}')) {
        if (code.includes('@media') || code.includes(':')) {
          result.css = code;
        } else {
          result.javascript = code;
        }
      }
    }

    return result;
  };

  const extractCodeFromResponse = (text: string): string => {
    const codeBlockRegex = /```(?:\w+)?\n([\s\S]*?)```/;
    const match = text.match(codeBlockRegex);
    return match ? match[1].trim() : text;
  };

  const handleStream = (chunk: string) => {
    setStreamedResponse(prev => prev + chunk);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isProcessing || !aiAgentRef.current) return;

    setIsProcessing(true);
    setIsStreaming(true);
    setStreamedResponse('');
    setCurrentCode('');
    setParsedCode({
      html: '',
      css: '',
      javascript: '',
      fullCode: ''
    });
    setConversation(prev => [...prev, { role: 'user', content: prompt }]);
    
    try {
      const response = await aiAgentRef.current.generateCode(prompt, handleStream);
      setConversation(prev => [...prev, { role: 'assistant', content: response }]);
      setPrompt('');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsProcessing(false);
      setIsStreaming(false);
    }
  };

  return (
    <div className={`flex flex-col h-full bg-[#1E1E1E] ${className}`}>
      <div className="flex-none p-4 border-b border-[#3C3C3C]">
        <h2 className="text-lg font-semibold text-white">AI Coding Assistant</h2>
      </div>

      <div className="flex-1 flex">
        <div className="w-1/2 border-r border-[#3C3C3C] flex flex-col">
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4"
          >
            {conversation.map((message, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-[#264F78] ml-8'
                    : 'bg-[#2D2D2D] mr-8'
                }`}
              >
                <div className="text-sm text-[#CCCCCC]">
                  {message.role === 'assistant' ? (
                    <pre className="whitespace-pre-wrap font-mono text-sm">
                      {message.content}
                    </pre>
                  ) : (
                    message.content
                  )}
                </div>
              </div>
            ))}
            {isProcessing && (
              <div className="flex items-center justify-center p-4">
                <div className="animate-pulse text-[#CCCCCC]">Generating code...</div>
              </div>
            )}
          </div>

          {error && (
            <div className="flex-none p-3 bg-red-900/20 border-t border-red-900/30">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex-none p-4 border-t border-[#3C3C3C]">
            <div className="flex space-x-2">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the webpage you want to create..."
                className="flex-1 bg-[#2D2D2D] text-[#CCCCCC] px-4 py-2 rounded-lg border border-[#3C3C3C] focus:outline-none focus:border-[#264F78]"
                disabled={isProcessing}
              />
              <button
                type="submit"
                disabled={isProcessing || !prompt.trim()}
                className={`px-4 py-2 rounded-lg bg-[#264F78] text-white font-medium
                  ${isProcessing || !prompt.trim() 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-[#264F78]/80'}`}
              >
                Generate
              </button>
            </div>
          </form>
        </div>

        <div className="w-1/2 flex flex-col">
          <div className="flex-none px-4 pt-4">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('code')}
                className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors
                  ${activeTab === 'code'
                    ? 'bg-[#2D2D2D] text-white border-t border-l border-r border-[#3C3C3C]'
                    : 'text-[#CCCCCC] hover:text-white'}`}
              >
                Code
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors
                  ${activeTab === 'preview'
                    ? 'bg-[#2D2D2D] text-white border-t border-l border-r border-[#3C3C3C]'
                    : 'text-[#CCCCCC] hover:text-white'}`}
              >
                Preview
              </button>
            </div>
          </div>

          <div className="flex-1 p-4 pt-0">
            {activeTab === 'code' ? (
              <CodePreview
                code={currentCode}
                isStreaming={isStreaming}
                title="Generated Code"
              />
            ) : (
              <WebPreview
                html={parsedCode.html}
                css={parsedCode.css}
                javascript={parsedCode.javascript}
                isStreaming={isStreaming}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 