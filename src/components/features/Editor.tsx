'use client';

import React from 'react';
import MonacoEditor, { OnChange } from '@monaco-editor/react';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  theme?: string;
  options?: any;
}

export default function Editor({
  value,
  onChange,
  language = 'typescript',
  theme = 'vs-dark',
  options = {}
}: EditorProps) {
  const handleEditorChange: OnChange = (value) => {
    onChange(value?.toString() || '');
  };

  return (
    <div className="h-full w-full">
      <MonacoEditor
        value={value}
        onChange={handleEditorChange}
        language={language}
        theme={theme}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          ...options
        }}
      />
    </div>
  );
} 