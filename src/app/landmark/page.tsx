'use client';

import React from 'react';
import Link from 'next/link';

export default function LandmarkPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pb-20">
      <div className="sticky top-0 bg-[#0A0A0A]/95 backdrop-blur-sm border-b border-[#1F1F1F] px-4 py-3 z-30">
        <h1 className="text-xl font-semibold">Explore</h1>
        <p className="text-xs text-[#666] mt-1">Discover CollectVault</p>
      </div>

      <div className="p-4 space-y-6">
        <div className="bg-gradient-to-r from-[#C0A080]/20 to-transparent rounded-xl p-6 border border-[#C0A080]/30">
          <h2 className="text-xl font-semibold mb-2">Welcome to CollectVault</h2>
          <p className="text-[#888] text-sm mb-4">
            Track, manage, and showcase your collectibles in one beautiful app.
          </p>
          <Link
            href="/collections"
            className="inline-block px-6 py-2 bg-[#C0A080] text-black rounded-full text-sm font-medium"
          >
            Go to My Vault
          </Link>
        </div>

        <div className="bg-[#141414] rounded-xl p-6 border border-[#1F1F1F]">
          <h3 className="font-semibold mb-4">Getting Started</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#C0A080]/20 flex items-center justify-center text-[#C0A080] font-bold">1</div>
              <div>
                <p className="font-medium">Create Collections</p>
                <p className="text-sm text-[#666]">Organize your items by category</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#C0A080]/20 flex items-center justify-center text-[#C0A080] font-bold">2</div>
              <div>
                <p className="font-medium">Add Items</p>
                <p className="text-sm text-[#666]">Track photos, values, and details</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#C0A080]/20 flex items-center justify-center text-[#C0A080] font-bold">3</div>
              <div>
                <p className="font-medium">Watch Value Grow</p>
                <p className="text-sm text-[#666]">Monitor your collection worth over time</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center py-4">
          <p className="text-sm text-[#666]">CollectVault - Your Collection Companion</p>
        </div>
      </div>
    </div>
  );
}
