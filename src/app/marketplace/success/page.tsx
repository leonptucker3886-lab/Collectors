'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FiCheck, FiPackage } from 'react-icons/fi';

function SuccessContent() {
  const searchParams = useSearchParams();
  const listingId = searchParams.get('listing');

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#C0A080]/20 flex items-center justify-center">
          <FiCheck size={40} className="text-[#C0A080]" />
        </div>
        
        <h1 className="text-2xl font-semibold mb-2">Listing Updated!</h1>
        <p className="text-[#666] mb-8">
          Your item has been listed on the marketplace.
        </p>

        <div className="bg-[#141414] rounded-xl p-4 border border-[#1F1F1F] mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-[#C0A080]/20 flex items-center justify-center">
              <FiPackage size={24} className="text-[#C0A080]" />
            </div>
            <div className="text-left">
              <p className="text-sm text-[#666]">Listing created</p>
              <p className="font-medium">Now visible to buyers</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Link
            href="/marketplace"
            className="block w-full py-3 bg-[#C0A080] text-black rounded-full font-medium"
          >
            View Marketplace
          </Link>
          <Link
            href="/collections"
            className="block w-full py-3 bg-[#1F1F1F] text-white rounded-full font-medium"
          >
            Back to Vault
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#C0A080] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
