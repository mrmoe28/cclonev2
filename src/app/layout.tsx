import React from 'react';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import 'xterm/css/xterm.css';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VS Code Development Environment",
  description: "A VS Code-like development environment with terminal integration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-[#1E1E1E] text-[#CCCCCC]`}>
        {children}
      </body>
    </html>
  );
} 