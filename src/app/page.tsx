'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { FiGrid, FiBox, FiDollarSign, FiTrendingUp, FiStar, FiPlus } from 'react-icons/fi';

export default function DashboardPage() {
  const { state, getDashboardStats } = useApp();
  const { profile } = useAuth();
  const stats = getDashboardStats();

  return (
    <div className="space-y-6 pb-20">
      <div className="bg-gradient-to-r from-[#C0A080]/20 to-transparent rounded-xl p-4 border border-[#C0A080]/30">
        <h1 className="text-2xl font-light tracking-wide text-white">Dashboard</h1>
        <p className="text-[#666] text-sm mt-1">{profile?.displayName || 'Collector'}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#141414] rounded-xl p-4 border border-[#1F1F1F]">
          <FiGrid className="text-[#C0A080] mb-2" size={24} />
          <p className="text-2xl font-light">{stats.totalCollections}</p>
          <p className="text-xs text-[#666]">Collections</p>
        </div>
        <div className="bg-[#141414] rounded-xl p-4 border border-[#1F1F1F]">
          <FiBox className="text-[#C0A080] mb-2" size={24} />
          <p className="text-2xl font-light">{stats.totalItems}</p>
          <p className="text-xs text-[#666]">Items</p>
        </div>
        <div className="bg-[#141414] rounded-xl p-4 border border-[#1F1F1F] col-span-2">
          <FiDollarSign className="text-[#C0A080] mb-2" size={24} />
          <p className="text-3xl font-light text-[#C0A080]">${stats.totalValue.toLocaleString()}</p>
          <p className="text-xs text-[#666]">Total Value</p>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-light mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          <Link href="/collections/new" className="flex items-center gap-3 p-4 bg-[#141414] rounded-xl border border-[#1F1F1F] hover:border-[#C0A080] transition-colors">
            <div className="w-10 h-10 rounded-full bg-[#C0A080]/20 flex items-center justify-center">
              <FiPlus className="text-[#C0A080]" size={20} />
            </div>
            <div>
              <p className="font-medium">New Collection</p>
              <p className="text-xs text-[#666]">Create a vault</p>
            </div>
          </Link>
          <Link href="/collections" className="flex items-center gap-3 p-4 bg-[#141414] rounded-xl border border-[#1F1F1F] hover:border-[#C0A080] transition-colors">
            <div className="w-10 h-10 rounded-full bg-[#C0A080]/20 flex items-center justify-center">
              <FiGrid className="text-[#C0A080]" size={20} />
            </div>
            <div>
              <p className="font-medium">Browse Vault</p>
              <p className="text-xs text-[#666]">View all items</p>
            </div>
          </Link>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-light mb-3">Recent Items</h2>
        {state.items.length > 0 ? (
          <div className="space-y-2">
            {state.items.slice(0, 5).map((item) => (
              <Link 
                key={item.id} 
                href={`/item/${item.id}`}
                className="flex items-center gap-3 p-3 bg-[#141414] rounded-lg border border-[#1F1F1F]"
              >
                <div className="w-12 h-12 bg-[#1F1F1F] rounded-lg flex items-center justify-center overflow-hidden">
                  {item.images?.[0] ? (
                    <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <FiBox className="text-[#444]" />
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
    </div>
  );
}
