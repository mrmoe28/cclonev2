# AI Code Generator with Live Preview

A VS Code-like development environment with AI-powered code generation and live preview capabilities.

## Features

- 🤖 AI-powered code generation using OpenAI GPT-3.5
- 👀 Live preview of generated code
- 💾 Persistent state across sessions
- 📝 Multi-language support (HTML, CSS, JavaScript)
- 🎨 VS Code-like interface
- 🔄 Conversation memory for contextual updates

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ai-code-generator.git
cd ai-code-generator
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory and add your OpenAI API key:
```env
NEXT_PUBLIC_OPENAI_API_KEY=your_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Enter a prompt describing the code you want to generate
2. The AI will generate HTML, CSS, and JavaScript code
3. View the live preview in the right pane
4. Make modifications in the editor tabs
5. Use the conversation memory to refine and update the code

## Project Structure

```
src/
├── app/                   # Next.js app directory
├── components/           
│   ├── features/         # Feature components
│   │   ├── Editor.tsx
│   │   └── WebPreview.tsx
│   └── layout/          # Layout components
│       ├── Terminal.tsx
│       └── SplitPane.tsx
├── lib/                  # Utilities and services
│   └── aiAgent.ts       # AI code generation service
└── styles/              # Global styles
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- OpenAI for the GPT-3.5 API
- Next.js team for the amazing framework
- Monaco Editor for the code editing capabilities
