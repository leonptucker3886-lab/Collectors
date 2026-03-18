'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { FiSearch, FiPlus, FiFilter, FiHeart, FiMessageCircle } from 'react-icons/fi';

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
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();
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
        const { collection, query, where, getDocs, orderBy } = await import('firebase/firestore');
        
        const q = query(
          collection(db, 'listings'),
          where('status', '==', 'active'),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Listing[];
        setListings(data);
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchListings();
    } else {
      setLoading(false);
    }
  }, [user]);

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
    { id: 'all', label: 'All', emoji: '✨' },
    { id: 'cards', label: 'Cards', emoji: '🎴' },
    { id: 'records', label: 'Records', emoji: '💿' },
    { id: 'stamps', label: 'Stamps', emoji: '📮' },
    { id: 'toys', label: 'Toys', emoji: '🧸' },
    { id: 'sports', label: 'Sports', emoji: '⚽' },
    { id: 'nft', label: 'NFT', emoji: '🔗' },
    { id: 'other', label: 'Other', emoji: '📦' },
  ];

  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-[#A855F7]">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Sign in to buy & sell</h2>
          <p className="text-gray-500 mb-6">Join thousands of collectors trading treasures</p>
          <Link href="/login" className="px-8 py-3 bg-[#A855F7] text-white rounded-full font-medium">
            Get Started
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 pb-24">
      <div className="sticky top-0 bg-white z-30 border-b border-gray-100 px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold">Trade</h1>
          <div className="flex items-center gap-2">
            <Link href="/profile" className="w-8 h-8 rounded-full bg-gradient-to-r from-[#A855F7] to-[#6366F1] flex items-center justify-center text-white text-sm">
              {profile?.avatar || '👤'}
            </Link>
          </div>
        </div>
        
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search for treasures..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-full text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A855F7]"
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="p-2.5 bg-gray-100 rounded-full hover:bg-gray-200"
          >
            <FiFilter size={20} className="text-gray-600" />
          </button>
        </div>

        {showFilters && (
          <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 bg-gray-100 rounded-full text-sm focus:outline-none"
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        )}
      </div>

      <div className="flex gap-3 overflow-x-auto px-4 py-3 border-b border-gray-100">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
              category === cat.id
                ? 'bg-[#A855F7] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span>{cat.emoji}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading treasures...</div>
      ) : filteredListings.length > 0 ? (
        <div className="grid grid-cols-3 gap-1 p-1">
          {filteredListings.map(listing => (
            <Link
              key={listing.id}
              href={`/marketplace/${listing.id}`}
              className="bg-white"
            >
              <div className="aspect-square bg-gray-100 relative">
                {listing.images?.[0] ? (
                  <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl">📦</div>
                )}
                {listing.likes > 0 && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-white/80 rounded-full text-xs flex items-center gap-1">
                    <FiHeart size={10} className="text-red-500" /> {listing.likes}
                  </div>
                )}
              </div>
              <div className="p-2">
                <p className="font-bold text-gray-900" style={{ fontFamily: 'var(--font-jetbrains)' }}>
                  ${listing.price.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 truncate mt-0.5">{listing.title}</p>
                <p className="text-xs text-gray-400 mt-1">{listing.condition}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">No treasures found</h3>
          <p className="text-gray-500 text-sm mb-4">Be the first to list something amazing!</p>
          <Link href="/marketplace/sell" className="text-[#A855F7] font-medium">
            Start Selling →
          </Link>
        </div>
      )}

      <Link
        href="/marketplace/sell"
        className="fixed bottom-20 right-4 w-14 h-14 bg-[#A855F7] rounded-full shadow-lg flex items-center justify-center text-white hover:scale-110 transition-transform z-30"
      >
        <FiPlus size={28} />
      </Link>
    </div>
  );
}
