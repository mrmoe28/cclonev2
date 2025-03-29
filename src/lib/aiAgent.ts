import OpenAI from 'openai';

interface CodeState {
  html: string;
  css: string;
  javascript: string;
}

export class AIAgent {
  private apiKey: string;
  private conversationHistory: { role: string; content: string }[];
  private currentCode: CodeState;

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || '';
    this.conversationHistory = [];
    this.currentCode = { html: '', css: '', javascript: '' };
  }

  private async makeOpenAIRequest(prompt: string): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a web development expert. Generate HTML, CSS, and JavaScript code based on the user's request. 
            Format your response with code blocks using markdown syntax:
            \`\`\`html
            [HTML code here]
            \`\`\`
            \`\`\`css
            [CSS code here]
            \`\`\`
            \`\`\`javascript
            [JavaScript code here]
            \`\`\`
            Current code state:
            HTML: ${this.currentCode.html}
            CSS: ${this.currentCode.css}
            JavaScript: ${this.currentCode.javascript}`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate code');
    }

    const data = await response.json();
    return data.choices[0].message.content;
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
    this.currentCode = currentCode;
    const response = await this.makeOpenAIRequest(prompt);
    const codeBlocks = this.extractCodeBlocks(response);
    this.currentCode = codeBlocks;
    return codeBlocks;
  }

  public getConversationHistory(): { role: string; content: string }[] {
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