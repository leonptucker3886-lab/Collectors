'use client';

import React from 'react';
import { Collection } from '../../types';
import { collectionTemplates } from '../../data/templates';
import { FiLock, FiImage } from 'react-icons/fi';

interface CollectionCardProps {
  collection: Collection;
  itemCount: number;
  totalValue: number;
  onClick: () => void;
}

export default function CollectionCard({ collection, itemCount, totalValue, onClick }: CollectionCardProps) {
  const template = collectionTemplates.find(t => t.id === collection.templateId);

  return (
    <div
      onClick={onClick}
      className="group relative aspect-square rounded-xl overflow-hidden bg-[#242424] cursor-pointer hover:-translate-y-1 transition-all duration-200"
    >
      {collection.coverImage ? (
        <img
          src={collection.coverImage}
          alt={collection.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-5xl bg-gradient-to-br from-[#1A1A1A] to-[#242424]">
          {template?.icon || '📦'}
        </div>
      )}
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white truncate text-sm">{collection.name}</h3>
            <p className="text-xs text-[#A0A0A0]">{itemCount} items</p>
          </div>
          {collection.isPrivate && (
            <FiLock size={12} className="text-[#666] mt-1" />
          )}
        </div>
        <p className="text-lg font-bold text-[#FFE66D] mt-1">
          ${totalValue.toLocaleString()}
        </p>
      </div>

      <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 rounded-full text-xs text-white">
        {template?.icon}
      </div>
    </div>
  );
}
