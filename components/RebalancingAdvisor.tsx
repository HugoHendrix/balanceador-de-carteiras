import React, { useState, useCallback, useEffect } from 'react';
// FIX: Added AssetCategory to the import list to be used for typing.
import type { Portfolio, RebalancingSuggestion, AssetCategory } from '../types';
import { currencyFormatter, percentageFormatter } from '../utils/formatters';
import { generateBalancingAdvice } from '../services/geminiService';
import { LightBulbIcon } from './icons';

interface RebalancingAdvisorProps {
  portfolio: Portfolio;
  totalValue: number;
}

const RebalancingAdvisor: React.FC<RebalancingAdvisorProps> = ({ portfolio, totalValue }) => {
  const [contribution, setContribution] = useState<number>(1000);
  const [suggestions, setSuggestions] = useState<RebalancingSuggestion[]>([]);
  const [advice, setAdvice] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<Set<string>>(
    new Set(Object.keys(portfolio))
  );

  useEffect(() => {
    // Keep selection in sync if portfolio structure changes
    setSelectedCategoryIds(new Set(Object.keys(portfolio)));
  }, [portfolio]);

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategoryIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    setSelectedCategoryIds(new Set(Object.keys(portfolio)));
  };

  const handleDeselectAll = () => {
    setSelectedCategoryIds(new Set());
  };


  const calculateRebalancing = useCallback(() => {
    if (contribution <= 0 || totalValue <= 0 || selectedCategoryIds.size === 0) {
        if(selectedCategoryIds.size === 0) setError("Por favor, selecione ao menos uma categoria para o aporte.");
        return;
    }

    setIsLoading(true);
    setError(null);
    setAdvice('');
    setSuggestions([]);

    const newTotalValue = totalValue + contribution;
    
    // 1. Filter to only consider selected categories for investment
    // FIX: Explicitly type `category` as AssetCategory to allow property access, resolving errors on lines 64 and 102.
    const eligibleCategories = Object.values(portfolio).filter((category: AssetCategory) =>
      selectedCategoryIds.has(category.id)
    );

    // 2. From the eligible categories, find which ones are underweight
    const underweightCategories = eligibleCategories
      .map((category: AssetCategory) => {
        const currentAllocation = category.totalValue / totalValue;
        const targetAllocation = category.targetAllocation / 100;
        const shortfall = targetAllocation * newTotalValue - category.totalValue;
        return { ...category, shortfall };
      })
      .filter(c => c.shortfall > 0);

    if (underweightCategories.length === 0) {
        setAdvice("Nenhuma das categorias selecionadas precisa de aporte para rebalanceamento. Você já está bem alinhado com suas metas nessas áreas ou pode revisar sua seleção.");
        setSuggestions([]);
        setIsLoading(false);
        return;
    }

    const totalShortfall = underweightCategories.reduce((acc, c) => acc + c.shortfall, 0);

    const calculatedSuggestions = underweightCategories.map(category => {
      const proportion = category.shortfall / totalShortfall;
      const amountToInvest = proportion * contribution;
      const newTotalInCategory = category.totalValue + amountToInvest;
      const newAllocation = newTotalInCategory / newTotalValue;

      return {
        categoryId: category.id,
        categoryName: category.name,
        amountToInvest,
        newAllocation,
      };
    }).sort((a,b) => b.amountToInvest - a.amountToInvest);

    setSuggestions(calculatedSuggestions);

    // FIX: Explicitly type `c` as AssetCategory to resolve type inference issue.
    const selectedCategoryNames = eligibleCategories.map((c: AssetCategory) => c.name);
    generateBalancingAdvice(portfolio, calculatedSuggestions, contribution, selectedCategoryNames)
      .then(generatedAdvice => {
        setAdvice(generatedAdvice);
      })
      .catch(err => {
        console.error("Error fetching advice from Gemini:", err);
        setError("Não foi possível obter a sugestão da IA. Por favor, tente novamente.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [contribution, totalValue, portfolio, selectedCategoryIds]);

  return (
    <div className="p-6 bg-gradient-to-br from-gray-800 to-gray-800/70 rounded-2xl shadow-lg border border-gray-700">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <LightBulbIcon className="w-7 h-7 text-secondary" />
        Assistente de Rebalanceamento
      </h2>

      <div className="mb-6 bg-gray-900/30 p-4 rounded-lg">
        <h3 className="text-base font-semibold text-gray-300 mb-3">1. Selecione as Categorias para Aportar</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-2">
            {
              // FIX: Explicitly type `category` as AssetCategory to allow property access, resolving errors on lines 127-136.
              Object.values(portfolio).map((category: AssetCategory) => (
                <div key={category.id} className="flex items-center">
                    <input
                        type="checkbox"
                        id={`cat-${category.id}`}
                        checked={selectedCategoryIds.has(category.id)}
                        onChange={() => handleCategoryToggle(category.id)}
                        className="w-4 h-4 text-primary bg-gray-700 border-gray-600 rounded focus:ring-primary focus:ring-offset-gray-800"
                    />
                    <label htmlFor={`cat-${category.id}`} className="ml-2 text-sm font-medium text-gray-200 cursor-pointer">
                        {category.name}
                    </label>
                </div>
            ))}
        </div>
        <div className="flex gap-4 mt-3 border-t border-gray-700 pt-3">
            <button onClick={handleSelectAll} className="text-xs font-medium text-secondary hover:underline">Selecionar Todos</button>
            <button onClick={handleDeselectAll} className="text-xs font-medium text-secondary hover:underline">Limpar Seleção</button>
        </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
        <div className="md:col-span-1">
          <label htmlFor="contribution" className="block text-sm font-medium text-gray-300 mb-2">
            2. Seu Aporte Mensal (R$)
          </label>
          <input
            type="number"
            id="contribution"
            value={contribution}
            onChange={(e) => setContribution(Number(e.target.value))}
            className="w-full bg-gray-700 border-gray-600 text-white rounded-lg p-3 text-lg focus:ring-primary focus:border-primary transition"
            placeholder="Ex: 1000"
          />
        </div>
        <div className="md:col-span-2">
          <button
            onClick={calculateRebalancing}
            disabled={isLoading}
            className="w-full md:w-auto bg-primary hover:bg-indigo-500 disabled:bg-gray-600 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 text-lg flex items-center justify-center"
          >
            {isLoading ? (
                <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analisando...
                </>
            ) : 'Calcular Aporte Ideal'}
          </button>
        </div>
      </div>
      
      {error && <div className="mt-4 text-center text-danger bg-danger/10 p-3 rounded-lg">{error}</div>}

      {suggestions.length > 0 && !isLoading && (
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
                <h3 className="text-lg font-semibold mb-3">Sugestão de Aporte</h3>
                <div className="space-y-3 bg-gray-900/50 p-4 rounded-lg">
                    {suggestions.map(sug => (
                        <div key={sug.categoryId} className="flex justify-between items-center p-3 bg-gray-700/50 rounded-md">
                            <span className="font-medium text-gray-200">{sug.categoryName}</span>
                            <div className="text-right">
                                <span className="font-bold text-lg text-success">{currencyFormatter.format(sug.amountToInvest)}</span>
                                <p className="text-xs text-gray-400">Nova alocação: {percentageFormatter.format(sug.newAllocation)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {advice && (
                 <div className="bg-gray-900/50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-3 text-secondary">Análise da IA</h3>
                    <div className="prose prose-invert prose-sm text-gray-300" dangerouslySetInnerHTML={{__html: advice.replace(/\n/g, '<br />') }}></div>
                 </div>
            )}
        </div>
      )}
    </div>
  );
};

export default RebalancingAdvisor;