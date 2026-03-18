'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';
import CollectionCard from '../../components/collection/CollectionCard';
import { FiPlus, FiSearch, FiGrid, FiList } from 'react-icons/fi';

export default function CollectionsPage() {
  const { state, getItemsByCollection } = useApp();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');

  const filteredCollections = state.collections.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666]" />
          <input
            type="text"
            placeholder="Search collections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#1A1A1A] border border-[#333] rounded-lg text-white placeholder-[#666] focus:outline-none focus:border-[#A855F7]"
          />
        </div>
        <button
          onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          className="p-2.5 bg-[#1A1A1A] border border-[#333] rounded-lg text-[#A0A0A0] hover:text-white"
        >
          {viewMode === 'grid' ? <FiList size={18} /> : <FiGrid size={18} />}
        </button>
      </div>

      {filteredCollections.length > 0 ? (
        <div className={viewMode === 'grid' ? 'grid grid-cols-2 gap-3' : 'space-y-3'}>
          {filteredCollections.map((collection) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              itemCount={getItemsByCollection(collection.id).length}
              totalValue={getItemsByCollection(collection.id).reduce((sum, i) => sum + (i.currentValue || 0), 0)}
              onClick={() => window.location.href = `/collections/${collection.id}`}
            />
          ))}
        </div>
      ) : state.collections.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#242424] flex items-center justify-center">
            <FiPlus size={28} className="text-[#666]" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No collections yet</h3>
          <p className="text-[#666] mb-6">Create your first collection to start cataloging</p>
          <Link
            href="/collections/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#A855F7] to-[#6366F1] text-white rounded-xl font-medium"
          >
            <FiPlus size={20} />
            Create Collection
          </Link>
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-[#666]">No collections match your search</p>
        </div>
      )}
    </div>
  );
}
