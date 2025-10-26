
import React from 'react';
import type { Portfolio } from '../types.ts';
import { StockIcon, FiiIcon, CryptoIcon, EtfIcon, TreasuryIcon, FixedIncomeIcon } from '../components/icons.tsx';

export const initialPortfolio: Portfolio = {
  stocks: {
    id: 'stocks',
    name: 'Ações',
    icon: <StockIcon className="w-8 h-8 text-blue-400" />,
    assets: [
      { id: '66d9ad202d185', ticker: 'SAPR4', quantity: 14, avgPrice: 6.70, currentPrice: 6.79, totalValue: 95.06, variation: -0.92, profitability: 2.21, currency: 'BRL' },
      { id: '66cc977d99912', ticker: 'CMIG3', quantity: 4, avgPrice: 14.68, currentPrice: 13.92, totalValue: 55.68, variation: -5.64, profitability: -5.23, currency: 'BRL' },
      { id: '66ad4109e41c8', ticker: 'WEGE3', quantity: 1, avgPrice: 38.00, currentPrice: 41.37, totalValue: 41.37, variation: 2.99, profitability: 8.92, currency: 'BRL' },
      { id: '63d2c9ead34db', ticker: 'PETR4', quantity: 1, avgPrice: 31.76, currentPrice: 29.84, totalValue: 29.84, variation: -9.52, profitability: -6.05, currency: 'BRL' },
    ],
    totalValue: 221.95,
    variation: -2.70,
    profitability: 5.62,
    targetAllocation: 10,
  },
  fiis: {
    id: 'fiis',
    name: 'FIIs',
    icon: <FiiIcon className="w-8 h-8 text-green-400" />,
    assets: [
      { id: 'business-and-trade-gray', ticker: 'KISU11', quantity: 61, avgPrice: 6.67, currentPrice: 6.75, totalValue: 411.75, variation: -3.08, profitability: 1.27, currency: 'BRL' },
    ],
    totalValue: 411.75,
    variation: -3.08,
    profitability: 1.27,
    targetAllocation: 15,
  },
  crypto: {
    id: 'crypto',
    name: 'Criptomoedas',
    icon: <CryptoIcon className="w-8 h-8 text-yellow-400" />,
    assets: [
      { id: 'usdc', ticker: 'USDC', quantity: 19.52307300, avgPrice: 5.52, currentPrice: 5.39, totalValue: 105.23, variation: -2.30, profitability: -2.30, currency: 'BRL' },
      { id: 'btc', ticker: 'BTC', quantity: 0.00009505, avgPrice: 591193.68, currentPrice: 600306.62, totalValue: 57.06, variation: 1.54, profitability: 1.54, currency: 'BRL' },
      { id: 'eth', ticker: 'ETH', quantity: 0.00263959, avgPrice: 14420.00, currentPrice: 21199.99, totalValue: 55.96, variation: 43.99, profitability: 47.01, currency: 'BRL' },
      { id: 'sol', ticker: 'SOL', quantity: 0.02067426, avgPrice: 817.18, currentPrice: 1034.27, totalValue: 21.38, variation: 8.87, profitability: 26.56, currency: 'BRL' },
      { id: 'ada', ticker: 'ADA', quantity: 2.57586700, avgPrice: 3.71, currentPrice: 3.52, totalValue: 9.07, variation: -6.38, profitability: -5.19, currency: 'BRL' },
    ],
    totalValue: 248.70,
    variation: 7.15,
    profitability: 20.72,
    targetAllocation: 5,
  },
  etfs: {
    id: 'etfs',
    name: 'ETFs Nacionais',
    icon: <EtfIcon className="w-8 h-8 text-indigo-400" />,
    assets: [
      { id: 'divo11', ticker: 'DIVO11', quantity: 3, avgPrice: 103.53, currentPrice: 106.61, totalValue: 319.83, variation: 2.10, profitability: 2.97, currency: 'BRL' },
    ],
    totalValue: 319.83,
    variation: 2.10,
    profitability: 2.97,
    targetAllocation: 15,
  },
  etfsInt: {
    id: 'etfsInt',
    name: 'ETFs Internacionais',
    icon: <EtfIcon className="w-8 h-8 text-purple-400" />,
    assets: [
      { id: 'voo', ticker: 'VOO', quantity: 0.16072953, avgPrice: 560.70, currentPrice: 622.55, totalValue: 100.06, variation: 8.75, profitability: 11.03, currency: 'USD' },
      { id: 'gld', ticker: 'GLD', quantity: 0.01676452, avgPrice: 298.18, currentPrice: 377.52, totalValue: 6.33, variation: 26.61, profitability: 26.61, currency: 'USD' },
    ],
    totalValue: 573.45, // Assuming USD value converted to BRL for total portfolio value calculation
    variation: 9.67,
    profitability: 15.52,
    targetAllocation: 25,
  },
  treasury: {
    id: 'treasury',
    name: 'Tesouro Direto',
    icon: <TreasuryIcon className="w-8 h-8 text-teal-400" />,
    assets: [
      { id: 'ipca2045', ticker: 'Tesouro IPCA+ 2045', quantity: 0.06, avgPrice: 4030, currentPrice: 4049.16, totalValue: 242.95, variation: 0.52, profitability: 0.52, currency: 'BRL' },
      { id: 'renda2030', ticker: 'Tesouro Renda+ 2030', quantity: 0.11, avgPrice: 1818.18, currentPrice: 1801.72, totalValue: 198.19, variation: -0.93, profitability: -0.93, currency: 'BRL' },
    ],
    totalValue: 441.14,
    variation: -0.14,
    profitability: -0.14,
    targetAllocation: 10,
  },
  fixedIncome: {
    id: 'fixedIncome',
    name: 'Renda Fixa',
    icon: <FixedIncomeIcon className="w-8 h-8 text-cyan-400" />,
    assets: [
      { id: 'cdb-sofisa', ticker: 'CDB Sofisa 110% CDI', quantity: 1, avgPrice: 200, currentPrice: 213.97, totalValue: 213.97, variation: 6.98, profitability: 6.98, currency: 'BRL' },
      { id: 'cdb-ouribank', ticker: 'CDB Ouribank 106% CDI', quantity: 1, avgPrice: 150, currentPrice: 151.32, totalValue: 151.32, variation: 0.88, profitability: 0.88, currency: 'BRL' },
    ],
    totalValue: 365.29,
    variation: 4.37,
    profitability: 6.54,
    targetAllocation: 20,
  },
};