'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { FiSearch, FiHeart, FiClock, FiChevronRight } from 'react-icons/fi';

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  condition: string;
  sellerId: string;
  sellerName: string;
  createdAt: any;
  status: 'active' | 'sold';
  likes: number;
  likedBy?: string[];
}

export default function MarketplacePage() {
  const { user, profile } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [loading, setLoading] = useState(true);
  const [likedItems, setLikedItems] = useState<string[]>([]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const { db } = await import('../../lib/firebase');
        const { collection, query, getDocs, orderBy } = await import('firebase/firestore');
        
        const snapshot = await getDocs(query(collection(db, 'listings'), orderBy('createdAt', 'desc')));
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Listing[];
        setListings(data.filter(l => l.status === 'active'));
      } catch (error) {
        console.error('Error fetching listings:', error);
        setListings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  const handleLike = async (listingId: string) => {
    if (!user) return;
    
    setLikedItems(prev => 
      prev.includes(listingId) 
        ? prev.filter(id => id !== listingId)
        : [...prev, listingId]
    );
  };

  const filteredListings = listings
    .filter(listing => {
      const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = category === 'all' || listing.category === category;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return 0;
    });

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'cards', label: 'Cards' },
    { id: 'records', label: 'Records' },
    { id: 'stamps', label: 'Stamps' },
    { id: 'toys', label: 'Toys' },
    { id: 'sports', label: 'Sports' },
    { id: 'comics', label: 'Comics' },
    { id: 'coins', label: 'Coins' },
    { id: 'art', label: 'Art' },
    { id: 'antiques', label: 'Antiques' },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Header */}
      <header className="sticky top-0 bg-[#0A0A0A] border-b border-[#1F1F1F] z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/profile" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#1F1F1F] flex items-center justify-center">
              <span className="text-sm text-[#888]">👤</span>
            </div>
          </Link>
          <h1 className="text-lg font-semibold tracking-tight">CollectVault</h1>
          <div className="w-8" />
        </div>

        {/* Search */}
        <div className="px-4 pb-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666]" size={18} />
            <input
              type="text"
              placeholder="Search for items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#141414] border border-[#2A2A2A] rounded-lg text-white placeholder-[#666] text-sm focus:outline-none focus:border-[#C0A080] transition-colors"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 px-4 pb-3 overflow-x-auto scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                category === cat.id
                  ? 'bg-white text-black'
                  : 'bg-[#1F1F1F] text-[#888] hover:bg-[#2A2A2A] hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </header>

      {/* Sort */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#1F1F1F]">
        <span className="text-xs text-[#666]">{filteredListings.length} items</span>
        <button 
          onClick={() => setSortBy(sortBy === 'newest' ? 'price-low' : sortBy === 'price-low' ? 'price-high' : 'newest')}
          className="flex items-center gap-1 text-xs text-[#888]"
        >
          {sortBy === 'newest' ? 'Newest' : sortBy === 'price-low' ? 'Price ↑' : 'Price ↓'}
          <FiChevronRight size={14} className="rotate-90" />
        </button>
      </div>

      {/* Listings Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-[#C0A080] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredListings.length > 0 ? (
        <div className="grid grid-cols-2 gap-px bg-[#1F1F1F]">
          {filteredListings.map(listing => (
            <Link
              key={listing.id}
              href={`/marketplace/${listing.id}`}
              className="bg-[#0A0A0A] group"
            >
              <div className="relative aspect-square bg-[#141414] overflow-hidden">
                {listing.images?.[0] ? (
                  <img 
                    src={listing.images[0]} 
                    alt={listing.title} 
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl text-[#2A2A2A]">📦</div>
                )}
                
                {/* Like button */}
                <button
                  onClick={(e) => { e.preventDefault(); handleLike(listing.id); }}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center transition-transform hover:scale-110"
                >
                  <FiHeart 
                    size={14} 
                    className={likedItems.includes(listing.id) ? 'text-red-500 fill-red-500' : 'text-white'} 
                  />
                </button>

                {/* Sold overlay */}
                {listing.status === 'sold' && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white font-medium text-sm px-3 py-1 border border-white rounded">SOLD</span>
                  </div>
                )}
              </div>
              
              <div className="p-3">
                <p className="text-sm font-medium text-white truncate leading-tight">{listing.title}</p>
                <p className="text-lg font-bold text-white mt-1">${listing.price.toLocaleString()}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] text-[#666] bg-[#141414] px-2 py-0.5 rounded capitalize">
                    {listing.condition || 'Used'}
                  </span>
                </div>
                <p className="text-[10px] text-[#444] mt-2 flex items-center gap-1">
                  <FiClock size={10} />
                  Just now
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <div className="text-6xl mb-4 opacity-20">🔍</div>
          <h3 className="text-lg font-medium text-white mb-2">No items found</h3>
          <p className="text-sm text-[#666] text-center">Try adjusting your search or browse all categories</p>
          <button 
            onClick={() => {setSearchQuery(''); setCategory('all');}}
            className="mt-4 px-6 py-2 bg-[#1F1F1F] text-white rounded-full text-sm"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Bottom spacing */}
      <div className="h-24" />

      {/* Sell FAB */}
      <Link
        href="/marketplace/sell"
        className="fixed bottom-20 left-1/2 -translate-x-1/2 px-8 py-3 bg-[#C0A080] rounded-full shadow-lg flex items-center gap-2 hover:scale-105 transition-transform z-30"
      >
        <span className="text-black font-semibold text-sm">Sell</span>
      </Link>
    </div>
  );
}
