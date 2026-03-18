'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiTrendingUp, FiStar, FiClock, FiMapPin, FiUsers, FiArrowRight } from 'react-icons/fi';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface FeaturedCollection {
  id: string;
  name: string;
  description: string;
  image: string;
  itemCount: number;
  ownerName: string;
}

interface TopSeller {
  uid: string;
  displayName: string;
  salesCount: number;
  rating: number;
}

interface TrendingItem {
  id: string;
  title: string;
  price: number;
  image: string;
  views: number;
}

export default function LandmarkPage() {
  const [featuredCollections, setFeaturedCollections] = useState<FeaturedCollection[]>([]);
  const [topSellers, setTopSellers] = useState<TopSeller[]>([]);
  const [trendingItems, setTrendingItems] = useState<TrendingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const listingsQuery = query(
          collection(db, 'listings'),
          where('status', '==', 'active'),
          orderBy('createdAt', 'desc'),
          limit(10)
        );
        const listingsSnap = await getDocs(listingsQuery);
        
        const trending = listingsSnap.docs.slice(0, 6).map(d => ({
          id: d.id,
          title: d.data().title,
          price: d.data().price,
          image: d.data().images?.[0] || '',
          views: d.data().views || 0,
        })) as TrendingItem[];
        
        setTrendingItems(trending);

        const usersQuery = query(
          collection(db, 'users'),
          limit(5)
        );
        const usersSnap = await getDocs(usersQuery);
        
        const sellers = usersSnap.docs.map(d => ({
          uid: d.id,
          displayName: d.data().displayName || 'Anonymous',
          salesCount: d.data().tradeCount || 0,
          rating: 4.5 + Math.random() * 0.5,
        })).sort((a, b) => b.salesCount - a.salesCount);
        
        setTopSellers(sellers);

        setFeaturedCollections([
          {
            id: '1',
            name: 'Vintage Trading Cards',
            description: 'Rare cards from the 90s era',
            image: '',
            itemCount: 156,
            ownerName: 'CardMaster',
          },
          {
            id: '2',
            name: 'Retro Gaming',
            description: 'Classic consoles and games',
            image: '',
            itemCount: 89,
            ownerName: 'GameCollector',
          },
          {
            id: '3',
            name: 'Antique Coins',
            description: 'Historical coins from around the world',
            image: '',
            itemCount: 234,
            ownerName: 'CoinHunter',
          },
        ]);
      } catch (error) {
        console.error('Error fetching landmark data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pb-20">
      <div className="sticky top-0 bg-[#0A0A0A]/95 backdrop-blur-sm border-b border-[#1F1F1F] px-4 py-3 z-30">
        <div className="flex items-center gap-2">
          <FiMapPin className="text-[#C0A080]" size={24} />
          <h1 className="text-xl font-semibold">CollectVault</h1>
        </div>
        <p className="text-xs text-[#666] mt-1">The premier marketplace for collectors</p>
      </div>

      <div className="p-4 space-y-6">
        <div className="bg-gradient-to-r from-[#C0A080]/20 to-transparent rounded-xl p-4 border border-[#C0A080]/30">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FiStar className="text-[#C0A080]" />
            Welcome to CollectVault
          </h2>
          <p className="text-sm text-[#888] mt-1">
            Buy, sell, and trade collectibles with thousands of collectors worldwide.
          </p>
          <div className="flex gap-3 mt-4">
            <Link
              href="/marketplace"
              className="flex-1 py-2 bg-[#C0A080] text-black rounded-lg text-sm font-medium text-center"
            >
              Browse
            </Link>
            <Link
              href="/marketplace/sell"
              className="flex-1 py-2 bg-[#1F1F1F] text-white rounded-lg text-sm font-medium text-center"
            >
              Sell
            </Link>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold flex items-center gap-2">
              <FiTrendingUp className="text-[#C0A080]" />
              Trending Now
            </h3>
            <Link href="/marketplace" className="text-xs text-[#C0A080] flex items-center gap-1">
              See all <FiArrowRight size={12} />
            </Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-[#C0A080] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {trendingItems.slice(0, 4).map(item => (
                <Link
                  key={item.id}
                  href={`/marketplace/${item.id}`}
                  className="bg-[#141414] rounded-xl border border-[#1F1F1F] overflow-hidden"
                >
                  <div className="aspect-square bg-[#1F1F1F]">
                    {item.image ? (
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">📦</div>
                    )}
                  </div>
                  <div className="p-2">
                    <p className="text-sm font-medium truncate">{item.title}</p>
                    <p className="text-lg font-bold text-[#C0A080]">${item.price.toLocaleString()}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold flex items-center gap-2">
              <FiUsers className="text-[#C0A080]" />
              Top Sellers
            </h3>
          </div>
          
          <div className="space-y-2">
            {topSellers.map((seller, index) => (
              <Link
                key={seller.uid}
                href={`/user/${seller.uid}`}
                className="flex items-center gap-3 p-3 bg-[#141414] rounded-xl border border-[#1F1F1F]"
              >
                <div className="w-10 h-10 rounded-full bg-[#1F1F1F] flex items-center justify-center text-[#C0A080] font-semibold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{seller.displayName}</p>
                  <p className="text-xs text-[#666]">{seller.salesCount} sales</p>
                </div>
                <div className="flex items-center gap-1 text-[#C0A080]">
                  <FiStar size={14} className="fill-current" />
                  <span className="text-sm">{seller.rating.toFixed(1)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold flex items-center gap-2">
              <FiClock className="text-[#C0A080]" />
              Recently Listed
            </h3>
          </div>
          
          <div className="space-y-2">
            {trendingItems.slice(0, 5).map(item => (
              <Link
                key={item.id}
                href={`/marketplace/${item.id}`}
                className="flex items-center gap-3 p-3 bg-[#141414] rounded-xl border border-[#1F1F1F]"
              >
                <div className="w-12 h-12 rounded-lg bg-[#1F1F1F] flex items-center justify-center overflow-hidden">
                  {item.image ? (
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl">📦</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{item.title}</p>
                  <p className="text-sm text-[#C0A080] font-bold">${item.price.toLocaleString()}</p>
                </div>
                <FiArrowRight size={16} className="text-[#444]" />
              </Link>
            ))}
          </div>
        </div>

        <div className="text-center py-4">
          <p className="text-sm text-[#666]">Join thousands of collectors today</p>
          <Link
            href="/login"
            className="inline-block mt-3 px-8 py-3 bg-[#C0A080] text-black rounded-full font-medium"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}
