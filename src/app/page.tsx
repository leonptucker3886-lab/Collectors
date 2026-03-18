'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '../context/AppContext';
import { HeroCard, StatCard } from '../components/ui';
import CollectionCard from '../components/collection/CollectionCard';
import ItemCard from '../components/item/ItemCard';
import { FiPlus, FiBox, FiFolder, FiArrowRight } from 'react-icons/fi';

export default function Dashboard() {
  const { state, getDashboardStats, getItemsByCollection } = useApp();
  const stats = getDashboardStats();

  return (
    <div className="space-y-6">
      <HeroCard className="text-white">
        <p className="text-white/80 text-sm">Total Portfolio Value</p>
        <p className="text-4xl font-bold mt-1" style={{ fontFamily: 'var(--font-jetbrains)' }}>
          ${stats.totalValue.toLocaleString()}
        </p>
        <div className="flex items-center gap-4 mt-3">
          <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
            {stats.totalItems} items
          </span>
          <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
            {stats.totalCollections} collections
          </span>
        </div>
      </HeroCard>

      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label="Collections"
          value={stats.totalCollections}
          icon={<FiFolder size={20} />}
        />
        <StatCard
          label="Items"
          value={stats.totalItems}
          icon={<FiBox size={20} />}
        />
      </div>

      {stats.categoryBreakdown.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">By Category</h2>
          </div>
          <div className="space-y-2">
            {stats.categoryBreakdown.map((cat) => (
              <div key={cat.category} className="flex items-center justify-between bg-[#242424] rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#FF6B35]/20 flex items-center justify-center text-[#FF6B35]">
                    <FiFolder size={16} />
                  </div>
                  <div>
                    <p className="font-medium text-white text-sm">{cat.category}</p>
                    <p className="text-xs text-[#666]">{cat.count} items</p>
                  </div>
                </div>
                <p className="font-semibold text-[#FFE66D]" style={{ fontFamily: 'var(--font-jetbrains)' }}>
                  ${cat.value.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {stats.recentItems.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Recently Added</h2>
            <Link href="/collections" className="text-sm text-[#FF6B35] flex items-center gap-1">
              View all <FiArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {stats.recentItems.slice(0, 4).map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onClick={() => {}}
              />
            ))}
          </div>
        </div>
      )}

      {state.collections.length > 0 ? (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Your Collections</h2>
            <Link href="/collections" className="text-sm text-[#FF6B35] flex items-center gap-1">
              View all <FiArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {state.collections.slice(0, 4).map((collection) => (
              <CollectionCard
                key={collection.id}
                collection={collection}
                itemCount={getItemsByCollection(collection.id).length}
                totalValue={getItemsByCollection(collection.id).reduce((sum, i) => sum + (i.currentValue || 0), 0)}
                onClick={() => {}}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#242424] flex items-center justify-center">
            <FiPlus size={24} className="text-[#666]" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No collections yet</h3>
          <p className="text-[#666] text-sm mb-4">Start by creating your first collection</p>
          <Link
            href="/collections/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FF6B35] to-[#F7931E] text-white rounded-lg font-medium"
          >
            <FiPlus size={18} />
            Create Collection
          </Link>
        </div>
      )}

      <Link
        href="/add"
        className="fixed bottom-20 md:bottom-6 right-4 md:right-6 w-14 h-14 bg-gradient-to-r from-[#FF6B35] to-[#F7931E] rounded-full flex items-center justify-center text-white shadow-lg hover:scale-105 transition-transform md:hidden"
      >
        <FiPlus size={24} />
      </Link>
    </div>
  );
}
