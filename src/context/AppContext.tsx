'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  Collection,
  CollectionItem,
  WishlistItem,
  TradeListing,
  UserSettings,
  AppState,
  DashboardStats,
  CustomField,
  ItemCondition,
} from '../types';
import storage from '../lib/storage';
import { getTemplateById } from '../data/templates';

type Action =
  | { type: 'LOAD_DATA'; payload: Partial<AppState> }
  | { type: 'ADD_COLLECTION'; payload: Collection }
  | { type: 'UPDATE_COLLECTION'; payload: Collection }
  | { type: 'DELETE_COLLECTION'; payload: string }
  | { type: 'ADD_ITEM'; payload: CollectionItem }
  | { type: 'UPDATE_ITEM'; payload: CollectionItem }
  | { type: 'DELETE_ITEM'; payload: string }
  | { type: 'ADD_WISHLIST_ITEM'; payload: WishlistItem }
  | { type: 'UPDATE_WISHLIST_ITEM'; payload: WishlistItem }
  | { type: 'DELETE_WISHLIST_ITEM'; payload: string }
  | { type: 'ADD_TRADE_LISTING'; payload: TradeListing }
  | { type: 'DELETE_TRADE_LISTING'; payload: string }
  | { type: 'UPDATE_SETTINGS'; payload: UserSettings };

const initialState: AppState = {
  collections: [],
  items: [],
  wishlist: [],
  tradeListings: [],
  settings: {
    currency: 'USD',
    darkMode: true,
    notifications: true,
    familyView: false,
  },
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'LOAD_DATA':
      return { ...state, ...action.payload };
    case 'ADD_COLLECTION':
      return { ...state, collections: [...state.collections, action.payload] };
    case 'UPDATE_COLLECTION':
      return {
        ...state,
        collections: state.collections.map(c =>
          c.id === action.payload.id ? action.payload : c
        ),
      };
    case 'DELETE_COLLECTION':
      return {
        ...state,
        collections: state.collections.filter(c => c.id !== action.payload),
        items: state.items.filter(i => i.collectionId !== action.payload),
      };
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, action.payload] };
    case 'UPDATE_ITEM':
      return {
        ...state,
        items: state.items.map(i =>
          i.id === action.payload.id ? action.payload : i
        ),
      };
    case 'DELETE_ITEM':
      return { ...state, items: state.items.filter(i => i.id !== action.payload) };
    case 'ADD_WISHLIST_ITEM':
      return { ...state, wishlist: [...state.wishlist, action.payload] };
    case 'UPDATE_WISHLIST_ITEM':
      return {
        ...state,
        wishlist: state.wishlist.map(w =>
          w.id === action.payload.id ? action.payload : w
        ),
      };
    case 'DELETE_WISHLIST_ITEM':
      return { ...state, wishlist: state.wishlist.filter(w => w.id !== action.payload) };
    case 'ADD_TRADE_LISTING':
      return { ...state, tradeListings: [...state.tradeListings, action.payload] };
    case 'DELETE_TRADE_LISTING':
      return { ...state, tradeListings: state.tradeListings.filter(t => t.id !== action.payload) };
    case 'UPDATE_SETTINGS':
      return { ...state, settings: action.payload };
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  createCollection: (name: string, templateId: string, description?: string, coverImage?: string) => Promise<Collection>;
  updateCollection: (collection: Collection) => Promise<void>;
  deleteCollection: (id: string) => Promise<void>;
  createItem: (item: Omit<CollectionItem, 'id' | 'createdAt' | 'updatedAt' | 'valueHistory'>) => Promise<CollectionItem>;
  updateItem: (item: CollectionItem) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  addWishlistItem: (item: Omit<WishlistItem, 'id' | 'createdAt' | 'matchNotified'>) => Promise<WishlistItem>;
  updateWishlistItem: (item: WishlistItem) => Promise<void>;
  deleteWishlistItem: (id: string) => Promise<void>;
  addTradeListing: (item: Omit<TradeListing, 'id' | 'createdAt'>) => Promise<TradeListing>;
  deleteTradeListing: (id: string) => Promise<void>;
  updateSettings: (settings: UserSettings) => Promise<void>;
  getDashboardStats: () => DashboardStats;
  getItemsByCollection: (collectionId: string) => CollectionItem[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const loadData = async () => {
      const [collections, items, wishlist, tradeListings, settings] = await Promise.all([
        storage.getCollections(),
        storage.getItems(),
        storage.getWishlist(),
        storage.getTradeListings(),
        storage.getSettings(),
      ]);
      dispatch({
        type: 'LOAD_DATA',
        payload: { collections, items, wishlist, tradeListings, settings },
      });
    };
    loadData();
  }, []);

  const createCollection = async (
    name: string,
    templateId: string,
    description = '',
    coverImage = ''
  ): Promise<Collection> => {
    const template = getTemplateById(templateId);
    const customFields: CustomField[] = template?.fields || [];
    const now = new Date().toISOString();
    const collection: Collection = {
      id: uuidv4(),
      name,
      description,
      templateId,
      coverImage,
      customFields,
      isPrivate: true,
      createdAt: now,
      updatedAt: now,
    };
    dispatch({ type: 'ADD_COLLECTION', payload: collection });
    await storage.saveCollections([...state.collections, collection]);
    return collection;
  };

  const updateCollection = async (collection: Collection) => {
    const updated = { ...collection, updatedAt: new Date().toISOString() };
    dispatch({ type: 'UPDATE_COLLECTION', payload: updated });
    const collections = state.collections.map(c => c.id === updated.id ? updated : c);
    await storage.saveCollections(collections);
  };

  const deleteCollection = async (id: string) => {
    dispatch({ type: 'DELETE_COLLECTION', payload: id });
    const collections = state.collections.filter(c => c.id !== id);
    const items = state.items.filter(i => i.collectionId !== id);
    await Promise.all([
      storage.saveCollections(collections),
      storage.saveItems(items),
    ]);
  };

  const createItem = async (
    itemData: Omit<CollectionItem, 'id' | 'createdAt' | 'updatedAt' | 'valueHistory'>
  ): Promise<CollectionItem> => {
    const now = new Date().toISOString();
    const item: CollectionItem = {
      ...itemData,
      id: uuidv4(),
      valueHistory: itemData.currentValue
        ? [{ value: itemData.currentValue, date: now, source: 'manual' as const }]
        : [],
      createdAt: now,
      updatedAt: now,
    };
    dispatch({ type: 'ADD_ITEM', payload: item });
    await storage.saveItems([...state.items, item]);
    return item;
  };

  const updateItem = async (item: CollectionItem) => {
    const existingItem = state.items.find(i => i.id === item.id);
    let valueHistory = item.valueHistory;
    if (item.currentValue && item.currentValue !== existingItem?.currentValue) {
      valueHistory = [
        ...item.valueHistory,
        { value: item.currentValue, date: new Date().toISOString(), source: 'manual' as const },
      ];
    }
    const updated = { ...item, updatedAt: new Date().toISOString(), valueHistory };
    dispatch({ type: 'UPDATE_ITEM', payload: updated });
    const items = state.items.map(i => i.id === updated.id ? updated : i);
    await storage.saveItems(items);
  };

  const deleteItem = async (id: string) => {
    dispatch({ type: 'DELETE_ITEM', payload: id });
    const items = state.items.filter(i => i.id !== id);
    await storage.saveItems(items);
  };

  const addWishlistItem = async (
    itemData: Omit<WishlistItem, 'id' | 'createdAt' | 'matchNotified'>
  ): Promise<WishlistItem> => {
    const item: WishlistItem = {
      ...itemData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      matchNotified: false,
    };
    dispatch({ type: 'ADD_WISHLIST_ITEM', payload: item });
    await storage.saveWishlist([...state.wishlist, item]);
    return item;
  };

  const updateWishlistItem = async (item: WishlistItem) => {
    dispatch({ type: 'UPDATE_WISHLIST_ITEM', payload: item });
    const wishlist = state.wishlist.map(w => w.id === item.id ? item : w);
    await storage.saveWishlist(wishlist);
  };

  const deleteWishlistItem = async (id: string) => {
    dispatch({ type: 'DELETE_WISHLIST_ITEM', payload: id });
    const wishlist = state.wishlist.filter(w => w.id !== id);
    await storage.saveWishlist(wishlist);
  };

  const addTradeListing = async (
    itemData: Omit<TradeListing, 'id' | 'createdAt'>
  ): Promise<TradeListing> => {
    const listing: TradeListing = {
      ...itemData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_TRADE_LISTING', payload: listing });
    await storage.saveTradeListings([...state.tradeListings, listing]);
    return listing;
  };

  const deleteTradeListing = async (id: string) => {
    dispatch({ type: 'DELETE_TRADE_LISTING', payload: id });
    const tradeListings = state.tradeListings.filter(t => t.id !== id);
    await storage.saveTradeListings(tradeListings);
  };

  const updateSettings = async (settings: UserSettings) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
    await storage.saveSettings(settings);
  };

  const getDashboardStats = (): DashboardStats => {
    const totalValue = state.items.reduce((sum, item) => sum + (item.currentValue || 0), 0);
    const totalItems = state.items.length;
    const totalCollections = state.collections.length;
    
    const topItems = [...state.items]
      .filter(i => i.currentValue)
      .sort((a, b) => (b.currentValue || 0) - (a.currentValue || 0))
      .slice(0, 5);

    const recentItems = [...state.items]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);

    const categoryBreakdown = state.collections.map(col => {
      const collectionItems = state.items.filter(i => i.collectionId === col.id);
      const value = collectionItems.reduce((sum, i) => sum + (i.currentValue || 0), 0);
      return { category: col.name, value, count: collectionItems.length };
    }).filter(c => c.count > 0);

    return {
      totalValue,
      totalItems,
      totalCollections,
      valueChange: 0,
      valueChangePercent: 0,
      topItems,
      recentItems,
      categoryBreakdown,
    };
  };

  const getItemsByCollection = (collectionId: string): CollectionItem[] => {
    return state.items.filter(i => i.collectionId === collectionId);
  };

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        createCollection,
        updateCollection,
        deleteCollection,
        createItem,
        updateItem,
        deleteItem,
        addWishlistItem,
        updateWishlistItem,
        deleteWishlistItem,
        addTradeListing,
        deleteTradeListing,
        updateSettings,
        getDashboardStats,
        getItemsByCollection,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
