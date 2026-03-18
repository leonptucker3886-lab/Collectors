'use client';

import React from 'react';
import { CollectionItem, ItemCondition } from '../../types';
import { FiEdit2, FiTrash2, FiRefreshCw } from 'react-icons/fi';

interface ItemCardProps {
  item: CollectionItem;
  onClick: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const conditionColors: Record<ItemCondition, string> = {
  mint: '#4ECDC4',
  near_mint: '#4ECDC4',
  excellent: '#A0A0A0',
  good: '#A0A0A0',
  fair: '#6366F1',
  poor: '#FF4757',
};

const conditionLabels: Record<ItemCondition, string> = {
  mint: 'Mint',
  near_mint: 'Near Mint',
  excellent: 'Excellent',
  good: 'Good',
  fair: 'Fair',
  poor: 'Poor',
};

export default function ItemCard({ item, onClick, onEdit, onDelete }: ItemCardProps) {
  const hasValue = item.currentValue && item.currentValue > 0;
  const hasPurchase = item.purchasePrice && item.purchasePrice > 0;
  const valueChange = hasValue && hasPurchase
    ? ((item.currentValue! - item.purchasePrice!) / item.purchasePrice!) * 100
    : 0;

  return (
    <div
      onClick={onClick}
      className="group relative bg-[#242424] rounded-xl overflow-hidden cursor-pointer hover:-translate-y-1 transition-all duration-200"
    >
      <div className="aspect-[3/4] relative">
        {item.images && item.images.length > 0 ? (
          <img
            src={item.images[0]}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-[#1A1A1A] flex items-center justify-center text-4xl">
            📷
          </div>
        )}

        {item.isForTrade && (
          <div className="absolute top-2 left-2 px-2 py-1 bg-[#4ECDC4]/90 rounded-full text-xs font-medium">
            Trade
          </div>
        )}
        {item.isForSale && (
          <div className="absolute top-2 right-2 px-2 py-1 bg-[#A855F7]/90 rounded-full text-xs font-medium">
            ${item.askingPrice}
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ backgroundColor: `${conditionColors[item.condition]}20`, color: conditionColors[item.condition] }}
          >
            {conditionLabels[item.condition]}
          </span>
        </div>
      </div>

      <div className="p-3">
        <h3 className="font-medium text-white text-sm truncate">{item.name}</h3>
        {hasValue && (
          <div className="flex items-center justify-between mt-1">
            <p className="text-lg font-bold text-[#FFE66D]">
              ${item.currentValue!.toLocaleString()}
            </p>
            {hasPurchase && (
              <span className={`text-xs ${valueChange >= 0 ? 'text-[#4ECDC4]' : 'text-[#FF4757]'}`}>
                {valueChange >= 0 ? '+' : ''}{valueChange.toFixed(1)}%
              </span>
            )}
          </div>
        )}
        {!hasValue && (
          <p className="text-xs text-[#666] mt-1">No value set</p>
        )}
      </div>

      {(onEdit || onDelete) && (
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(); }}
              className="p-2 bg-black/60 rounded-full text-white hover:bg-[#A855F7]"
            >
              <FiEdit2 size={14} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="p-2 bg-black/60 rounded-full text-white hover:bg-[#FF4757]"
            >
              <FiTrash2 size={14} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
