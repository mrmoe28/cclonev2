'use client';

import React, { ReactNode } from 'react';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="h-screen flex flex-col">
      <header className="h-[40px] bg-[#2D2D2D] border-b border-[#3C3C3C] flex items-center px-4">
        <div className="flex items-center space-x-2">
          <button 
            className="p-1 hover:bg-[#3C3C3C] rounded"
            title="Toggle Menu"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M5 12h14M12 5l7 7-7 7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <span className="text-sm">VS Code Development Environment</span>
        </div>
      </header>
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
      <footer className="h-[25px] bg-[#2D2D2D] border-t border-[#3C3C3C] flex items-center px-4 text-xs">
        <span>Ready</span>
      </footer>
    </div>
  );
} 