'use client';

import React, { useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '../../../context/AppContext';
import { collectionTemplates } from '../../../data/templates';
import { Button, Input, Select, Textarea, ImageUpload } from '../../../components/ui';
import { ItemCondition } from '../../../types';
import { FiArrowLeft, FiTrash2, FiEdit2 } from 'react-icons/fi';

export default function ItemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { state, updateItem, deleteItem } = useApp();
  const isEditMode = searchParams.get('edit') === 'true';

  const item = state.items.find((i) => i.id === params.id);
  const collection = item ? state.collections.find((c) => c.id === item.collectionId) : null;
  const template = collection ? collectionTemplates.find((t) => t.id === collection.templateId) : null;

  const [isEditing, setIsEditing] = useState(isEditMode);
  const [formData, setFormData] = useState(item ? {
    name: item.name,
    description: item.description,
    condition: item.condition,
    purchasePrice: item.purchasePrice?.toString() || '',
    purchaseDate: item.purchaseDate || '',
    currentValue: item.currentValue?.toString() || '',
    notes: item.notes,
    images: item.images,
    isForTrade: item.isForTrade || false,
    isForSale: item.isForSale || false,
    askingPrice: item.askingPrice?.toString() || '',
  } : null);

  const [customFields, setCustomFields] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  if (!item || !collection || !formData) {
    return (
      <div className="text-center py-16">
        <p className="text-[#666]">Item not found</p>
        <Button variant="secondary" onClick={() => router.push('/collections')} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  const conditionLabels: Record<ItemCondition, string> = {
    mint: 'Mint',
    near_mint: 'Near Mint',
    excellent: 'Excellent',
    good: 'Good',
    fair: 'Fair',
    poor: 'Poor',
  };

  const conditionColors: Record<ItemCondition, string> = {
    mint: '#4ECDC4',
    near_mint: '#4ECDC4',
    excellent: '#A0A0A0',
    good: '#A0A0A0',
    fair: '#F7931E',
    poor: '#FF4757',
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateItem({
        ...item,
        name: formData.name,
        description: formData.description,
        condition: formData.condition,
        customFieldValues: customFields,
        images: formData.images,
        purchasePrice: formData.purchasePrice ? parseFloat(formData.purchasePrice) : undefined,
        purchaseDate: formData.purchaseDate || undefined,
        currentValue: formData.currentValue ? parseFloat(formData.currentValue) : undefined,
        notes: formData.notes,
        isForTrade: formData.isForTrade,
        isForSale: formData.isForSale,
        askingPrice: formData.askingPrice ? parseFloat(formData.askingPrice) : undefined,
      });
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this item?')) {
      await deleteItem(item.id);
      router.push(`/collections/${collection.id}`);
    }
  };

  const valueChange = item.purchasePrice && item.currentValue
    ? ((item.currentValue - item.purchasePrice) / item.purchasePrice) * 100
    : null;

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="p-2 text-[#A0A0A0]">
          <FiArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-semibold flex-1">{isEditing ? 'Edit Item' : item.name}</h1>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="p-2 text-[#A0A0A0]">
            <FiEdit2 size={20} />
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-6">
          <ImageUpload
            images={formData.images}
            onChange={(images) => setFormData({ ...formData, images })}
          />

          <div className="space-y-4">
            <Input
              label="Item Name"
              value={formData.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
            />
            <Textarea
              label="Description"
              value={formData.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
            />
            <Select
              label="Condition"
              value={formData.condition}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, condition: e.target.value as ItemCondition })}
              options={Object.entries(conditionLabels).map(([v, l]) => ({ value: v, label: l }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Purchase Price"
              type="number"
              step="0.01"
              value={formData.purchasePrice}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, purchasePrice: e.target.value })}
            />
            <Input
              label="Current Value"
              type="number"
              step="0.01"
              value={formData.currentValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, currentValue: e.target.value })}
            />
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setIsEditing(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSave} loading={loading} className="flex-1">
              Save Changes
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {item.images.length > 0 && (
            <div className="aspect-square rounded-xl overflow-hidden bg-[#242424]">
              <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="flex items-center gap-4">
            <span
              className="px-3 py-1 rounded-full text-sm font-medium"
              style={{ backgroundColor: `${conditionColors[item.condition]}20`, color: conditionColors[item.condition] }}
            >
              {conditionLabels[item.condition]}
            </span>
            {item.isForTrade && (
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-[#4ECDC4]/20 text-[#4ECDC4]">
                Trade
              </span>
            )}
            {item.isForSale && (
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-[#FF6B35]/20 text-[#FF6B35]">
                ${item.askingPrice}
              </span>
            )}
          </div>

          {item.currentValue && (
            <div className="p-4 bg-[#242424] rounded-xl">
              <p className="text-sm text-[#666]">Current Value</p>
              <p className="text-3xl font-bold text-[#FFE66D]" style={{ fontFamily: 'var(--font-jetbrains)' }}>
                ${item.currentValue.toLocaleString()}
              </p>
              {valueChange !== null && (
                <p className={`text-sm mt-1 ${valueChange >= 0 ? 'text-[#4ECDC4]' : 'text-[#FF4757]'}`}>
                  {valueChange >= 0 ? '+' : ''}{valueChange.toFixed(1)}% from purchase
                </p>
              )}
            </div>
          )}

          {item.description && (
            <p className="text-[#A0A0A0]">{item.description}</p>
          )}

          {template && template.fields.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-medium text-white">Details</h3>
              {template.fields.map((field) => (
                <div key={field.id} className="flex justify-between py-2 border-b border-[#333]">
                  <span className="text-[#666]">{field.name}</span>
                  <span className="text-white">{(item.customFieldValues as Record<string, unknown>)?.[field.id] as string || '-'}</span>
                </div>
              ))}
            </div>
          )}

          {item.purchasePrice && (
            <div className="space-y-2">
              <h3 className="font-medium text-white">Purchase Info</h3>
              <div className="flex justify-between py-2 border-b border-[#333]">
                <span className="text-[#666]">Purchase Price</span>
                <span className="text-white">${item.purchasePrice.toLocaleString()}</span>
              </div>
              {item.purchaseDate && (
                <div className="flex justify-between py-2 border-b border-[#333]">
                  <span className="text-[#666]">Purchase Date</span>
                  <span className="text-white">{new Date(item.purchaseDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          )}

          {item.notes && (
            <div>
              <h3 className="font-medium text-white mb-2">Notes</h3>
              <p className="text-[#A0A0A0] text-sm">{item.notes}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button variant="danger" onClick={handleDelete} className="flex-1">
              <FiTrash2 size={18} className="mr-2" />
              Delete Item
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
