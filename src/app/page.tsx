'use client';

import { useEffect } from 'react';
import { Terminal } from '@/components/layout/Terminal';
import { WebPreview } from '@/components/features/WebPreview';
import { GitHubButton } from '@/components/features/GitHubButton';
import { AIAgent } from '@/lib/aiAgent';
import { useToast } from '@/components/ui/use-toast';
import { useCodeState } from '@/hooks/useCodeState';
import { STORAGE_KEYS } from '@/lib/constants';

export default function Home() {
  const { code, conversation, clearCode, updateCode, addToConversation } = useCodeState();
  const { toast } = useToast();

  useEffect(() => {
    // Check for GitHub token in URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem(STORAGE_KEYS.GITHUB_TOKEN, token);
      // Remove token from URL
      window.history.replaceState({}, '', '/');
      toast({
        title: 'Success!',
        description: 'Successfully connected to GitHub.',
      });
    }
  }, []);

  const handleSubmit = async (prompt: string) => {
    try {
      const agent = new AIAgent();
      const result = await agent.generateCode(prompt, code);
      updateCode(result);
      addToConversation([
        `> ${prompt}`,
        `< Generated code:\n${JSON.stringify(result, null, 2)}`
      ]);
    } catch (error) {
      console.error('Error generating code:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to generate code. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <main className="flex h-screen flex-col overflow-hidden bg-background">
      <div className="flex h-full">
        <div className="flex w-1/2 flex-col">
          <Terminal
            onSubmit={handleSubmit}
            onClear={clearCode}
            isProcessing={false}
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