
import React, { useState } from 'react';
import type { AssetCategory } from '../types.ts';
import { currencyFormatter, percentageFormatter } from '../utils/formatters.ts';
import AssetTable from './AssetTable.tsx';

interface PortfolioCardProps {
  category: AssetCategory;
  totalPortfolioValue: number;
}

const ProgressBar: React.FC<{ current: number; target: number }> = ({ current, target }) => {
    const isOver = current > target;
    const width = Math.min((current / target) * 100, 100);
    const overWidth = isOver ? Math.min(((current - target) / target) * 100, 100) : 0;
  
    return (
        <div className="w-full bg-gray-600 rounded-full h-2.5 relative overflow-hidden">
            <div 
              className="bg-primary h-2.5 rounded-l-full" 
              style={{ width: `${width}%` }}
            ></div>
            {isOver && (
                <div 
                    className="bg-danger h-2.5 absolute top-0"
                    style={{ left: `${width}%`, width: `${overWidth}%` }}
                ></div>
            )}
            <div 
                className="absolute top-0 bottom-0 border-l-2 border-dashed border-white/50"
                style={{ left: `${target}%` }}
                title={`Meta: ${target}%`}
            ></div>
      </div>
    );
};


const PortfolioCard: React.FC<PortfolioCardProps> = ({ category, totalPortfolioValue }) => {
  const [isOpen, setIsOpen] = useState(false);
  const currentAllocation = totalPortfolioValue > 0 ? (category.totalValue / totalPortfolioValue) : 0;
  const isOverallocated = currentAllocation > category.targetAllocation / 100;

  return (
    <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700/50 overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-primary/20">
      <div className="p-5">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-gray-700 rounded-lg">
            {category.icon}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{category.name}</h3>
            <p className="text-2xl font-semibold text-gray-100">{currencyFormatter.format(category.totalValue)}</p>
          </div>
        </div>
        
        <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
                <span className="text-gray-400">Alocação Atual:</span>
                <span className={`font-bold ${isOverallocated ? 'text-danger' : 'text-success'}`}>
                    {percentageFormatter.format(currentAllocation)}
                </span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-gray-400">Alocação Meta:</span>
                <span className="font-bold text-gray-300">
                    {percentageFormatter.format(category.targetAllocation / 100)}
                </span>
            </div>
            <ProgressBar current={currentAllocation * 100} target={category.targetAllocation} />
        </div>
      </div>
      <div className="bg-gray-800/50 px-5 py-3">
         <button 
            onClick={() => setIsOpen(!isOpen)}
            className="w-full text-center text-sm font-medium text-primary hover:text-indigo-400 transition-colors"
          >
            {isOpen ? 'Ocultar Ativos' : 'Ver Ativos'}
        </button>
      </div>
       {isOpen && (
          <div className="bg-gray-900/50">
            <AssetTable assets={category.assets} />
          </div>
        )}
    </div>
  );
};

export default PortfolioCard;