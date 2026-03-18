'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { collectionTemplates } from '../../data/templates';
import { Button, Input, Select, Textarea, ImageUpload } from '../../components/ui';
import { ItemCondition } from '../../types';
import { FiArrowLeft, FiCheck } from 'react-icons/fi';

function AddItemContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { state, createItem } = useApp();
  const { addPoints, earnBadge, profile } = useAuth();
  
  const collectionId = searchParams.get('collection');
  const collection = state.collections.find((c) => c.id === collectionId);
  const template = collectionTemplates.find((t) => t.id === collection?.templateId);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    condition: 'good' as ItemCondition,
    purchasePrice: '',
    purchaseDate: '',
    currentValue: '',
    notes: '',
    images: [] as string[],
    isForTrade: false,
    isForSale: false,
    askingPrice: '',
  });
  
  const [customFields, setCustomFields] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!collection) {
      // Redirect if no collection selected
    }
  }, [collection]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !collectionId) return;

    setLoading(true);
    try {
      await createItem({
        collectionId,
        name: formData.name,
        description: formData.description,
        condition: formData.condition,
        customFieldValues: customFields,
        images: formData.images,
        purchasePrice: formData.purchasePrice ? parseFloat(formData.purchasePrice) : undefined,
        purchaseDate: formData.purchaseDate || undefined,
        currentValue: formData.currentValue ? parseFloat(formData.currentValue) : undefined,
        notes: formData.notes,
        tags: [],
        isForTrade: formData.isForTrade,
        isForSale: formData.isForSale,
        askingPrice: formData.askingPrice ? parseFloat(formData.askingPrice) : undefined,
      });
      
      await addPoints(5);
      
      if (profile) {
        const currentItems = profile.stats?.itemsCollected || 0;
        if (currentItems === 0) {
          await earnBadge('first_item');
        } else if (currentItems >= 9) {
          await earnBadge('ten_items');
        }
      }
      
      router.push(`/collections/${collectionId}`);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!collection) {
    return (
      <div className="text-center py-16">
        <p className="text-[#666] mb-4">Please select a collection first</p>
        <Button onClick={() => router.push('/collections')}>
          Go to Collections
        </Button>
      </div>
    );
  }

  const conditionOptions = [
    { value: 'mint', label: 'Mint' },
    { value: 'near_mint', label: 'Near Mint' },
    { value: 'excellent', label: 'Excellent' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Poor' },
  ];

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="p-2 text-[#A0A0A0]">
          <FiArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-semibold">Add Item</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <ImageUpload
          images={formData.images}
          onChange={(images) => setFormData({ ...formData, images })}
        />

        <div className="space-y-4">
          <Input
            label="Item Name"
            value={formData.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter item name"
            required
          />

          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Add a description..."
          />

          <Select
            label="Condition"
            value={formData.condition}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, condition: e.target.value as ItemCondition })}
            options={conditionOptions}
          />
        </div>

        {template && template.fields.length > 0 && (
          <div className="space-y-4 p-4 bg-[#242424] rounded-xl">
            <h3 className="font-medium text-white">{template.name} Details</h3>
            {template.fields.map((field) => (
              field.type === 'select' && field.options ? (
                <Select
                  key={field.id}
                  label={field.name}
                  value={customFields[field.id] || ''}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCustomFields({ ...customFields, [field.id]: e.target.value })}
                  options={[{ value: '', label: 'Select...' }, ...field.options.map(o => ({ value: o, label: o }))]}
                />
              ) : (
                <Input
                  key={field.id}
                  label={field.name}
                  value={customFields[field.id] || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomFields({ ...customFields, [field.id]: e.target.value })}
                  placeholder={`Enter ${field.name.toLowerCase()}`}
                />
              )
            ))}
          </div>
        )}

        <div className="space-y-4">
          <h3 className="font-medium text-white">Value</h3>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Purchase Price"
              type="number"
              step="0.01"
              value={formData.purchasePrice}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, purchasePrice: e.target.value })}
              placeholder="0.00"
            />
            <Input
              label="Current Value"
              type="number"
              step="0.01"
              value={formData.currentValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, currentValue: e.target.value })}
              placeholder="0.00"
            />
          </div>
          <Input
            label="Purchase Date"
            type="date"
            value={formData.purchaseDate}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, purchaseDate: e.target.value })}
          />
        </div>

        <div className="space-y-4">
          <h3 className="font-medium text-white">Trade / Sell</h3>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isForTrade}
                onChange={(e) => setFormData({ ...formData, isForTrade: e.target.checked })}
                className="w-4 h-4 rounded border-[#333] bg-[#1A1A1A] text-[#A855F7] focus:ring-[#A855F7]"
              />
              <span className="text-sm text-white">Available for Trade</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isForSale}
                onChange={(e) => setFormData({ ...formData, isForSale: e.target.checked })}
                className="w-4 h-4 rounded border-[#333] bg-[#1A1A1A] text-[#A855F7] focus:ring-[#A855F7]"
              />
              <span className="text-sm text-white">For Sale</span>
            </label>
          </div>
          {formData.isForSale && (
            <Input
              label="Asking Price"
              type="number"
              step="0.01"
              value={formData.askingPrice}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, askingPrice: e.target.value })}
              placeholder="0.00"
            />
          )}
        </div>

        <Textarea
          label="Notes"
          value={formData.notes}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Any additional notes..."
        />

        <div className="flex gap-3 pt-4 pb-4">
          <Button type="button" variant="secondary" onClick={() => router.back()} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" loading={loading} className="flex-1">
            Add Item
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function AddItemPage() {
  return (
    <Suspense fallback={<div className="p-4 text-center text-[#666]">Loading...</div>}>
      <AddItemContent />
    </Suspense>
  );
}
