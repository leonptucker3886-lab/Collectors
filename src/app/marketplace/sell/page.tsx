'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { Input, Select, Textarea } from '../../../components/ui/Input';
import { Button } from '../../../components/ui';
import ImageUpload from '../../../components/ui/ImageUpload';
import { FiArrowLeft, FiTag, FiDollarSign, FiAlertTriangle, FiShield } from 'react-icons/fi';

export default function SellPage() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'cards',
    condition: 'Good',
  });
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  const [agreed, setAgreed] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-5xl mb-4">🔐</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Sign in to sell</h2>
          <p className="text-gray-500 mb-6">Create an account to list your items</p>
          <Link href="/login" className="px-8 py-3 bg-[#A855F7] text-white rounded-full font-medium">
            Get Started
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreed) {
      setShowWarning(true);
      return;
    }

    if (!formData.title.trim() || !formData.price) {
      setError('Please fill in required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const price = parseFloat(formData.price);
      const commission = price * 0.05;
      const sellerReceives = price - commission;

      await addDoc(collection(db, 'listings'), {
        title: formData.title,
        description: formData.description,
        price: price,
        category: formData.category,
        condition: formData.condition,
        images: images,
        sellerId: user.uid,
        sellerName: user.displayName || user.email?.split('@')[0] || 'Anonymous',
        createdAt: serverTimestamp(),
        status: 'active',
        commission: commission,
        sellerReceives: sellerReceives,
      });

      router.push('/marketplace');
    } catch (err) {
      setError('Failed to create listing. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: 'cards', label: '🎴 Trading Cards', emoji: '🎴' },
    { value: 'records', label: '💿 Vinyl Records', emoji: '💿' },
    { value: 'stamps', label: '📮 Stamps', emoji: '📮' },
    { value: 'toys', label: '🧸 Action Figures', emoji: '🧸' },
    { value: 'sports', label: '⚽ Sports Memorabilia', emoji: '⚽' },
    { value: 'comics', label: '📚 Comics', emoji: '📚' },
    { value: 'coins', label: '🪙 Coins', emoji: '🪙' },
    { value: 'art', label: '🎨 Art', emoji: '🎨' },
    { value: 'antiques', label: '🏺 Antiques', emoji: '🏺' },
    { value: 'other', label: '📦 Other', emoji: '📦' },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pb-24">
      <div className="sticky top-0 bg-[#0A0A0A] border-b border-[#1F1F1F] px-4 py-3 z-30">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 -ml-2 text-[#666]">
            <FiArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-semibold">List Your Item</h1>
        </div>
      </div>

      <div className="p-4">
        <div className="bg-[#C0A080]/10 border border-[#C0A080]/30 rounded-xl p-4 mb-4">
          <div className="flex items-start gap-3">
            <FiAlertTriangle className="text-[#C0A080] mt-0.5" />
            <div>
              <h3 className="font-medium text-[#C0A080]">Authentication Reminder</h3>
              <p className="text-sm text-[#888] mt-1">
                Buyers are responsible for verifying authenticity.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#1F1F1F] rounded-xl p-4 mb-4">
          <div className="flex items-start gap-3">
            <FiShield className="text-[#C0A080] mt-0.5" />
            <div>
              <h3 className="font-medium text-white">Escrow Protection</h3>
              <p className="text-sm text-[#666] mt-1">
                Payments held in escrow until buyer receives item.
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-900 text-red-400 px-4 py-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Photos (up to 5)</label>
            <ImageUpload
              images={images}
              onChange={setImages}
              maxImages={5}
            />
          </div>

          <Input
            label="Title"
            value={formData.title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, title: e.target.value })}
            placeholder="What are you selling?"
            required
          />

          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe your item in detail..."
            rows={4}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Category"
              value={formData.category}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, category: e.target.value })}
              options={categories}
            />

            <Select
              label="Condition"
              value={formData.condition}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, condition: e.target.value })}
              options={[
                { value: 'Mint', label: 'Mint' },
                { value: 'Near Mint', label: 'Near Mint' },
                { value: 'Excellent', label: 'Excellent' },
                { value: 'Good', label: 'Good' },
                { value: 'Fair', label: 'Fair' },
                { value: 'Poor', label: 'Poor' },
              ]}
            />
          </div>

          <Input
            label="Price ($)"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, price: e.target.value })}
            placeholder="0.00"
            required
          />

          {formData.price && parseFloat(formData.price) > 0 && (
            <div className="p-4 bg-[#141414] rounded-xl space-y-2 text-sm border border-[#1F1F1F]">
              <div className="flex justify-between">
                <span className="text-[#666]">Sale Price</span>
                <span className="text-white font-medium">${parseFloat(formData.price).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#666]">Commission (5%)</span>
                <span className="text-red-400">-${(parseFloat(formData.price) * 0.05).toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#1F1F1F]">
                <span className="text-[#666]">You Receive</span>
                <span className="text-[#C0A080] font-bold">${(parseFloat(formData.price) * 0.95).toFixed(2)}</span>
              </div>
            </div>
          )}

          <label className="flex items-start gap-3 p-4 bg-[#141414] rounded-xl cursor-pointer border border-[#1F1F1F]">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 w-5 h-5 rounded text-[#C0A080]"
            />
            <span className="text-sm text-[#666]">
              I confirm this is my item and I have read the <Link href="/help" className="text-[#C0A080] underline">terms of service</Link>.
            </span>
          </label>

          <Button type="submit" loading={loading} className="w-full py-4 text-lg">
            <FiTag size={20} className="mr-2" />
            List for Sale
          </Button>
        </form>
      </div>
    </div>
  );
}
