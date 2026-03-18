'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Button, Input, Select } from '../../components/ui';
import { FiPlus, FiTrash2, FiTarget } from 'react-icons/fi';

export default function WishlistPage() {
  const { state, addWishlistItem, deleteWishlistItem } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    targetPrice: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    notes: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    
    setLoading(true);
    try {
      await addWishlistItem({
        name: formData.name,
        description: formData.description,
        targetPrice: formData.targetPrice ? parseFloat(formData.targetPrice) : undefined,
        priority: formData.priority,
        notes: formData.notes,
      });
      setFormData({ name: '', description: '', targetPrice: '', priority: 'medium', notes: '' });
      setShowAdd(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const priorityColors = {
    high: '#FF4757',
    medium: '#F7931E',
    low: '#4ECDC4',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Wishlist</h1>
        <Button onClick={() => setShowAdd(!showAdd)} size="sm">
          <FiPlus size={18} />
        </Button>
      </div>

      {showAdd && (
        <form onSubmit={handleSubmit} className="p-4 bg-[#242424] rounded-xl space-y-4">
          <Input
            label="Item Name"
            value={formData.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
            placeholder="What are you looking for?"
            required
          />
          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Details..."
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Target Price"
              type="number"
              step="0.01"
              value={formData.targetPrice}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, targetPrice: e.target.value })}
              placeholder="0.00"
            />
            <Select
              label="Priority"
              value={formData.priority}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, priority: e.target.value as 'high' | 'medium' | 'low' })}
              options={[
                { value: 'high', label: 'High' },
                { value: 'medium', label: 'Medium' },
                { value: 'low', label: 'Low' },
              ]}
            />
          </div>
          <Textarea
            label="Notes"
            value={formData.notes}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Any notes..."
          />
          <div className="flex gap-3">
            <Button type="button" variant="secondary" onClick={() => setShowAdd(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" loading={loading} className="flex-1">
              Add to Wishlist
            </Button>
          </div>
        </form>
      )}

      {state.wishlist.length > 0 ? (
        <div className="space-y-3">
          {state.wishlist.map((item) => (
            <div key={item.id} className="p-4 bg-[#242424] rounded-xl flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-white">{item.name}</h3>
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: priorityColors[item.priority] }}
                  />
                </div>
                {item.description && (
                  <p className="text-sm text-[#666] mt-1">{item.description}</p>
                )}
                <div className="flex items-center gap-4 mt-2">
                  {item.targetPrice && (
                    <p className="text-sm text-[#FFE66D]">
                      Target: ${item.targetPrice.toLocaleString()}
                    </p>
                  )}
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: `${priorityColors[item.priority]}20`, color: priorityColors[item.priority] }}
                  >
                    {item.priority}
                  </span>
                </div>
              </div>
              <button
                onClick={() => deleteWishlistItem(item.id)}
                className="p-2 text-[#666] hover:text-[#FF4757]"
              >
                <FiTrash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      ) : !showAdd ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#242424] flex items-center justify-center">
            <FiTarget size={24} className="text-[#666]" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">Wishlist is empty</h3>
          <p className="text-[#666] text-sm mb-4">Add items you are looking for</p>
          <Button onClick={() => setShowAdd(true)}>
            <FiPlus size={18} className="mr-2" />
            Add Wishlist Item
          </Button>
        </div>
      ) : null}
    </div>
  );
}

function Textarea({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; placeholder?: string }) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm text-[#A0A0A0] mb-1.5">{label}</label>}
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 bg-[#1A1A1A] border border-[#333] rounded-lg text-white placeholder-[#666] focus:outline-none focus:border-[#FF6B35]"
        rows={2}
      />
    </div>
  );
}
