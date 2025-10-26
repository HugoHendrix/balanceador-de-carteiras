
import React from 'react';
import type { Asset } from '../types';
import { currencyFormatter, usdCurrencyFormatter, percentageFormatter } from '../utils/formatters';

interface AssetTableProps {
  assets: Asset[];
}

const AssetTable: React.FC<AssetTableProps> = ({ assets }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-400">
        <thead className="text-xs text-gray-300 uppercase bg-gray-700/50">
          <tr>
            <th scope="col" className="px-4 py-3">Ativo</th>
            <th scope="col" className="px-4 py-3 text-right">Valor Total</th>
            <th scope="col" className="px-4 py-3 text-right">Variação</th>
            <th scope="col" className="px-4 py-3 text-right">Preço Atual</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset) => {
            const formatter = asset.currency === 'USD' ? usdCurrencyFormatter : currencyFormatter;
            return (
              <tr key={asset.id} className="border-b border-gray-700 hover:bg-gray-700/30">
                <th scope="row" className="px-4 py-3 font-medium text-white whitespace-nowrap">
                  {asset.ticker}
                </th>
                <td className="px-4 py-3 text-right">{formatter.format(asset.totalValue)}</td>
                <td className={`px-4 py-3 text-right font-semibold ${asset.variation >= 0 ? 'text-success' : 'text-danger'}`}>
                  {percentageFormatter.format(asset.variation / 100)}
                </td>
                 <td className="px-4 py-3 text-right">{formatter.format(asset.currentPrice)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AssetTable;
