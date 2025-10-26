import type { ReactNode } from 'react';

export interface Asset {
  id: string;
  ticker: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  totalValue: number;
  variation: number;
  profitability: number;
  currency?: 'BRL' | 'USD';
}

export interface AssetCategory {
  id: string;
  name: string;
  icon: ReactNode;
  assets: Asset[];
  totalValue: number;
  variation: number;
  profitability: number;
  targetAllocation: number; // in percent (e.g., 10 for 10%)
}

export interface Portfolio {
  [key: string]: AssetCategory;
}

export interface RebalancingSuggestion {
  categoryId: string;
  categoryName: string;
  amountToInvest: number;
  newAllocation: number;
}

/**
 * Defines the structured asset data expected from the AI parser.
 * This is used before reconstructing the full Portfolio object.
 */
export interface SimplifiedAsset {
  ticker: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  category: string; // "stocks", "fiis", etc.
  currency: 'BRL' | 'USD';
}