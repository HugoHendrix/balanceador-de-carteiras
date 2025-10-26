
import React, { useState, useMemo, useEffect } from 'react';
import { initialPortfolio } from './data/initialData';
import type { Portfolio, AssetCategory } from './types';
import Header from './components/Header';
import PortfolioCard from './components/PortfolioCard';
import RebalancingAdvisor from './components/RebalancingAdvisor';
import ValuationCalculator from './components/ValuationCalculator';
import UpdatePortfolioModal from './components/UpdatePortfolioModal';
import GlossaryModal from './components/GlossaryModal';
import ApiKeyModal from './components/ApiKeyModal'; // Import the new modal
import { initAi } from './services/geminiService'; // Import the AI initializer
import { currencyFormatter } from './utils/formatters';
import { UploadIcon, BookOpenIcon } from './components/icons';

const App: React.FC = () => {
  const [portfolio, setPortfolio] = useState<Portfolio>(initialPortfolio);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(() => sessionStorage.getItem('GEMINI_API_KEY'));

  useEffect(() => {
    if (apiKey) {
      initAi(apiKey);
    }
  }, [apiKey]);

  const handleApiKeySubmit = (key: string) => {
    sessionStorage.setItem('GEMINI_API_KEY', key);
    setApiKey(key);
  };

  const totalValue = useMemo(() => {
    return Object.values(portfolio).reduce((acc: number, category: AssetCategory) => acc + category.totalValue, 0);
  }, [portfolio]);

  if (!apiKey) {
    return <ApiKeyModal onApiKeySubmit={handleApiKeySubmit} />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-6">
        <div className="mb-8 p-6 bg-gray-800 rounded-2xl shadow-lg border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-2">Visão Geral da Carteira</h2>
          <p className="text-4xl font-extrabold text-primary mb-2">{currencyFormatter.format(totalValue)}</p>
          <p className="text-gray-400">Este é o valor consolidado de todos os seus investimentos.</p>
        </div>

        <RebalancingAdvisor portfolio={portfolio} totalValue={totalValue} />
        
        <div className="my-8">
            <ValuationCalculator onOpenGlossary={() => setIsGlossaryOpen(true)} />
        </div>

        <div className="mt-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Composição da Carteira</h2>
            <button
              onClick={() => setIsUpdateModalOpen(true)}
              className="flex items-center gap-2 bg-secondary hover:bg-purple-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
            >
              <UploadIcon className="w-5 h-5" />
              Atualizar via Texto
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.values(portfolio).map((category: AssetCategory) => (
              <PortfolioCard 
                key={category.id} 
                category={category} 
                totalPortfolioValue={totalValue}
              />
            ))}
          </div>
        </div>
      </main>
      <footer className="text-center p-4 text-gray-500 text-sm mt-8 border-t border-gray-800">
        <div className="container mx-auto flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
            <p>Balanceador de Carteira Inteligente © 2024</p>
            <button 
                onClick={() => setIsGlossaryOpen(true)}
                className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors"
                aria-label="Abrir glossário financeiro"
            >
                <BookOpenIcon className="w-5 h-5" />
                <span>Glossário Financeiro</span>
            </button>
        </div>
      </footer>

      <UpdatePortfolioModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        currentPortfolio={portfolio}
        onUpdatePortfolio={(newPortfolio) => {
          setPortfolio(newPortfolio);
          setIsUpdateModalOpen(false); // Close modal on success
        }}
      />

      <GlossaryModal 
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
      />
    </div>
  );
};

export default App;