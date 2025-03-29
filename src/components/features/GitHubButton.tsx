'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { useToast } from '@/components/ui/use-toast';

export interface GitHubButtonProps {
  currentCode: {
    html: string;
    css: string;
    javascript: string;
  };
}

export function GitHubButton({ currentCode }: GitHubButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCreateRepo = async () => {
    setIsLoading(true);
    try {
      // Check if GitHub token exists
      const token = localStorage.getItem('github_token');
      if (!token) {
        // Redirect to GitHub OAuth
        window.location.href = '/api/auth/github';
        return;
      }

      // Create repository content
      const files = {
        'index.html': currentCode.html,
        'styles.css': currentCode.css,
        'script.js': currentCode.javascript,
        'README.md': `# Generated Code\n\nThis repository contains code generated using the AI Code Generator.`,
      };

      // Create repository
      const response = await fetch('/api/github/create-repo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ files }),
      });

      if (!response.ok) {
        throw new Error('Failed to create repository');
      }

      const data = await response.json();
      
      toast({
        title: 'Success!',
        description: `Repository created at ${data.url}`,
      });

      // Open the repository in a new tab
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Error creating repository:', error);
      toast({
        title: 'Error',
        description: 'Failed to create repository. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleCreateRepo}
      disabled={isLoading}
      className="relative"
      title="Export to GitHub"
    >
      <GitHubLogoIcon className="h-[1.2rem] w-[1.2rem]" />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        </div>
      )}
    </Button>
  );
} 