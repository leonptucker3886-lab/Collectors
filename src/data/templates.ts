import { CollectionTemplate } from '../types';

export const collectionTemplates: CollectionTemplate[] = [
  {
    id: 'trading-cards',
    name: 'Trading Cards',
    icon: '🎴',
    description: 'Sports cards, Pokemon, TCG, and more',
    fields: [
      { id: 'set', name: 'Card Set', type: 'text', required: true },
      { id: 'cardNumber', name: 'Card Number', type: 'text' },
      { id: 'grade', name: 'Grade', type: 'select', options: ['PSA 10', 'PSA 9', 'PSA 8', 'BGS 10', 'BGS 9.5', 'BGS 9', 'Raw'] },
      { id: 'player', name: 'Player/Character', type: 'text' },
      { id: 'year', name: 'Year', type: 'number' },
      { id: 'team', name: 'Team/Brand', type: 'text' },
      { id: 'variation', name: 'Variation', type: 'text' },
    ],
  },
  {
    id: 'vinyl',
    name: 'Vinyl Records',
    icon: '💿',
    description: 'LPs, 45s, and colored vinyl',
    fields: [
      { id: 'artist', name: 'Artist', type: 'text', required: true },
      { id: 'album', name: 'Album', type: 'text', required: true },
      { id: 'pressingYear', name: 'Pressing Year', type: 'number' },
      { id: 'matrixNumber', name: 'Matrix Number', type: 'text' },
      { id: 'sleeveCondition', name: 'Sleeve Condition', type: 'select', options: ['Mint', 'Near Mint', 'Very Good Plus', 'Very Good', 'Good', 'Fair', 'Poor'] },
      { id: 'mediaCondition', name: 'Media Condition', type: 'select', options: ['Mint', 'Near Mint', 'Very Good Plus', 'Very Good', 'Good', 'Fair', 'Poor'] },
      { id: 'recordLabel', name: 'Record Label', type: 'text' },
      { id: 'country', name: 'Country', type: 'text' },
    ],
  },
  {
    id: 'coins',
    name: 'Coins',
    icon: '🪙',
    description: 'Coins, tokens, and currency',
    fields: [
      { id: 'year', name: 'Year', type: 'number', required: true },
      { id: 'mintMark', name: 'Mint Mark', type: 'text' },
      { id: 'grade', name: 'Grade', type: 'select', options: ['MS70', 'MS69', 'MS68', 'MS67', 'AU58', 'AU55', 'XF45', 'XF40', 'VF35', 'VF30', 'F25', 'F20', 'VG15', 'VG10', 'G8', 'G6', 'AG3'] },
      { id: 'country', name: 'Country', type: 'text' },
      { id: 'denomination', name: 'Denomination', type: 'text' },
      { id: 'metal', name: 'Metal', type: 'text' },
      { id: 'certification', name: 'Certification', type: 'select', options: ['PCGS', 'NGC', 'ANACS', 'None'] },
    ],
  },
  {
    id: 'funko',
    name: 'Funko Pops',
    icon: '🧸',
    description: 'Funko Pop! vinyl figures',
    fields: [
      { id: 'series', name: 'Series', type: 'text', required: true },
      { id: 'popNumber', name: 'Pop Number', type: 'number', required: true },
      { id: 'character', name: 'Character', type: 'text', required: true },
      { id: 'variant', name: 'Variant', type: 'text' },
      { id: 'boxType', name: 'Box Type', type: 'select', options: ['Window Box', 'Pop! Box', 'Gift Box', 'No Box'] },
      { id: 'exclusives', name: 'Exclusive', type: 'select', options: ['Convention', 'Store Exclusive', 'Target Exclusive', 'Hot Topic', 'None'] },
      { id: 'chase', name: 'Chase', type: 'select', options: ['Yes', 'No'] },
    ],
  },
  {
    id: 'books',
    name: 'Books',
    icon: '📚',
    description: 'Books, comics, and manga',
    fields: [
      { id: 'author', name: 'Author', type: 'text', required: true },
      { id: 'isbn', name: 'ISBN', type: 'text' },
      { id: 'edition', name: 'Edition', type: 'text' },
      { id: 'publisher', name: 'Publisher', type: 'text' },
      { id: 'year', name: 'Year', type: 'number' },
      { id: 'format', name: 'Format', type: 'select', options: ['Hardcover', 'Paperback', 'Special Edition', 'First Edition', 'Graphic Novel'] },
      { id: 'signed', name: 'Signed', type: 'select', options: ['Yes', 'No'] },
    ],
  },
  {
    id: 'video-games',
    name: 'Video Games',
    icon: '🎮',
    description: 'Games for all consoles',
    fields: [
      { id: 'platform', name: 'Platform', type: 'text', required: true },
      { id: 'region', name: 'Region', type: 'select', options: ['NTSC', 'PAL', 'NTSC-J', 'Multi-Region'] },
      { id: 'condition', name: 'Condition', type: 'select', options: ['Mint', 'Near Mint', 'Very Good', 'Good', 'Fair', 'Poor'] },
      { id: 'complete', name: 'Complete', type: 'select', options: ['Yes - Full', 'Yes - Partial', 'Disc Only', 'Case Only'] },
      { id: 'year', name: 'Year', type: 'number' },
      { id: 'developer', name: 'Developer', type: 'text' },
    ],
  },
  {
    id: 'stamps',
    name: 'Stamps',
    icon: '📮',
    description: 'Postage stamps and philately',
    fields: [
      { id: 'country', name: 'Country', type: 'text', required: true },
      { id: 'year', name: 'Year', type: 'number', required: true },
      { id: 'denomination', name: 'Denomination', type: 'text' },
      { id: 'condition', name: 'Condition', type: 'select', options: ['Mint Never Hinged', 'Mint Hinged', 'Used', 'Poor'] },
      { id: 'catalogNumber', name: 'Scott Number', type: 'text' },
      { id: 'series', name: 'Series', type: 'text' },
    ],
  },
  {
    id: 'jewelry',
    name: 'Jewelry & Watches',
    icon: '💎',
    description: 'Watches, rings, necklaces and more',
    fields: [
      { id: 'type', name: 'Type', type: 'select', options: ['Ring', 'Necklace', 'Bracelet', 'Watch', 'Earrings', 'Brooch', 'Other'] },
      { id: 'material', name: 'Material', type: 'text' },
      { id: 'gemstones', name: 'Gemstones', type: 'text' },
      { id: 'brand', name: 'Brand', type: 'text' },
      { id: 'carat', name: 'Carat/Weight', type: 'text' },
      { id: 'period', name: 'Period/Era', type: 'text' },
    ],
  },
  {
    id: 'custom',
    name: 'Custom',
    icon: '📦',
    description: 'Create your own collection type',
    fields: [],
  },
];

export const getTemplateById = (id: string): CollectionTemplate | undefined => {
  return collectionTemplates.find(t => t.id === id);
};

export const getDefaultFields = (): { name: string; type: 'text' }[] => [
  { name: 'Name', type: 'text' },
  { name: 'Description', type: 'text' },
  { name: 'Notes', type: 'text' },
];
