
import React, { useState } from 'react';
import { SparklesIcon } from './icons.tsx';

interface ApiKeyModalProps {
    onApiKeySubmit: (key: string) => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onApiKeySubmit }) => {
    const [apiKey, setApiKey] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (apiKey.trim()) {
            onApiKeySubmit(apiKey.trim());
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900 flex justify-center items-center z-50 p-4">
            <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 w-full max-w-md text-center p-8 transform transition-all animate-fade-in-up">
                <SparklesIcon className="w-12 h-12 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Configure sua Chave de API do Gemini</h2>
                <p className="text-gray-400 mb-6">Para habilitar os recursos de inteligência artificial, por favor, insira sua chave de API do Google AI Studio.</p>

                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Cole sua chave de API aqui"
                        className="w-full bg-gray-700 border-gray-600 text-white rounded-lg p-3 text-base focus:ring-primary focus:border-primary transition mb-4"
                        aria-label="Gemini API Key Input"
                    />
                    <button
                        type="submit"
                        disabled={!apiKey.trim()}
                        className="w-full bg-primary hover:bg-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 text-lg"
                    >
                        Salvar e Continuar
                    </button>
                </form>
                <p className="text-xs text-gray-500 mt-4">
                    Sua chave será salva apenas no seu navegador durante esta sessão.
                    <br />
                    <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline">
                        Obtenha sua chave de API gratuitamente aqui.
                    </a>
                </p>
            </div>
             <style>{`
                @keyframes fade-in-up {
                    0% {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default ApiKeyModal;