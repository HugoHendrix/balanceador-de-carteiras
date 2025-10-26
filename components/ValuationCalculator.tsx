import React, { useState } from 'react';
import { calculateBazinPrice, calculateGrahamPrice, calculateMarginOfSafety } from '../services/valuationService.ts';
import { generateValuationAnalysis } from '../services/geminiService.ts';
import { currencyFormatter, percentageFormatter } from '../utils/formatters.ts';
import { CalculatorIcon, BookOpenIcon, CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon } from './icons.tsx';

interface AnalysisResult {
    bazinPrice: number;
    grahamPrice: number;
    marginOfSafety: number;
    aiAnalysis: string;
}

interface Verdict {
    score: number;
    level: 'good' | 'average' | 'bad';
    title: string;
    subtitle: string;
    colorClasses: string;
    Icon: React.FC<{className?: string}>;
}

interface ValuationCalculatorProps {
    onOpenGlossary: () => void;
}

const ValuationCalculator: React.FC<ValuationCalculatorProps> = ({ onOpenGlossary }) => {
    const [inputs, setInputs] = useState({
        ticker: '',
        currentPrice: '',
        dividend: '',
        lpa: '',
        vpa: '',
        pl: '',
        roe: ''
    });
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [verdict, setVerdict] = useState<Verdict | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setInputs(prev => ({ ...prev, [id]: value }));
    };

    const handleAnalyze = async () => {
        const { ticker, currentPrice, dividend, lpa, vpa, pl, roe } = inputs;

        const numCurrentPrice = parseFloat(currentPrice);
        const numDividend = parseFloat(dividend);
        const numLpa = parseFloat(lpa);
        const numVpa = parseFloat(vpa);
        const numPl = parseFloat(pl);
        const numRoe = parseFloat(roe);

        if (!ticker || isNaN(numCurrentPrice) || numCurrentPrice <= 0) {
            setError("Por favor, preencha o Ticker do Ativo e o Preço Atual.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setResult(null);
        setVerdict(null);

        try {
            const bazinPrice = calculateBazinPrice(numDividend || 0);
            const grahamPrice = calculateGrahamPrice(numLpa || 0, numVpa || 0);
            const marginOfSafety = calculateMarginOfSafety(grahamPrice, numCurrentPrice);
            
            // --- Lógica do Veredito Rápido ---
            let score = 0;
            if (bazinPrice > numCurrentPrice && bazinPrice > 0) score++;
            if (grahamPrice > numCurrentPrice && grahamPrice > 0) score++;
            if (marginOfSafety > 0.20) score++; // Margem de segurança acima de 20%
            if (numRoe > 15) score++; // ROE considerado bom
            if (numPl > 0 && numPl < 15) score++; // P/L atrativo

            let currentVerdict: Verdict;
            if (score >= 4) {
                currentVerdict = { score, level: 'good', title: 'Excelente Oportunidade', subtitle: 'Warren Buffett daria uma espiada.', colorClasses: 'bg-success/10 text-success border-success/30', Icon: CheckCircleIcon };
            } else if (score >= 2) {
                currentVerdict = { score, level: 'average', title: 'Ponto de Atenção', subtitle: 'Nem 8, nem 80. Fique de olho.', colorClasses: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30', Icon: ExclamationTriangleIcon };
            } else {
                currentVerdict = { score, level: 'bad', title: 'Avalie com Cuidado', subtitle: 'Até o urso do mercado está com medo.', colorClasses: 'bg-danger/10 text-danger border-danger/30', Icon: XCircleIcon };
            }
            setVerdict(currentVerdict);
            // --- Fim da Lógica ---

            const aiAnalysis = await generateValuationAnalysis({
                ticker,
                currentPrice: numCurrentPrice,
                bazinPrice,
                grahamPrice,
                marginOfSafety,
                pl: numPl || 0,
                roe: numRoe || 0,
            });

            setResult({ bazinPrice, grahamPrice, marginOfSafety, aiAnalysis });

        } catch (err) {
            console.error("Error during analysis:", err);
            setError("Ocorreu um erro ao gerar a análise. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    const inputClasses = "w-full bg-gray-700 border-gray-600 text-white rounded-lg p-3 text-base focus:ring-primary focus:border-primary transition";
    const buttonClasses = "w-full bg-primary hover:bg-indigo-500 disabled:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 text-lg flex items-center justify-center";

    return (
        <div className="p-6 bg-gradient-to-br from-gray-800 to-gray-800/70 rounded-2xl shadow-lg border border-gray-700">
            <div className="flex justify-between items-start mb-6">
                 <h2 className="text-2xl font-bold flex items-center gap-2">
                    <CalculatorIcon className="w-7 h-7 text-secondary" />
                    Análise Fundamentalista de Ativos
                </h2>
                <button
                    onClick={onOpenGlossary}
                    className="flex-shrink-0 flex items-center gap-1.5 text-sm text-gray-400 hover:text-primary transition-colors text-right"
                    aria-label="Abrir glossário de termos fundamentalistas"
                >
                    <BookOpenIcon className="w-5 h-5" />
                    <span>O que são estes indicadores?</span>
                </button>
            </div>


            {/* --- FORMULÁRIO DE INPUTS --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Coluna 1: Dados Principais */}
                <div className="space-y-4">
                    <div>
                        <label htmlFor="ticker" className="block text-sm font-medium text-gray-300 mb-2">Ticker do Ativo</label>
                        <input type="text" id="ticker" value={inputs.ticker} onChange={handleInputChange} className={inputClasses} placeholder="Ex: SMFT3" />
                    </div>
                    <div>
                        <label htmlFor="currentPrice" className="block text-sm font-medium text-gray-300 mb-2">Preço Atual (R$)</label>
                        <input type="number" id="currentPrice" value={inputs.currentPrice} onChange={handleInputChange} className={inputClasses} placeholder="Ex: 25.70" />
                    </div>
                </div>

                {/* Coluna 2: Dados para Cálculos */}
                <div className="space-y-4">
                    <div>
                        <label htmlFor="dividend" className="block text-sm font-medium text-gray-300 mb-2">Dividendo Anual/Ação (Bazin)</label>
                        <input type="number" id="dividend" value={inputs.dividend} onChange={handleInputChange} className={inputClasses} placeholder="Ex: 0.64" />
                    </div>
                     <div className="flex gap-4">
                        <div>
                            <label htmlFor="lpa" className="block text-sm font-medium text-gray-300 mb-2">LPA (Graham)</label>
                            <input type="number" id="lpa" value={inputs.lpa} onChange={handleInputChange} className={inputClasses} placeholder="Ex: 0.90" />
                        </div>
                        <div>
                            <label htmlFor="vpa" className="block text-sm font-medium text-gray-300 mb-2">VPA (Graham)</label>
                            <input type="number" id="vpa" value={inputs.vpa} onChange={handleInputChange} className={inputClasses} placeholder="Ex: 9.62" />
                        </div>
                    </div>
                </div>

                {/* Coluna 3: Indicadores Adicionais */}
                <div className="space-y-4">
                    <div>
                        <label htmlFor="pl" className="block text-sm font-medium text-gray-300 mb-2">P/L</label>
                        <input type="number" id="pl" value={inputs.pl} onChange={handleInputChange} className={inputClasses} placeholder="Ex: 28.57" />
                    </div>
                    <div>
                        <label htmlFor="roe" className="block text-sm font-medium text-gray-300 mb-2">ROE (%)</label>
                        <input type="number" id="roe" value={inputs.roe} onChange={handleInputChange} className={inputClasses} placeholder="Ex: 9.41" />
                    </div>
                </div>
            </div>

            <div className="mt-6">
                <button onClick={handleAnalyze} disabled={isLoading} className={buttonClasses}>
                    {isLoading ? (
                        <><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="http://www.w3.org/2000/svg"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Analisando...</>
                    ) : 'Analisar Ativo'}
                </button>
            </div>

             {error && <div className="mt-4 text-center text-danger bg-danger/10 p-3 rounded-lg">{error}</div>}

            {/* --- SEÇÃO DE RESULTADOS --- */}
            {result && verdict && !isLoading && (
                <div className="mt-8 pt-6 border-t border-gray-700">
                    <h3 className="text-xl font-bold text-white mb-4">Resultados da Análise para {inputs.ticker.toUpperCase()}</h3>
                    
                    {/* Veredito Rápido */}
                    <div className="mb-6">
                         <div className={`p-4 rounded-lg border flex items-center gap-4 ${verdict.colorClasses}`}>
                            <verdict.Icon className="w-10 h-10 flex-shrink-0" />
                            <div>
                                <h4 className="font-bold text-lg">{verdict.title} (Score: {verdict.score}/5)</h4>
                                <p className="text-sm opacity-90">{verdict.subtitle}</p>
                            </div>
                        </div>
                        {/* Legenda */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3 text-xs text-gray-400 text-center">
                            <div className="bg-success/10 p-2 rounded flex items-center gap-1.5"><CheckCircleIcon className="w-4 h-4 text-success" /><span>Ativo parece descontado e/ou com bons fundamentos.</span></div>
                            <div className="bg-yellow-500/10 p-2 rounded flex items-center gap-1.5"><ExclamationTriangleIcon className="w-4 h-4 text-yellow-400" /><span>Indicadores mistos. Requer análise adicional.</span></div>
                            <div className="bg-danger/10 p-2 rounded flex items-center gap-1.5"><XCircleIcon className="w-4 h-4 text-danger" /><span>Ativo parece caro e/ou com fundamentos frágeis.</span></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6 text-center">
                        <div className="bg-gray-900/50 p-4 rounded-lg">
                            <h4 className="text-sm text-gray-400 mb-1">Preço Teto (Bazin)</h4>
                            <p className={`text-2xl font-bold ${result.bazinPrice > parseFloat(inputs.currentPrice) ? 'text-success' : 'text-danger'}`}>{currencyFormatter.format(result.bazinPrice)}</p>
                        </div>
                        <div className="bg-gray-900/50 p-4 rounded-lg">
                            <h4 className="text-sm text-gray-400 mb-1">Preço Justo (Graham)</h4>
                             <p className={`text-2xl font-bold ${result.grahamPrice > parseFloat(inputs.currentPrice) ? 'text-success' : 'text-danger'}`}>{currencyFormatter.format(result.grahamPrice)}</p>
                        </div>
                        <div className="bg-gray-900/50 p-4 rounded-lg">
                             <h4 className="text-sm text-gray-400 mb-1">Margem de Segurança</h4>
                            <p className={`text-2xl font-bold ${result.marginOfSafety > 0 ? 'text-success' : 'text-danger'}`}>{percentageFormatter.format(result.marginOfSafety)}</p>
                        </div>
                    </div>
                    
                    <div className="bg-gray-900/50 p-6 rounded-lg">
                        <h4 className="text-lg font-semibold mb-3 text-secondary">Análise Detalhada da IA</h4>
                        <div className="prose prose-invert prose-sm text-gray-300 whitespace-pre-line" dangerouslySetInnerHTML={{ __html: result.aiAnalysis }}></div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ValuationCalculator;