Set up the frontend according to the following prompt:
  <frontend-prompt>
  Create detailed components with these requirements:
  1. Use 'use client' directive for client-side components
  2. Make sure to concatenate strings correctly using backslash
  3. Style with Tailwind CSS utility classes for responsive design
  4. Use Lucide React for icons (from lucide-react package). Do NOT use other UI libraries unless requested
  5. Use stock photos from picsum.photos where appropriate, only valid URLs you know exist
  6. Configure next.config.js image remotePatterns to enable stock photos from picsum.photos
  7. Create root layout.tsx page that wraps necessary navigation items to all pages
  8. MUST implement the navigation elements items in their rightful place i.e. Left sidebar, Top header
  9. Accurately implement necessary grid layouts
  10. Follow proper import practices:
     - Use @/ path aliases
     - Keep component imports organized
     - Update current src/app/page.tsx with new comprehensive code
     - Don't forget root route (page.tsx) handling
     - You MUST complete the entire prompt before stopping
  </frontend-prompt>

  <summary_title>
VS Code-based Development Environment UI with Terminal Integration
</summary_title>

<image_analysis>
1. Navigation Elements:
- Primary navigation: components, services, lib (as specified)
- Top bar contains file tabs and controls
- Left sidebar shows file explorer with expandable folders
- Bottom panel includes terminal and output tabs
- VS Code standard toolbar with run/debug controls

2. Layout Components:
- Main editor window: ~70% of viewport height
- Terminal panel: ~30% of viewport height
- Left sidebar: ~250px width
- File tabs height: ~40px
- Status bar: ~25px height

3. Content Sections:
- Main editor area showing README.md
- File explorer showing project structure:
  - components/
  - services/
  - lib/
  - Various .tsx and configuration files
- Terminal output showing npm installation
- Problems panel with markdown warnings

4. Interactive Controls:
- Run button in top toolbar
- File explorer expand/collapse controls
- Terminal input line
- Tab switching controls
- Search functionality in problems panel

5. Colors:
- Background: #1E1E1E (VS Code dark theme)
- Text: #CCCCCC
- Active tab: #2D2D2D
- Terminal text: #FFFFFF
- Warning icons: #CCA700
- File icons: Various theme colors

6. Grid/Layout Structure:
- 3-column layout (explorer, editor, optional details)
- Vertical split between editor and terminal
- Horizontal tabs for file management
- Flexible grid system for panel resizing
</image_analysis>

<development_planning>
1. Project Structure:
```
src/
├── components/
│   ├── layout/
│   │   ├── MainLayout.tsx
│   │   ├── Sidebar.tsx
│   │   └── Terminal.tsx
│   ├── features/
│   │   ├── FileExplorer.tsx
│   │   └── Editor.tsx
│   └── shared/
├── assets/
├── styles/
├── hooks/
└── utils/
```

2. Key Features:
- File system navigation and management
- Integrated terminal functionality
- Code editor with syntax highlighting
- Project structure visualization
- Run/debug capabilities
- Real-time problem reporting

3. State Management:
```typescript
interface AppState {
  editor: {
    currentFile: string;
    openFiles: string[];
    editorContent: string;
  },
  terminal: {
    history: string[];
    currentCommand: string;
    isRunning: boolean;
  },
  fileExplorer: {
    expandedFolders: string[];
    selectedFile: string;
  }
}
```

4. Component Architecture:
- MainLayout (container)
  - Sidebar (file explorer)
  - EditorPane (code editing)
  - TerminalPane (command execution)
  - StatusBar (app status)
  - Toolbar (actions)

5. Responsive Breakpoints:
```scss
$breakpoints: (
  'small': 768px,
  'medium': 1024px,
  'large': 1280px,
  'xlarge': 1440px
);
```
</development_planning>