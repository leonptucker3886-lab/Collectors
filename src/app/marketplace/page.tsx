'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { collection, query, where, getDocs, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { FiSearch, FiPlus, FiTag, FiUser } from 'react-icons/fi';

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
}

export default function MarketplacePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
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

    fetchListings();
  }, []);

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = category === 'all' || listing.category === category;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', 'cards', 'records', 'stamps', 'toys', 'sports', 'nft', 'other'];

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center">
        <div className="text-[#FF6B35]">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-4">Sign in to view marketplace</h2>
          <Link href="/login" className="px-6 py-3 bg-gradient-to-r from-[#FF6B35] to-[#F7931E] text-white rounded-lg">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Marketplace</h1>
        <Link
          href="/marketplace/sell"
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FF6B35] to-[#F7931E] text-white rounded-lg text-sm font-medium"
        >
          <FiPlus size={18} />
          Sell
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666]" />
          <input
            type="text"
            placeholder="Search marketplace..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#1A1A1A] border border-[#333] rounded-lg text-white placeholder-[#666] focus:outline-none focus:border-[#FF6B35]"
          />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
              category === cat
                ? 'bg-[#FF6B35] text-white'
                : 'bg-[#242424] text-[#A0A0A0] hover:text-white'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-[#666]">Loading listings...</div>
      ) : filteredListings.length > 0 ? (
        <div className="grid grid-cols-2 gap-3">
          {filteredListings.map(listing => (
            <Link
              key={listing.id}
              href={`/marketplace/${listing.id}`}
              className="bg-[#242424] rounded-xl overflow-hidden hover:-translate-y-1 transition-transform"
            >
              <div className="aspect-square bg-[#1A1A1A]">
                {listing.images?.[0] ? (
                  <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">📦</div>
                )}
              </div>
              <div className="p-3">
                <h3 className="font-medium text-white text-sm truncate">{listing.title}</h3>
                <p className="text-lg font-bold text-[#FFE66D] mt-1" style={{ fontFamily: 'var(--font-jetbrains)' }}>
                  ${listing.price.toLocaleString()}
                </p>
                <p className="text-xs text-[#666] mt-1">{listing.condition}</p>
                <div className="flex items-center gap-1 mt-2 text-xs text-[#666]">
                  <FiUser size={12} />
                  {listing.sellerName}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#242424] flex items-center justify-center">
            <FiTag size={24} className="text-[#666]" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No listings found</h3>
          <p className="text-[#666] text-sm mb-4">Be the first to list something!</p>
          <Link href="/marketplace/sell" className="text-[#FF6B35]">
            Start Selling →
          </Link>
        </div>
      )}
    </div>
  );
}
