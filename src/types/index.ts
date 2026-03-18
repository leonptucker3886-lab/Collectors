export type ItemCondition = 'mint' | 'near_mint' | 'excellent' | 'good' | 'fair' | 'poor';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  avatar: string;
  avatarColor: string;
  bio: string;
  tagline: string;
  location: string;
  website: string;
  joinedAt: string;
  postCount: number;
  tradeCount: number;
  lastActive: string;
}

export const AVATARS = [
  '👤', '👁️', '🔮', '💎', '⚜️', '🏛️', '⚔️', '🛡️', '👑', '📜',
  '🎖️', '🏆', '💰', '🪙', '💵', '🔑', '⚓', '🧭', '🌟', '✨',
  '📿', '🪷', '⚜️', '🏺', '🎭', '🎪', '🎯', '🎲', '♟️', '♠️',
  '♥️', '♦️', '♣️', '🎰', '🃏', '🎴', '📯', '🔔', '🏅', '🎗️',
];

export const AVATAR_COLORS = [
  '#1C1C1E', '#2C2C2E', '#3A3A3C', '#48484A', '#636366',
  '#8E8E93', '#AEAEB2', '#C7C7CC', '#D1D1D6', '#E5E5EA',
];

export interface CustomField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'select' | 'date' | 'textarea';
  options?: string[];
  required?: boolean;
}

export interface CollectionTemplate {
  id: string;
  name: string;
  icon: string;
  description: string;
  fields: CustomField[];
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  templateId: string;
  coverImage: string;
  customFields: CustomField[];
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CollectionItem {
  id: string;
  collectionId: string;
  name: string;
  description: string;
  images: string[];
  condition: ItemCondition;
  customFieldValues: Record<string, string | number | string[]>;
  purchasePrice?: number;
  purchaseDate?: string;
  currentValue?: number;
  valueHistory: ValueEntry[];
  notes: string;
  tags: string[];
  reminder?: Reminder;
  isForTrade?: boolean;
  isForSale?: boolean;
  askingPrice?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ValueEntry {
  value: number;
  date: string;
  source: 'manual' | 'market';
}

export interface Reminder {
  id: string;
  type: 'regrade' | 'cleaning' | 'insurance' | 'custom';
  title: string;
  dueDate: string;
  completed: boolean;
  notes?: string;
}

export interface WishlistItem {
  id: string;
  name: string;
  description?: string;
  targetPrice?: number;
  priority: 'high' | 'medium' | 'low';
  notes?: string;
  matchNotified: boolean;
  createdAt: string;
}

export interface TradeListing {
  id: string;
  itemId: string;
  itemName: string;
  itemImage: string;
  type: 'trade' | 'sell';
  askingPrice?: number;
  tradeInterests: string[];
  description: string;
  createdAt: string;
}

export interface UserSettings {
  currency: string;
  darkMode: boolean;
  notifications: boolean;
  familyView: boolean;
}

export interface AppState {
  collections: Collection[];
  items: CollectionItem[];
  wishlist: WishlistItem[];
  tradeListings: TradeListing[];
  settings: UserSettings;
}

export interface DashboardStats {
  totalValue: number;
  totalItems: number;
  totalCollections: number;
  valueChange: number;
  valueChangePercent: number;
  topItems: CollectionItem[];
  recentItems: CollectionItem[];
  categoryBreakdown: { category: string; value: number; count: number }[];
}
