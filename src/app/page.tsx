'use client';

import { useEffect, useState } from 'react';
import { Terminal } from '@/components/layout/Terminal';
import { WebPreview } from '@/components/features/WebPreview';
import { GitHubButton } from '@/components/features/GitHubButton';
import { AIAgent } from '@/lib/aiAgent';
import { useToast } from '@/components/ui/use-toast';

interface CodeState {
  html: string;
  css: string;
  javascript: string;
}

export default function Home() {
  const [code, setCode] = useState<CodeState>({ html: '', css: '', javascript: '' });
  const [conversation, setConversation] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check for GitHub token in URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('github_token', token);
      // Remove token from URL
      window.history.replaceState({}, '', '/');
      toast({
        title: 'Success!',
        description: 'Successfully connected to GitHub.',
      });
    }

    // Load saved state
    const savedCode = localStorage.getItem('code');
    const savedConversation = localStorage.getItem('conversation');
    if (savedCode) setCode(JSON.parse(savedCode));
    if (savedConversation) setConversation(JSON.parse(savedConversation));
  }, []);

  useEffect(() => {
    // Save state
    localStorage.setItem('code', JSON.stringify(code));
    localStorage.setItem('conversation', JSON.stringify(conversation));
  }, [code, conversation]);

  const handleSubmit = async (prompt: string) => {
    setIsProcessing(true);
    try {
      const agent = new AIAgent();
      const result = await agent.generateCode(prompt, code);
      setCode(result);
      setConversation([...conversation, `> ${prompt}`, `< Generated code:\n${JSON.stringify(result, null, 2)}`]);
    } catch (error) {
      console.error('Error generating code:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate code. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClearCode = () => {
    setCode({ html: '', css: '', javascript: '' });
    setConversation([]);
    localStorage.removeItem('code');
    localStorage.removeItem('conversation');
  };

  return (
    <main className="flex h-screen flex-col overflow-hidden bg-background">
      <div className="flex h-full">
        <div className="flex w-1/2 flex-col">
          <Terminal
            onSubmit={handleSubmit}
            onClear={handleClearCode}
            isProcessing={isProcessing}
            conversation={conversation}
          />
        </div>
        <div className="relative flex w-1/2 flex-col overflow-hidden">
          <div className="absolute right-4 top-4 z-10">
            <GitHubButton currentCode={code} />
          </div>
          <WebPreview code={code} />
        </div>
      </div>
    </main>
  );
} 