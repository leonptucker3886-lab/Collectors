import { CollectionTemplate } from '../types';

export const collectionTemplates: CollectionTemplate[] = [
  {
    id: 'cards',
    name: 'Cards',
    icon: '🎴',
    description: 'Trading cards, Pokemon, TCG, and more',
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
    id: 'records',
    name: 'Records',
    icon: '💿',
    description: 'Vinyl records, LPs, and colored vinyl',
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
    id: 'toys',
    name: 'Toys',
    icon: '🧸',
    description: 'Funko Pops, action figures, and collectibles',
    fields: [
      { id: 'series', name: 'Series', type: 'text', required: true },
      { id: 'popNumber', name: 'Pop Number', type: 'number', required: true },
      { id: 'character', name: 'Character', type: 'text', required: true },
      { id: 'variant', name: 'Variant', type: 'text' },
      { id: 'boxType', name: 'Box Type', type: 'select', options: ['Window Box', 'Pop! Box', 'Gift Box', 'No Box'] },
      { id: 'exclusive', name: 'Exclusive', type: 'select', options: ['Convention', 'Store Exclusive', 'Target Exclusive', 'Hot Topic', 'None'] },
      { id: 'chase', name: 'Chase', type: 'select', options: ['Yes', 'No'] },
    ],
  },
  {
    id: 'sports',
    name: 'Sports',
    icon: '⚽',
    description: 'Sports memorabilia and equipment',
    fields: [
      { id: 'sport', name: 'Sport', type: 'text', required: true },
      { id: 'team', name: 'Team', type: 'text' },
      { id: 'player', name: 'Player', type: 'text' },
      { id: 'itemType', name: 'Item Type', type: 'select', options: ['Jersey', 'Ball', 'Autograph', 'Ticket', 'Program', 'Photograph', 'Other'] },
      { id: 'year', name: 'Year', type: 'number' },
      { id: 'authentication', name: 'Authentication', type: 'text' },
      { id: 'condition', name: 'Condition', type: 'select', options: ['Mint', 'Near Mint', 'Excellent', 'Good', 'Fair'] },
    ],
  },
  {
    id: 'nft',
    name: 'NFT',
    icon: '🔗',
    description: 'Digital collectibles and NFTs',
    fields: [
      { id: 'name', name: 'NFT Name', type: 'text', required: true },
      { id: 'collection', name: 'Collection', type: 'text', required: true },
      { id: 'blockchain', name: 'Blockchain', type: 'select', options: ['Ethereum', 'Solana', 'Polygon', 'Base', 'Other'] },
      { id: 'tokenId', name: 'Token ID', type: 'text' },
      { id: 'contractAddress', name: 'Contract Address', type: 'text' },
      { id: 'marketplace', name: 'Marketplace', type: 'text' },
      { id: 'purchaseDate', name: 'Purchase Date', type: 'date' },
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
