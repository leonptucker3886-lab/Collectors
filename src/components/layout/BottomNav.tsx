'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiFolder, FiHeart, FiUser, FiTag, FiMessageSquare, FiPlus } from 'react-icons/fi';

const navItems = [
  { href: '/', icon: FiHome, label: 'Home' },
  { href: '/collections', icon: FiFolder, label: 'Collections' },
  { href: '/wishlist', icon: FiHeart, label: 'Wishlist' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#1A1A1A] border-t border-[#333] z-50 md:hidden">
      <div className="flex items-center justify-between h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 py-2 rounded-xl transition-all ${
                isActive
                  ? 'text-[#FF6B35] bg-[#FF6B35]/10'
                  : 'text-[#666] hover:text-[#A0A0A0]'
              }`}
            >
              <item.icon size={22} />
              <span className="text-[10px] mt-1 font-medium">{item.label}</span>
            </Link>
          );
        })}
        
        <Link
          href="/marketplace/sell"
          className="flex flex-col items-center justify-center w-12 h-12 -mt-4 bg-gradient-to-r from-[#FF6B35] to-[#F7931E] rounded-full shadow-lg hover:scale-105 transition-transform"
        >
          <FiPlus size={24} className="text-white" />
        </Link>

        <Link
          href="/forum"
          className={`flex flex-col items-center justify-center flex-1 py-2 rounded-xl transition-all ${
            pathname.startsWith('/forum')
              ? 'text-[#FF6B35] bg-[#FF6B35]/10'
              : 'text-[#666] hover:text-[#A0A0A0]'
          }`}
        >
          <FiMessageSquare size={22} />
          <span className="text-[10px] mt-1 font-medium">Forum</span>
        </Link>

        <Link
          href="/marketplace"
          className={`flex flex-col items-center justify-center flex-1 py-2 rounded-xl transition-all ${
            pathname.startsWith('/marketplace')
              ? 'text-[#FF6B35] bg-[#FF6B35]/10'
              : 'text-[#666] hover:text-[#A0A0A0]'
          }`}
        >
          <FiTag size={22} />
          <span className="text-[10px] mt-1 font-medium">Market</span>
        </Link>
      </div>
    </nav>
  );
}
