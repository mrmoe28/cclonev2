export const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
export const OPENAI_MODEL = 'gpt-3.5-turbo';

export const STORAGE_KEYS = {
  CODE: 'code',
  CONVERSATION: 'conversation',
  GITHUB_TOKEN: 'github_token',
} as const;

export const SYSTEM_PROMPT = `You are a web development expert. Generate HTML, CSS, and JavaScript code based on the user's request. 
Format your response with code blocks using markdown syntax:
\`\`\`html
[HTML code here]
\`\`\`
\`\`\`css
[CSS code here]
\`\`\`
\`\`\`javascript
[JavaScript code here]
\`\`\``;

export const ERROR_MESSAGES = {
  API_KEY_MISSING: 'OpenAI API key is not configured',
  API_ERROR: 'Failed to communicate with OpenAI API',
  GENERATION_ERROR: 'Failed to generate code',
} as const; 