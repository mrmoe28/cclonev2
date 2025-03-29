import OpenAI from 'openai';
import { CodeState, ConversationMessage } from '@/types';
import { OPENAI_API_URL, OPENAI_MODEL, SYSTEM_PROMPT, ERROR_MESSAGES } from './constants';

export class AIAgentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AIAgentError';
  }
}

export class AIAgent {
  private apiKey: string;
  private conversationHistory: ConversationMessage[];
  private currentCode: CodeState;

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || '';
    if (!this.apiKey) {
      throw new AIAgentError(ERROR_MESSAGES.API_KEY_MISSING);
    }
    this.conversationHistory = [];
    this.currentCode = { html: '', css: '', javascript: '' };
  }

  private async makeOpenAIRequest(prompt: string): Promise<string> {
    try {
      const response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: OPENAI_MODEL,
          messages: [
            {
              role: 'system',
              content: this.getSystemPrompt(),
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new AIAgentError(error.error?.message || ERROR_MESSAGES.API_ERROR);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      if (error instanceof AIAgentError) {
        throw error;
      }
      throw new AIAgentError(ERROR_MESSAGES.API_ERROR);
    }
  }

  private getSystemPrompt(): string {
    return `${SYSTEM_PROMPT}
    Current code state:
    HTML: ${this.currentCode.html}
    CSS: ${this.currentCode.css}
    JavaScript: ${this.currentCode.javascript}`;
  }

  private extractCodeBlocks(response: string): CodeState {
    const htmlMatch = response.match(/```html\n([\s\S]*?)```/);
    const cssMatch = response.match(/```css\n([\s\S]*?)```/);
    const jsMatch = response.match(/```javascript\n([\s\S]*?)```/);

    return {
      html: htmlMatch ? htmlMatch[1].trim() : this.currentCode.html,
      css: cssMatch ? cssMatch[1].trim() : this.currentCode.css,
      javascript: jsMatch ? jsMatch[1].trim() : this.currentCode.javascript,
    };
  }

  public async generateCode(prompt: string, currentCode: CodeState): Promise<CodeState> {
    try {
      this.currentCode = currentCode;
      const response = await this.makeOpenAIRequest(prompt);
      const codeBlocks = this.extractCodeBlocks(response);
      this.currentCode = codeBlocks;
      this.conversationHistory.push(
        { role: 'user', content: prompt },
        { role: 'assistant', content: response }
      );
      return codeBlocks;
    } catch (error) {
      if (error instanceof AIAgentError) {
        throw error;
      }
      throw new AIAgentError(ERROR_MESSAGES.GENERATION_ERROR);
    }
  }

  public getConversationHistory(): ConversationMessage[] {
    return this.conversationHistory;
  }

  public clearHistory(): void {
    this.conversationHistory = [];
    this.currentCode = {
      html: '',
      css: '',
      javascript: ''
    };
  }
} 