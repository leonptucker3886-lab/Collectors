'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FiCheck, FiPackage, FiArrowRight } from 'react-icons/fi';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const listingId = searchParams.get('listing');

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#C0A080]/20 flex items-center justify-center">
          <FiCheck size={40} className="text-[#C0A080]" />
        </div>
        
        <h1 className="text-2xl font-semibold mb-2">Payment Successful!</h1>
        <p className="text-[#666] mb-8">
          Thank you for your purchase. The seller has been notified and will ship your item soon.
        </p>

        <div className="bg-[#141414] rounded-xl p-4 border border-[#1F1F1F] mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-[#C0A080]/20 flex items-center justify-center">
              <FiPackage size={24} className="text-[#C0A080]" />
            </div>
            <div className="text-left">
              <p className="text-sm text-[#666]">Order confirmed</p>
              <p className="font-medium">Purchase complete</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Link
            href="/marketplace"
            className="block w-full py-3 bg-[#C0A080] text-black rounded-full font-medium"
          >
            Continue Shopping
          </Link>
          <Link
            href="/profile"
            className="block w-full py-3 bg-[#1F1F1F] text-white rounded-full font-medium"
          >
            View My Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
