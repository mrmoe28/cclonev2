import { useState, useEffect } from 'react';
import { CodeState } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { STORAGE_KEYS } from '@/lib/constants';

export function useCodeState() {
  const [code, setCode] = useState<CodeState>({ html: '', css: '', javascript: '' });
  const [conversation, setConversation] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Load saved state
    const savedCode = localStorage.getItem(STORAGE_KEYS.CODE);
    const savedConversation = localStorage.getItem(STORAGE_KEYS.CONVERSATION);
    if (savedCode) setCode(JSON.parse(savedCode));
    if (savedConversation) setConversation(JSON.parse(savedConversation));
  }, []);

  useEffect(() => {
    // Save state
    localStorage.setItem(STORAGE_KEYS.CODE, JSON.stringify(code));
    localStorage.setItem(STORAGE_KEYS.CONVERSATION, JSON.stringify(conversation));
  }, [code, conversation]);

  const clearCode = () => {
    setCode({ html: '', css: '', javascript: '' });
    setConversation([]);
    localStorage.removeItem(STORAGE_KEYS.CODE);
    localStorage.removeItem(STORAGE_KEYS.CONVERSATION);
  };

  const updateCode = (newCode: CodeState) => {
    setCode(newCode);
  };

  const addToConversation = (messages: string[]) => {
    setConversation(prev => [...prev, ...messages]);
  };

  return {
    code,
    conversation,
    clearCode,
    updateCode,
    addToConversation,
  };
} 