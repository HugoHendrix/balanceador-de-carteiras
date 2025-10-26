
import React, { useState, useEffect } from 'react';
import { ClockIcon, SparklesIcon } from './icons';

const Header: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  return (
    <header className="bg-gray-800/50 backdrop-blur-sm sticky top-0 z-10 border-b border-gray-700">
      <div className="container mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <SparklesIcon className="w-8 h-8 text-primary" />
          <h1 className="text-xl md:text-2xl font-bold text-white">
            Balanceador de Carteira <span className="text-primary">Inteligente</span>
          </h1>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-gray-700 px-4 py-2 rounded-lg text-sm font-mono">
          <ClockIcon className="w-5 h-5 text-gray-400" />
          <span>{time.toLocaleTimeString('pt-BR')}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
