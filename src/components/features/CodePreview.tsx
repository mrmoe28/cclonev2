'use client';

import React, { useEffect, useRef } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodePreviewProps {
  code: string;
  language?: string;
  title?: string;
  isStreaming?: boolean;
}

export default function CodePreview({ 
  code, 
  language = 'typescript',
  title = 'Generated Code',
  isStreaming = false 
}: CodePreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (previewRef.current && isStreaming) {
      previewRef.current.scrollTop = previewRef.current.scrollHeight;
    }
  }, [code, isStreaming]);

  return (
    <div className="h-full flex flex-col bg-[#1E1E1E] rounded-lg overflow-hidden">
      <div className="flex-none px-4 py-2 bg-[#2D2D2D] border-b border-[#3C3C3C]">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-[#CCCCCC]">{title}</span>
          {isStreaming && (
            <span className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2" />
              <span className="text-xs text-[#CCCCCC]">Streaming</span>
            </span>
          )}
        </div>
      </div>
      
      <div 
        ref={previewRef}
        className="flex-1 overflow-auto"
      >
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: '1rem',
            background: 'transparent',
            fontSize: '0.875rem',
            lineHeight: '1.5',
          }}
          wrapLongLines
          showLineNumbers
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
} 