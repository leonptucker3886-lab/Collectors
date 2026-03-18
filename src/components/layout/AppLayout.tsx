'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';
import BottomNav from './BottomNav';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  showBack?: boolean;
  actions?: ReactNode;
  showLogo?: boolean;
}

export default function AppLayout({ children, title, showBack, actions, showLogo = true }: LayoutProps) {
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
          {showLogo ? (
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF6B35] to-[#F7931E] flex items-center justify-center">
                <span className="text-white font-bold text-sm">CV</span>
              </div>
              <span className="text-lg font-semibold">{title || 'CollectVault'}</span>
            </Link>
          ) : (
            <h1 className="text-lg font-semibold truncate">{title || 'CollectVault'}</h1>
          )}
          <div className="flex items-center gap-2">{actions}</div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-4">{children}</main>
      <BottomNav />
    </div>
  );
}
