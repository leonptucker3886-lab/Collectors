'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { FiPlus, FiFolder, FiBox, FiShield, FiFileText, FiHeart, FiCreditCard, FiTrendingUp } from 'react-icons/fi';

export default function Dashboard() {
  const { state, getDashboardStats } = useApp();
  const { profile } = useAuth();
  const stats = getDashboardStats();
  const needsSubscription = state.collections.length >= 2;

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light tracking-wide">Dashboard</h1>
          <p className="text-[#666] text-sm">{profile?.displayName || 'Collector'}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#141414] rounded-xl p-4 border border-[#1F1F1F]">
          <FiFolder className="text-[#C0A080] mb-2" size={24} />
          <p className="text-2xl font-light">{stats.totalCollections}</p>
          <p className="text-xs text-[#666]">Collections</p>
        </div>
        <div className="bg-[#141414] rounded-xl p-4 border border-[#1F1F1F]">
          <FiBox className="text-[#C0A080] mb-2" size={24} />
          <p className="text-2xl font-light">{stats.totalItems}</p>
          <p className="text-xs text-[#666]">Items</p>
        </div>
        <div className="bg-[#141414] rounded-xl p-4 border border-[#1F1F1F] col-span-2">
          <FiTrendingUp className="text-[#C0A080] mb-2" size={24} />
          <p className="text-3xl font-light text-[#C0A080]">${stats.totalValue.toLocaleString()}</p>
          <p className="text-xs text-[#666]">Total Value</p>
        </div>
      </div>

      {needsSubscription && (
        <div className="bg-[#C0A080]/10 border border-[#C0A080]/30 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <FiCreditCard className="text-[#C0A080]" size={24} />
            <div>
              <h3 className="font-medium text-[#C0A080]">Subscription Required</h3>
              <p className="text-sm text-[#666]">You have {state.collections.length} collections. Upgrade to continue adding more.</p>
            </div>
          </div>
          <button className="mt-3 w-full py-2 bg-[#C0A080] text-black rounded-lg font-medium">
            Subscribe - $9.99/mo
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Link href="/collections" className="bg-[#141414] rounded-xl p-4 border border-[#1F1F1F] hover:border-[#C0A080] transition-colors">
          <FiFolder className="text-[#C0A080] mb-2" size={24} />
          <p className="font-medium">My Vault</p>
          <p className="text-xs text-[#666]">{state.collections.length} collections</p>
        </Link>
        
        <Link href="/collections" className="bg-[#141414] rounded-xl p-4 border border-[#1F1F1F] hover:border-[#C0A080] transition-colors">
          <FiBox className="text-[#C0A080] mb-2" size={24} />
          <p className="font-medium">All Items</p>
          <p className="text-xs text-[#666]">{state.items.length} items</p>
        </Link>

        <Link href="/collections" className="bg-[#141414] rounded-xl p-4 border border-[#1F1F1F] hover:border-[#C0A080] transition-colors">
          <FiShield className="text-[#C0A080] mb-2" size={24} />
          <p className="font-medium">Insurance</p>
          <p className="text-xs text-[#666]">View coverage</p>
        </Link>

        <Link href="/collections" className="bg-[#141414] rounded-xl p-4 border border-[#1F1F1F] hover:border-[#C0A080] transition-colors">
          <FiFileText className="text-[#C0A080] mb-2" size={24} />
          <p className="font-medium">Notes</p>
          <p className="text-xs text-[#666]">Documentation</p>
        </Link>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-light">Recent Items</h2>
          <Link href="/collections" className="text-sm text-[#C0A080]">View All</Link>
        </div>
        
        {state.items.length > 0 ? (
          <div className="space-y-2">
            {state.items.slice(0, 5).map((item) => (
              <Link 
                key={item.id} 
                href={`/item/${item.id}`}
                className="flex items-center gap-3 bg-[#141414] rounded-lg p-3 border border-[#1F1F1F]"
              >
                <div className="w-12 h-12 bg-[#1F1F1F] rounded-lg flex items-center justify-center text-xl">
                  {item.images?.[0] ? (
                    <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    '□'
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{item.name}</p>
                  <p className="text-xs text-[#666]">{item.condition}</p>
                </div>
                <p className="text-[#C0A080]">${item.currentValue?.toLocaleString() || '0'}</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-[#141414] rounded-xl border border-[#1F1F1F]">
            <p className="text-[#666]">No items yet</p>
            <Link href="/collections" className="text-sm text-[#C0A080] mt-2 inline-block">Add your first item →</Link>
          </div>
        )}
      </div>

      <div className="text-center pt-4">
        <Link 
          href="/collections/new" 
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#C0A080] text-black rounded-full font-medium"
        >
          <FiPlus size={20} />
          New Collection
        </Link>
      </div>
    </div>
  );
}
