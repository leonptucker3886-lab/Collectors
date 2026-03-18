import localforage from 'localforage';
import { Collection, CollectionItem, WishlistItem, TradeListing, UserSettings } from '../types';

const STORE_NAME = 'collectvault';

localforage.config({
  name: STORE_NAME,
  storeName: 'data',
});

export const storage = {
  async getCollections(): Promise<Collection[]> {
    const data = await localforage.getItem<Collection[]>('collections');
    return data || [];
  },

  async saveCollections(collections: Collection[]): Promise<void> {
    await localforage.setItem('collections', collections);
  },

  async getItems(): Promise<CollectionItem[]> {
    const data = await localforage.getItem<CollectionItem[]>('items');
    return data || [];
  },

  async saveItems(items: CollectionItem[]): Promise<void> {
    await localforage.setItem('items', items);
  },

  async getWishlist(): Promise<WishlistItem[]> {
    const data = await localforage.getItem<WishlistItem[]>('wishlist');
    return data || [];
  },

  async saveWishlist(wishlist: WishlistItem[]): Promise<void> {
    await localforage.setItem('wishlist', wishlist);
  },

  async getTradeListings(): Promise<TradeListing[]> {
    const data = await localforage.getItem<TradeListing[]>('tradeListings');
    return data || [];
  },

  async saveTradeListings(listings: TradeListing[]): Promise<void> {
    await localforage.setItem('tradeListings', listings);
  },

  async getSettings(): Promise<UserSettings> {
    const data = await localforage.getItem<UserSettings>('settings');
    return data || {
      currency: 'USD',
      darkMode: true,
      notifications: true,
      familyView: false,
    };
  },

  async saveSettings(settings: UserSettings): Promise<void> {
    await localforage.setItem('settings', settings);
  },

  async exportAllData(): Promise<string> {
    const collections = await this.getCollections();
    const items = await this.getItems();
    const wishlist = await this.getWishlist();
    const tradeListings = await this.getTradeListings();
    const settings = await this.getSettings();

    return JSON.stringify({
      collections,
      items,
      wishlist,
      tradeListings,
      settings,
      exportedAt: new Date().toISOString(),
    }, null, 2);
  },

  async importData(jsonString: string): Promise<boolean> {
    try {
      const data = JSON.parse(jsonString);
      if (data.collections) await this.saveCollections(data.collections);
      if (data.items) await this.saveItems(data.items);
      if (data.wishlist) await this.saveWishlist(data.wishlist);
      if (data.tradeListings) await this.saveTradeListings(data.tradeListings);
      if (data.settings) await this.saveSettings(data.settings);
      return true;
    } catch {
      return false;
    }
  },

  async clearAll(): Promise<void> {
    await localforage.clear();
  },
};

export default storage;
