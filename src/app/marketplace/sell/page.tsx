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
import { FiArrowLeft, FiTag, FiDollarSign } from 'react-icons/fi';

export default function SellPage() {
  const router = useRouter();
  const { user } = useAuth();
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

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-4">Sign in to sell</h2>
          <Link href="/login" className="px-6 py-3 bg-gradient-to-r from-[#A855F7] to-[#6366F1] text-white rounded-lg">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="p-2 text-[#A0A0A0]">
          <FiArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-semibold">Create Listing</h1>
      </div>

      <div className="bg-[#242424] rounded-xl p-4 border border-[#333]">
        <div className="flex items-center gap-2 text-[#4ECDC4] text-sm mb-4">
          <FiDollarSign size={16} />
          <span>5% commission on all sales</span>
        </div>
      </div>

      {error && (
        <div className="bg-[#FF4757]/10 border border-[#FF4757] text-[#FF4757] px-4 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <ImageUpload
          images={images}
          onChange={setImages}
          maxImages={5}
        />

        <div className="space-y-4">
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
            placeholder="Describe your item..."
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Category"
              value={formData.category}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, category: e.target.value })}
              options={[
                { value: 'cards', label: 'Cards' },
                { value: 'records', label: 'Records' },
                { value: 'stamps', label: 'Stamps' },
                { value: 'toys', label: 'Toys' },
                { value: 'sports', label: 'Sports' },
                { value: 'nft', label: 'NFT' },
                { value: 'other', label: 'Other' },
              ]}
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
            <div className="p-4 bg-[#242424] rounded-lg space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#666]">Sale Price</span>
                <span className="text-white">${parseFloat(formData.price).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#666]">Commission (5%)</span>
                <span className="text-[#FF4757]">-${(parseFloat(formData.price) * 0.05).toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#333]">
                <span className="text-[#666]">You Receive</span>
                <span className="text-[#4ECDC4] font-semibold">${(parseFloat(formData.price) * 0.95).toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={() => router.back()} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" loading={loading} className="flex-1">
            <FiTag size={18} className="mr-2" />
            List for Sale
          </Button>
        </div>
      </form>
    </div>
  );
}
