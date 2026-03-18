'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useApp } from '../../../context/AppContext';
import { collectionTemplates } from '../../../data/templates';
import ItemCard from '../../../components/item/ItemCard';
import { Button } from '../../../components/ui';
import { FiArrowLeft, FiPlus, FiMoreVertical, FiTrash2, FiEdit2 } from 'react-icons/fi';

export default function CollectionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { state, getItemsByCollection, deleteCollection, deleteItem } = useApp();
  const [showMenu, setShowMenu] = useState(false);

  const collection = state.collections.find((c) => c.id === params.id);
  const items = collection ? getItemsByCollection(collection.id) : [];
  const template = collectionTemplates.find((t) => t.id === collection?.templateId);

  if (!collection) {
    return (
      <div className="text-center py-16">
        <p className="text-[#666]">Collection not found</p>
        <Button variant="secondary" onClick={() => router.push('/collections')} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  const totalValue = items.reduce((sum, i) => sum + (i.currentValue || 0), 0);

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this collection and all its items?')) {
      await deleteCollection(collection.id);
      router.push('/collections');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="p-2 text-[#A0A0A0]">
          <FiArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-semibold flex-1 truncate">{collection.name}</h1>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 text-[#A0A0A0] hover:text-white"
          >
            <FiMoreVertical size={20} />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-10 bg-[#242424] rounded-lg shadow-lg py-1 min-w-[150px] z-10">
              <button
                onClick={() => {
                  setShowMenu(false);
                  // Edit collection
                }}
                className="w-full px-4 py-2 text-left text-sm text-white hover:bg-[#333] flex items-center gap-2"
              >
                <FiEdit2 size={14} /> Edit
              </button>
              <button
                onClick={() => {
                  setShowMenu(false);
                  handleDelete();
                }}
                className="w-full px-4 py-2 text-left text-sm text-[#FF4757] hover:bg-[#333] flex items-center gap-2"
              >
                <FiTrash2 size={14} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-4xl">{template?.icon}</div>
        <div>
          <p className="text-2xl font-bold text-[#FFE66D]" style={{ fontFamily: 'var(--font-jetbrains)' }}>
            ${totalValue.toLocaleString()}
          </p>
          <p className="text-sm text-[#666]">{items.length} items</p>
        </div>
      </div>

      {collection.description && (
        <p className="text-[#A0A0A0] text-sm">{collection.description}</p>
      )}

      {items.length > 0 ? (
        <div className="grid grid-cols-2 gap-3">
          {items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onClick={() => router.push(`/item/${item.id}`)}
              onEdit={() => router.push(`/item/${item.id}?edit=true`)}
              onDelete={() => deleteItem(item.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#242424] flex items-center justify-center">
            <FiPlus size={24} className="text-[#666]" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No items yet</h3>
          <p className="text-[#666] text-sm mb-4">Add your first item to this collection</p>
          <Button onClick={() => router.push(`/add?collection=${collection.id}`)}>
            <FiPlus size={18} className="mr-2" />
            Add Item
          </Button>
        </div>
      )}

      <Button
        onClick={() => router.push(`/add?collection=${collection.id}`)}
        className="fixed bottom-20 md:bottom-6 right-4 md:right-6"
      >
        <FiPlus size={20} />
      </Button>
    </div>
  );
}
