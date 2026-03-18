export type ItemCondition = 'mint' | 'near_mint' | 'excellent' | 'good' | 'fair' | 'poor';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  avatar: string;
  avatarColor: string;
  bio: string;
  location: string;
  website: string;
  joinedAt: string;
  points: number;
  level: number;
  badges: Badge[];
  stats: UserStats;
  theme: 'purple' | 'blue' | 'green' | 'pink' | 'orange';
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
}

export interface UserStats {
  itemsCollected: number;
  collectionsCreated: number;
  forumPosts: number;
  marketplaceSales: number;
  tradesCompleted: number;
  likesReceived: number;
}

export interface LevelInfo {
  level: number;
  title: string;
  minPoints: number;
  maxPoints: number;
  icon: string;
}

export const LEVELS: LevelInfo[] = [
  { level: 1, title: 'Newcomer', minPoints: 0, maxPoints: 100, icon: '🌱' },
  { level: 2, title: 'Collector', minPoints: 100, maxPoints: 500, icon: '⭐' },
  { level: 3, title: 'Enthusiast', minPoints: 500, maxPoints: 1500, icon: '🌟' },
  { level: 4, title: 'Connoisseur', minPoints: 1500, maxPoints: 5000, icon: '💎' },
  { level: 5, title: 'Expert', minPoints: 5000, maxPoints: 15000, icon: '🏆' },
  { level: 6, title: 'Master', minPoints: 15000, maxPoints: 50000, icon: '👑' },
  { level: 7, title: 'Legend', minPoints: 50000, maxPoints: 999999, icon: '🔥' },
];

export const BADGES: Omit<Badge, 'earnedAt'>[] = [
  { id: 'first_item', name: 'First Find', description: 'Added your first item', icon: '🎯' },
  { id: 'ten_items', name: 'Building Collection', description: 'Added 10 items', icon: '📦' },
  { id: 'hundred_items', name: 'Hoarder', description: 'Added 100 items', icon: '🏠' },
  { id: 'first_collection', name: 'Curator', description: 'Created your first collection', icon: '📚' },
  { id: 'forum_post', name: 'Voice', description: 'Made your first forum post', icon: '💬' },
  { id: 'ten_forum_posts', name: 'Community Leader', description: 'Made 10 forum posts', icon: '🎤' },
  { id: 'first_sale', name: 'Entrepreneur', description: 'Sold your first item', icon: '💰' },
  { id: 'ten_sales', name: 'Tycoon', description: 'Sold 10 items', icon: '💎' },
  { id: 'first_trade', name: 'Trader', description: 'Completed your first trade', icon: '🔄' },
  { id: 'verified', name: 'Verified', description: 'Verified collector', icon: '✅' },
  { id: 'streak_7', name: 'Dedicated', description: '7 day login streak', icon: '🔥' },
  { id: 'streak_30', name: 'Committed', description: '30 day login streak', icon: '⚡' },
];

export const AVATARS = [
  '🐻', '🦊', '🐼', '🦁', '🐯', '🦊', '🐨', '🐰', '🦄', '🐲',
  '🎮', '🎨', '🎭', '🎪', '🎯', '🎲', '🎸', '🎺', '🎻', '🥎',
  '⚽', '🏀', '🏈', '🎾', '🏐', '🎱', '🏓', '🏸', '🥊', '🥇',
  '🚀', '🌟', '💎', '🔮', '🎁', '🏆', '👑', '💍', '🎖️', '⭐',
];

export const AVATAR_COLORS = [
  '#A855F7', '#6366F1', '#3B82F6', '#10B981', '#F59E0B',
  '#EF4444', '#EC4899', '#8B5CF6', '#06B6D4', '#84CC16',
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
