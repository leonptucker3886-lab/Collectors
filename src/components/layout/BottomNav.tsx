'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiFolder, FiUser, FiPlus, FiMessageCircle, FiMapPin, FiGrid } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';

export default function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#0A0A0A] border-t border-[#1F1F1F] z-50 md:hidden">
      <div className="flex items-center justify-between h-14 px-1">
        <Link
          href="/landmark"
          className={`flex flex-col items-center justify-center flex-1 py-1 ${
            pathname === '/landmark'
              ? 'text-white'
              : 'text-[#666]'
          }`}
        >
          <FiMapPin size={20} />
          <span className="text-[9px] mt-0.5">Explore</span>
        </Link>

        <Link
          href="/collections"
          className={`flex flex-col items-center justify-center flex-1 py-1 ${
            pathname.startsWith('/collections')
              ? 'text-white'
              : 'text-[#666]'
          }`}
        >
          <FiGrid size={20} />
          <span className="text-[9px] mt-0.5">My Vault</span>
        </Link>

        <Link
          href="/marketplace/sell"
          className="flex flex-col items-center justify-center w-12 h-12 -mt-4 bg-[#C0A080] rounded-full shadow-lg"
        >
          <FiPlus size={24} className="text-black" />
        </Link>

        <Link
          href="/forum"
          className={`flex flex-col items-center justify-center flex-1 py-1 ${
            pathname.startsWith('/forum')
              ? 'text-white'
              : 'text-[#666]'
          }`}
        >
          <FiMessageCircle size={20} />
          <span className="text-[9px] mt-0.5">Forum</span>
        </Link>

        <Link
          href="/profile"
          className={`flex flex-col items-center justify-center flex-1 py-1 ${
            pathname.startsWith('/profile')
              ? 'text-white'
              : 'text-[#666]'
          }`}
        >
          <FiUser size={20} />
          <span className="text-[9px] mt-0.5">Profile</span>
        </Link>
      </div>
    </nav>
  );
}
