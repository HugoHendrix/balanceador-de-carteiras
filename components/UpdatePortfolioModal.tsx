import React, { useState } from 'react';
import type { Portfolio, SimplifiedAsset, Asset } from '../types.ts';
import { parsePortfolioData } from '../services/geminiService.ts';

interface UpdatePortfolioModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentPortfolio: Portfolio;
    onUpdatePortfolio: (newPortfolio: Portfolio) => void;
}

function reconstructPortfolio(
    parsedAssets: SimplifiedAsset[],
    currentPortfolio: Portfolio
): Portfolio {
    // Create a deep copy to avoid mutating the original state object
    const newPortfolio: Portfolio = JSON.parse(JSON.stringify(currentPortfolio));

    // Reset assets and totals for all categories
    for (const key in newPortfolio) {
        newPortfolio[key].assets = [];
        newPortfolio[key].totalValue = 0;
    }

    // Populate the new portfolio with parsed assets
    for (const pAsset of parsedAssets) {
        const categoryKey = pAsset.category;
        if (newPortfolio[categoryKey]) {
            const totalValue = pAsset.quantity * pAsset.currentPrice;
            const profitability = pAsset.avgPrice > 0 ? ((pAsset.currentPrice / pAsset.avgPrice) - 1) * 100 : 0;
            
            const newAsset: Asset = {
                id: `${pAsset.ticker}-${Date.now()}-${Math.random()}`, // Generate a simple unique ID
                ticker: pAsset.ticker.toUpperCase(),
                quantity: pAsset.quantity,
                avgPrice: pAsset.avgPrice,
                currentPrice: pAsset.currentPrice,
                totalValue: totalValue,
                variation: profitability,
                profitability: profitability,
                currency: pAsset.currency || 'BRL',
            };
            newPortfolio[categoryKey].assets.push(newAsset);
        } else {
            console.warn(`Unrecognized category: '${categoryKey}' for ticker ${pAsset.ticker}`);
        }
    }

    // Recalculate category totals and profitability
    for (const key in newPortfolio) {
        const category = newPortfolio[key];
        const categoryTotalValue = category.assets.reduce((sum, asset) => sum + asset.totalValue, 0);
        
        const totalInvested = category.assets.reduce((sum, asset) => sum + (asset.quantity * asset.avgPrice), 0);
        const weightedProfitability = totalInvested > 0 ? ((categoryTotalValue / totalInvested) - 1) * 100 : 0;

        category.totalValue = categoryTotalValue;
        category.profitability = weightedProfitability;
        category.variation = weightedProfitability;
    }

    return newPortfolio;
}

const exampleText = `Ações:
ITSA4, 150 cotas, preço médio 10.10, preço atual 10.25
WEGE3, 25 cotas, PM 38.50, atual 41.30

FIIs:
KISU11 - 100 cotas, médio 8.50, atual 8.75

Cripto:
0.005 BTC, comprei a 300000, agora vale 350000
100 USDC, PM 5.20, atual 5.15
`;

const UpdatePortfolioModal: React.FC<UpdatePortfolioModalProps> = ({ isOpen, onClose, currentPortfolio, onUpdatePortfolio }) => {
    const [textData, setTextData] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleUpdate = async () => {
        if (!textData.trim()) {
            setError("Por favor, cole os dados da sua carteira.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const parsedAssets = await parsePortfolioData(textData);
            if (parsedAssets.length === 0) {
                 setError("A IA não conseguiu extrair nenhum ativo do texto fornecido. Tente formatar os dados de forma mais clara, como no exemplo.");
                 setIsLoading(false);
                 return;
            }
            const newPortfolio = reconstructPortfolio(parsedAssets, currentPortfolio);
            onUpdatePortfolio(newPortfolio);
        } catch (err) {
            console.error(err);
            setError("Ocorreu um erro ao analisar os dados. Verifique o formato e tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="p-6 border-b border-gray-700">
                    <h2 className="text-xl font-bold text-white">Atualizar Carteira via Texto</h2>
                    <p className="text-sm text-gray-400 mt-1">Cole os dados da sua carteira abaixo. A IA irá extrair os ativos e atualizar sua composição.</p>
                </div>
                
                <div className="p-6 overflow-y-auto flex-grow">
                    <textarea
                        value={textData}
                        onChange={(e) => setTextData(e.target.value)}
                        placeholder="Cole os dados aqui..."
                        className="w-full h-48 bg-gray-900 border border-gray-600 text-gray-300 rounded-lg p-3 text-sm font-mono focus:ring-primary focus:border-primary transition"
                    />

                    <div className="mt-4 p-3 bg-gray-900/50 rounded-lg">
                        <h4 className="text-xs font-semibold text-gray-400 mb-2">Exemplo de formato:</h4>
                        <pre className="text-xs text-gray-500 whitespace-pre-wrap">{exampleText}</pre>
                    </div>

                    {error && <div className="mt-4 text-center text-danger bg-danger/10 p-3 rounded-lg text-sm">{error}</div>}
                </div>

                <div className="p-6 border-t border-gray-700 flex justify-end items-center gap-4">
                     <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors px-4 py-2">
                        Cancelar
                    </button>
                    <button
                        onClick={handleUpdate}
                        disabled={isLoading}
                        className="bg-primary hover:bg-indigo-500 disabled:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 flex items-center justify-center min-w-[150px]"
                    >
                         {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                Analisando...
                            </>
                        ) : 'Atualizar Carteira'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpdatePortfolioModal;