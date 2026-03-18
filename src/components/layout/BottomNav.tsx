'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiFolder, FiPlus, FiHeart, FiUser } from 'react-icons/fi';

const navItems = [
  { href: '/', icon: FiHome, label: 'Home' },
  { href: '/collections', icon: FiFolder, label: 'Collections' },
  { href: '/add', icon: FiPlus, label: 'Add' },
  { href: '/wishlist', icon: FiHeart, label: 'Wishlist' },
  { href: '/profile', icon: FiUser, label: 'Profile' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#1A1A1A] border-t border-[#333] z-50 md:hidden">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-16 h-14 rounded-lg transition-colors ${
                isActive
                  ? 'text-[#FF6B35]'
                  : 'text-[#666] hover:text-[#A0A0A0]'
              }`}
            >
              <item.icon size={22} />
              <span className="text-[10px] mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
