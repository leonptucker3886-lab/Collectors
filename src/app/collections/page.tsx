'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';
import CollectionCard from '../../components/collection/CollectionCard';
import { FiPlus, FiSearch, FiGrid, FiList, FiStar, FiLock, FiCreditCard } from 'react-icons/fi';

export default function CollectionsPage() {
  const { state, getItemsByCollection } = useApp();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [showPremiumModal, setShowPremiumModal] = React.useState(false);

  const needsPremium = state.collections.length >= 2;
  const isPremium = false;

  const filteredCollections = state.collections.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddClick = () => {
    if (needsPremium && !isPremium) {
      setShowPremiumModal(true);
    } else {
      window.location.href = '/collections/new';
    }
  };

  return (
    <div className="space-y-4 pb-20">
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666]" />
          <input
            type="text"
            placeholder="Search collections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#141414] border border-[#2A2A2A] rounded-lg text-white placeholder-[#666] focus:outline-none focus:border-[#C0A080]"
          />
        </div>
        <button
          onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          className="p-2.5 bg-[#141414] border border-[#2A2A2A] rounded-lg text-[#666] hover:text-white"
        >
          {viewMode === 'grid' ? <FiList size={18} /> : <FiGrid size={18} />}
        </button>
      </div>

      {needsPremium && !isPremium && (
        <div className="bg-gradient-to-r from-[#C0A080]/20 to-transparent rounded-xl p-4 border border-[#C0A080]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#C0A080]/20 flex items-center justify-center">
              <FiStar className="text-[#C0A080]" size={20} />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-[#C0A080]">Premium Collection Vault</h3>
              <p className="text-xs text-[#666]">You have {state.collections.length} collections. Upgrade to add more.</p>
            </div>
            <button
              onClick={() => setShowPremiumModal(true)}
              className="px-4 py-2 bg-[#C0A080] text-black rounded-lg text-sm font-medium"
            >
              Upgrade
            </button>
          </div>
        </div>
      )}

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
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#141414] flex items-center justify-center">
            <FiPlus size={24} className="text-[#666]" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No collections yet</h3>
          <p className="text-[#666] text-sm mb-4">Start by creating your first collection</p>
          <button
            onClick={handleAddClick}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#C0A080] text-black rounded-full font-medium"
          >
            <FiPlus size={20} />
            Create Collection
          </button>
        </div>
      )}

      {showPremiumModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-[#141414] rounded-2xl p-6 max-w-sm w-full border border-[#2A2A2A]">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#C0A080]/20 flex items-center justify-center">
                <FiStar className="text-[#C0A080]" size={32} />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Premium Vault</h2>
              <p className="text-[#666] text-sm">Unlock unlimited collections and premium features.</p>
            </div>
            
            <div className="bg-[#0A0A0A] rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">Monthly Plan</span>
                <span className="text-[#C0A080] font-bold">$9.99/mo</span>
              </div>
              <ul className="text-sm text-[#666] space-y-2">
                <li className="flex items-center gap-2">✓ Unlimited collections</li>
                <li className="flex items-center gap-2">✓ Priority support</li>
                <li className="flex items-center gap-2">✓ Advanced analytics</li>
                <li className="flex items-center gap-2">✓ Export features</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowPremiumModal(false)}
                className="flex-1 py-3 bg-[#1F1F1F] text-white rounded-lg"
              >
                Maybe Later
              </button>
              <button
                onClick={() => setShowPremiumModal(false)}
                className="flex-1 py-3 bg-[#C0A080] text-black rounded-lg font-medium"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
