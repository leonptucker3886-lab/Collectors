'use client';

import React, { ReactNode } from 'react';
import BottomNav from './BottomNav';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  showBack?: boolean;
  actions?: ReactNode;
}

export default function AppLayout({ children, title, showBack, actions }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white pb-20 md:pb-0">
      <header className="sticky top-0 bg-[#0F0F0F]/95 backdrop-blur-md border-b border-[#333] z-40">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          {showBack && (
            <button
              onClick={() => window.history.back()}
              className="p-2 -ml-2 text-[#A0A0A0] hover:text-white"
            >
              ←
            </button>
          )}
          <h1 className="text-lg font-semibold truncate">{title || 'CollectVault'}</h1>
          <div className="flex items-center gap-2">{actions}</div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-4">{children}</main>
      <BottomNav />
    </div>
  );
}
