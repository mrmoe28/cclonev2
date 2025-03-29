'use client';
import React, { useState, useCallback, useEffect } from 'react';
import { Terminal } from './Terminal';
import AICodingPane from './AICodingPane';

export default function SplitPane() {
  const [splitPosition, setSplitPosition] = useState(60); // Default split at 60%
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;

      const container = document.getElementById('split-pane-container');
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const newPosition = ((e.clientX - containerRect.left) / containerRect.width) * 100;
      
      // Limit the split position between 20% and 80%
      setSplitPosition(Math.min(Math.max(newPosition, 20), 80));
    },
    [isDragging]
  );

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div 
      id="split-pane-container"
      className="flex h-full relative"
    >
      <div 
        className="h-full"
        style={{ width: `${splitPosition}%` }}
      >
        <Terminal onSubmit={function (prompt: string): Promise<void> {
          throw new Error('Function not implemented.');
        } } onClear={function (): void {
          throw new Error('Function not implemented.');
        } } isProcessing={false} conversation={[]} />
      </div>

      <div
        className="absolute h-full w-1 bg-[#3C3C3C] cursor-col-resize hover:bg-[#264F78] transition-colors"
        style={{ left: `${splitPosition}%`, transform: 'translateX(-50%)' }}
        onMouseDown={handleMouseDown}
      />

      <div 
        className="h-full"
        style={{ width: `${100 - splitPosition}%` }}
      >
        <AICodingPane />
      </div>
    </div>
  );
} 