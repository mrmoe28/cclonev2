'use client';

import { useState } from 'react';
import { ChevronRight, ChevronDown, File, Folder } from 'lucide-react';

interface FileItem {
  name: string;
  type: 'file' | 'folder';
  children?: FileItem[];
}

const initialFiles: FileItem[] = [
  {
    name: 'src',
    type: 'folder',
    children: [
      {
        name: 'components',
        type: 'folder',
        children: [
          { name: 'layout', type: 'folder' },
          { name: 'features', type: 'folder' },
          { name: 'shared', type: 'folder' },
        ],
      },
      {
        name: 'app',
        type: 'folder',
        children: [
          { name: 'layout.tsx', type: 'file' },
          { name: 'page.tsx', type: 'file' },
        ],
      },
    ],
  },
];

export default function Sidebar() {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['src']));

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const renderFileItem = (item: FileItem, path: string = '') => {
    const currentPath = path ? `${path}/${item.name}` : item.name;
    const isExpanded = expandedFolders.has(currentPath);
    const isFolder = item.type === 'folder';

    return (
      <div key={currentPath} className="text-sm">
        <div
          className="flex items-center px-2 py-1 hover:bg-[#2A2D2E] cursor-pointer"
          onClick={() => isFolder && toggleFolder(currentPath)}
        >
          {isFolder ? (
            isExpanded ? (
              <ChevronDown className="w-4 h-4 mr-1" />
            ) : (
              <ChevronRight className="w-4 h-4 mr-1" />
            )
          ) : null}
          {isFolder ? (
            <Folder className="w-4 h-4 mr-1 text-[#CCA700]" />
          ) : (
            <File className="w-4 h-4 mr-1 text-[#519ABA]" />
          )}
          <span>{item.name}</span>
        </div>
        {isFolder && isExpanded && item.children && (
          <div className="ml-4">
            {item.children.map((child) => renderFileItem(child, currentPath))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-[250px] bg-[#252526] border-r border-[#3C3C3C] overflow-y-auto">
      <div className="p-2">
        <div className="text-xs text-[#858585] mb-2">EXPLORER</div>
        {initialFiles.map((item) => renderFileItem(item))}
      </div>
    </div>
  );
} 