'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';
import { FiPlus, FiGrid, FiTag, FiArrowRight, FiDollarSign } from 'react-icons/fi';

export default function MarketplacePage() {
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState<'sell' | 'my-listings'>('sell');
  
  const itemsForSale = state.items.filter(item => item.isForSale);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pb-20">
      <div className="sticky top-0 bg-[#0A0A0A] border-b border-[#1F1F1F] px-4 py-3 z-30">
        <h1 className="text-xl font-semibold">Marketplace</h1>
        <p className="text-xs text-[#666]">Sell items from your collection</p>
      </div>

      <div className="flex border-b border-[#1F1F1F]">
        <button
          onClick={() => setActiveTab('sell')}
          className={`flex-1 py-3 text-sm font-medium ${activeTab === 'sell' ? 'text-white border-b-2 border-[#C0A080]' : 'text-[#666]'}`}
        >
          <span className="flex items-center justify-center gap-2">
            <FiTag size={16} />
            Sell
          </span>
        </button>
        <button
          onClick={() => setActiveTab('my-listings')}
          className={`flex-1 py-3 text-sm font-medium ${activeTab === 'my-listings' ? 'text-white border-b-2 border-[#C0A080]' : 'text-[#666]'}`}
        >
          <span className="flex items-center justify-center gap-2">
            <FiGrid size={16} />
            My Listings ({itemsForSale.length})
          </span>
        </button>
      </div>

      <div className="p-4">
        {activeTab === 'sell' ? (
          <div className="space-y-4">
            <div className="bg-[#141414] rounded-xl p-6 border border-[#1F1F1F]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-[#C0A080]/20 flex items-center justify-center">
                  <FiDollarSign size={24} className="text-[#C0A080]" />
                </div>
                <div>
                  <h2 className="font-semibold">List an Item</h2>
                  <p className="text-sm text-[#666]">Put your collection item up for sale</p>
                </div>
              </div>
              
              <p className="text-sm text-[#666] mb-4">
                Select an item from your collection to list on the marketplace.
              </p>

              <Link
                href="/collections"
                className="block w-full py-3 bg-[#C0A080] text-black rounded-lg font-medium text-center"
              >
                Select Item to Sell
              </Link>
            </div>

            <div className="bg-[#141414] rounded-xl p-4 border border-[#1F1F1F]">
              <h3 className="font-medium mb-2">How it works</h3>
              <div className="space-y-2 text-sm text-[#666]">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#1F1F1F] flex items-center justify-center text-xs">1</span>
                  <span>Select an item from your vault</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#1F1F1F] flex items-center justify-center text-xs">2</span>
                  <span>Set your asking price</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#1F1F1F] flex items-center justify-center text-xs">3</span>
                  <span>5% commission on sales</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            {itemsForSale.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {itemsForSale.map(item => (
                  <Link
                    key={item.id}
                    href={`/item/${item.id}`}
                    className="bg-[#141414] rounded-xl border border-[#1F1F1F] overflow-hidden"
                  >
                    <div className="aspect-square bg-[#1F1F1F]">
                      {item.images?.[0] ? (
                        <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">📦</div>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="font-medium text-sm truncate">{item.name}</p>
                      <p className="text-lg font-bold text-[#C0A080]">${item.askingPrice?.toLocaleString() || '0'}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FiTag size={48} className="text-[#2A2A2A] mx-auto mb-4" />
                <h3 className="text-lg text-[#666] mb-2">No listings yet</h3>
                <p className="text-sm text-[#444] mb-4">List items from your collection to sell</p>
                <Link
                  href="/collections"
                  className="inline-block px-6 py-2 bg-[#C0A080] text-black rounded-full text-sm font-medium"
                >
                  Browse Collection
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
