export interface CodeState {
  html: string;
  css: string;
  javascript: string;
}

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface GitHubRepo {
  name: string;
  description: string;
  html_url: string;
  private: boolean;
}

export interface WebPreviewProps {
  code: CodeState;
  isStreaming?: boolean;
}

export interface TerminalProps {
  onSubmit: (prompt: string) => void;
  onClear: () => void;
  isProcessing: boolean;
  conversation: string[];
}

export interface GitHubButtonProps {
  currentCode: CodeState;
} 