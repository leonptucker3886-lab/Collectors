'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiFolder, FiHeart, FiUser, FiPlus } from 'react-icons/fi';

const navItems = [
  { href: '/', icon: FiHome, label: 'Home' },
  { href: '/collections', icon: FiFolder, label: 'Collections' },
  { href: '/wishlist', icon: FiHeart, label: 'Wishlist' },
  { href: '/profile', icon: FiUser, label: 'Profile' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#1A1A1A] border-t border-[#333] z-50 md:hidden">
      <div className="flex items-center justify-between h-16 px-4">
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
              <item.icon size={24} />
              <span className="text-[11px] mt-1 font-medium">{item.label}</span>
            </Link>
          );
        })}
        
        <Link
          href="/add"
          className="flex flex-col items-center justify-center w-14 h-14 -mt-4 bg-gradient-to-r from-[#FF6B35] to-[#F7931E] rounded-full shadow-lg hover:scale-105 transition-transform"
        >
          <FiPlus size={28} className="text-white" />
        </Link>
        
        <div className="flex-1" />
      </div>
    </nav>
  );
}
