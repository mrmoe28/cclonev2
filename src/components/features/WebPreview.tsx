'use client';

import React, { useRef, useEffect, useState } from 'react';
import { RefreshCw, Maximize2, Minimize2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface WebPreviewProps {
  code: {
    html: string;
    css: string;
    javascript: string;
  };
  isStreaming?: boolean;
}

export function WebPreview({ code, isStreaming = false }: WebPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'source'>('preview');
  const [copySuccess, setCopySuccess] = useState(false);

  const updatePreview = () => {
    if (!iframeRef.current) return;

    const fullCode = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            ${code.css}
          </style>
        </head>
        <body>
          ${code.html}
          <script>
            try {
              ${code.javascript}
            } catch (error) {
              console.error('Error in preview:', error);
            }
          </script>
        </body>
      </html>
    `;

    const iframe = iframeRef.current;
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(fullCode);
      doc.close();
    }
  };

  const handleCopyCode = async () => {
    const fullCode = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
${code.css}
  </style>
</head>
<body>
${code.html}
<script>
${code.javascript}
</script>
</body>
</html>`;

    try {
      await navigator.clipboard.writeText(fullCode);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  useEffect(() => {
    updatePreview();
  }, [code]);

  return (
    <div className={`flex flex-col h-full bg-[#1E1E1E] ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      <div className="flex-none flex items-center justify-between p-2 bg-[#2D2D2D] border-b border-[#3C3C3C]">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              activeTab === 'preview'
                ? 'bg-[#3C3C3C] text-white'
                : 'text-[#CCCCCC] hover:bg-[#3C3C3C]'
            }`}
          >
            Preview
          </button>
          <button
            onClick={() => setActiveTab('source')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              activeTab === 'source'
                ? 'bg-[#3C3C3C] text-white'
                : 'text-[#CCCCCC] hover:bg-[#3C3C3C]'
            }`}
          >
            Source
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopyCode}
            className={`p-1.5 rounded-md transition-colors ${
              copySuccess ? 'bg-green-600 text-white' : 'hover:bg-[#3C3C3C] text-[#CCCCCC]'
            }`}
            title="Copy code"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={updatePreview}
            className="p-1.5 rounded-md hover:bg-[#3C3C3C] transition-colors text-[#CCCCCC]"
            title="Refresh preview"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-md hover:bg-[#3C3C3C] transition-colors text-[#CCCCCC]"
            title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === 'preview' ? (
          <iframe
            ref={iframeRef}
            className="w-full h-full bg-white"
            sandbox="allow-scripts allow-same-origin"
            title="Preview"
          />
        ) : (
          <div className="h-full overflow-auto bg-[#1E1E1E] p-4 font-mono text-sm text-[#CCCCCC]">
            <div className="space-y-4">
              <div>
                <div className="text-[#569CD6] mb-2">&lt;!-- HTML --&gt;</div>
                <pre className="whitespace-pre-wrap">{code.html}</pre>
              </div>
              <div>
                <div className="text-[#569CD6] mb-2">/* CSS */</div>
                <pre className="whitespace-pre-wrap">{code.css}</pre>
              </div>
              <div>
                <div className="text-[#569CD6] mb-2">// JavaScript</div>
                <pre className="whitespace-pre-wrap">{code.javascript}</pre>
              </div>
            </div>
          </div>
        )}
      </div>

      {isStreaming && (
        <div className="absolute top-2 right-2">
          <div className="flex items-center space-x-2 bg-[#2D2D2D] px-2 py-1 rounded-md">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-[#CCCCCC]">Generating...</span>
          </div>
        </div>
      )}
    </div>
  );
} 