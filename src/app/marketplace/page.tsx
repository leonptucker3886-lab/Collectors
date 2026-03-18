'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { FiSearch, FiFilter, FiHeart } from 'react-icons/fi';

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
  sellerAvatar: string;
  createdAt: any;
  status: 'active' | 'sold';
  likes: number;
}

export default function MarketplacePage() {
  const { user, profile } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const { db } = await import('../../lib/firebase');
        const { collection, query, getDocs, orderBy, getCountFromServer } = await import('firebase/firestore');
        
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
    { id: 'other', label: 'Other' },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="sticky top-0 bg-[#0A0A0A]/95 backdrop-blur-sm border-b border-[#1F1F1F] px-4 py-4 z-30">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-light tracking-wide">Marketplace</h1>
          <Link href="/profile" className="w-9 h-9 rounded-full bg-[#1F1F1F] flex items-center justify-center text-lg">
            {profile?.avatar || '👤'}
          </Link>
        </div>
        
        <div className="relative mb-3">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#666]" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-[#141414] border border-[#2A2A2A] rounded-lg text-white placeholder-[#666] focus:outline-none focus:border-[#C0A080]"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                category === cat.id
                  ? 'bg-[#C0A080] text-black'
                  : 'bg-[#1F1F1F] text-[#888] hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-[#666]">Loading...</div>
      ) : filteredListings.length > 0 ? (
        <div className="grid grid-cols-3 gap-0.5 p-0.5 bg-[#0A0A0A]">
          {filteredListings.map(listing => (
            <Link
              key={listing.id}
              href={`/marketplace/${listing.id}`}
              className="bg-[#0A0A0A]"
            >
              <div className="aspect-square bg-[#141414]">
                {listing.images?.[0] ? (
                  <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl opacity-20">□</div>
                )}
              </div>
              <div className="p-2 bg-[#0A0A0A]">
                <p className="text-sm font-medium text-white truncate">{listing.title}</p>
                <p className="text-lg font-light text-[#C0A080]">${listing.price.toLocaleString()}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-5xl mb-4 opacity-20">□</div>
          <h3 className="text-lg text-[#666] mb-2">No listings found</h3>
        </div>
      )}

      <Link
        href="/marketplace/sell"
        className="fixed bottom-20 right-4 w-14 h-14 bg-[#C0A080] rounded-full shadow-lg flex items-center justify-center text-black text-2xl hover:scale-110 transition-transform z-30"
      >
        +
      </Link>
    </div>
  );
}
