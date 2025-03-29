'use client';

import React from 'react';
import Editor from '@monaco-editor/react';
import { editor } from 'monaco-editor';

interface CodePreviewProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  theme?: string;
  options?: editor.IStandaloneEditorConstructionOptions;
}

export default function CodePreview({ value, onChange, language, theme = 'vs-dark', options = {} }: CodePreviewProps) {
  return (
    <Editor
      height="100%"
      defaultLanguage={language}
      defaultValue={value}
      value={value}
      onChange={(value) => onChange(value || '')}
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
  );
} 