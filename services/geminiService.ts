
import { GoogleGenAI, Type } from "@google/genai";
import type { Portfolio, RebalancingSuggestion, AssetCategory, SimplifiedAsset } from '../types.ts';

let ai: GoogleGenAI | null = null;

/**
 * Initializes the GoogleGenAI instance with the provided API key.
 * This must be called once before any other AI functions can be used.
 * @param apiKey The user's Google Gemini API key.
 */
export function initAi(apiKey: string) {
    if (!apiKey) {
        console.warn("Attempted to initialize AI without an API key.");
        return;
    }
    ai = new GoogleGenAI({ apiKey });
}

function formatPortfolioForPrompt(portfolio: Portfolio): string {
    return Object.values(portfolio).map((cat: AssetCategory) => 
        `- ${cat.name}: Valor Atual: R$${cat.totalValue.toFixed(2)}, Alocação Meta: ${cat.targetAllocation}%`
    ).join('\n');
}

function formatSuggestionsForPrompt(suggestions: RebalancingSuggestion[]): string {
    if (suggestions.length === 0) {
        return "Nenhum aporte sugerido para as categorias selecionadas.";
    }
    return suggestions.map(sug =>
        `- ${sug.categoryName}: Investir R$${sug.amountToInvest.toFixed(2)}`
    ).join('\n');
}

const aiNotReadyError = "A chave de API do Gemini não foi configurada. Por favor, atualize a página e insira sua chave para usar os recursos de IA.";

export async function generateBalancingAdvice(
    portfolio: Portfolio, 
    suggestions: RebalancingSuggestion[],
    contribution: number,
    selectedCategoryNames: string[]
): Promise<string> {
    if (!ai) {
        throw new Error(aiNotReadyError);
    }
    
    const model = 'gemini-2.5-flash';

    const allCategoryNames = Object.values(portfolio).map(c => c.name);
    const isAllSelected = selectedCategoryNames.length === allCategoryNames.length;

    const selectionContext = !isAllSelected
        ? `\n**Foco do Aporte:**\nO usuário optou por considerar apenas as seguintes categorias para o aporte deste mês: ${selectedCategoryNames.join(', ')}.\n`
        : '';

    const prompt = `
    Como um consultor de investimentos experiente, analise a seguinte situação e forneça um conselho conciso e encorajador em português do Brasil.

    **Situação da Carteira:**
    ${formatPortfolioForPrompt(portfolio)}
    ${selectionContext}
    **Aporte Mensal:** R$${contribution.toFixed(2)}

    **Plano de Investimento Sugerido para este mês (com base na seleção do usuário):**
    ${formatSuggestionsForPrompt(suggestions)}

    **Sua Tarefa:**
    Escreva uma breve análise (2-3 parágrafos) que:
    1.  Explique de forma simples por que este plano de investimento (focado nas categorias selecionadas, se for o caso) ajuda o usuário a atingir seus objetivos de alocação.
    2.  Reforce a importância da disciplina e da estratégia de rebalanceamento a longo prazo.
    3.  Mantenha um tom profissional, positivo e motivador.
    4.  NÃO use formatação markdown como títulos (#), negrito (**) ou itálico (*). Use apenas quebras de linha.
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Falha ao gerar o conselho da API Gemini.");
    }
}

interface ValuationData {
    ticker: string;
    currentPrice: number;
    bazinPrice: number;
    grahamPrice: number;
    marginOfSafety: number;
    pl: number;
    roe: number;
}

export async function generateValuationAnalysis(data: ValuationData): Promise<string> {
     if (!ai) {
        throw new Error(aiNotReadyError);
    }
    
    const model = 'gemini-2.5-flash';

    const prompt = `
    Você é um analista de investimentos fundamentalista, com foco em valor (Value Investing). Sua tarefa é analisar os dados de uma ação fornecida pelo usuário e gerar um relatório claro e objetivo em português do Brasil.

    **Dados do Ativo:**
    - Ticker: ${data.ticker.toUpperCase()}
    - Preço Atual: R$${data.currentPrice.toFixed(2)}

    **Análise de Valuation:**
    - Preço Teto (Método Bazin): R$${data.bazinPrice.toFixed(2)}
    - Preço Justo (Valor Intrínseco - Método Graham): R$${data.grahamPrice.toFixed(2)}
    - Margem de Segurança (Baseado em Graham): ${(data.marginOfSafety * 100).toFixed(2)}%

    **Indicadores Fundamentalistas:**
    - P/L (Preço/Lucro): ${data.pl.toFixed(2)}
    - ROE (Retorno sobre o Patrimônio Líquido): ${data.roe.toFixed(2)}%

    **Seu Relatório de Análise:**

    Baseado nos dados fornecidos, estruture sua análise da seguinte forma, sem usar markdown (sem #, **, *).

    1.  **Valuation e Preço:**
        - Comente sobre o Preço Teto de Bazin. Explique o que o resultado de R$${data.bazinPrice.toFixed(2)} significa para um investidor focado em dividendos, comparando-o com o preço atual.
        - Comente sobre o Preço Justo de Graham. Explique o que o valor intrínseco de R$${data.grahamPrice.toFixed(2)} sugere sobre a ação estar potencialmente subvalorizada ou sobrevalorizada.
        - Analise a Margem de Segurança. Explique se a margem de ${(data.marginOfSafety * 100).toFixed(2)}% é considerada atrativa ou arriscada segundo os princípios do Value Investing.

    2.  **Qualidade e Rentabilidade:**
        - Analise o P/L de ${data.pl.toFixed(2)}. Comente se ele sugere que a ação está "cara" ou "barata" em relação aos seus lucros e o que isso pode indicar sobre as expectativas do mercado.
        - Analise o ROE de ${data.roe.toFixed(2)}%. Explique se este é um bom indicador da eficiência e rentabilidade da empresa.

    3.  **Conclusão da Análise:**
        - Forneça um parágrafo de resumo que consolide a análise. Conclua se, com base estritamente nos números fornecidos, a ação ${data.ticker.toUpperCase()} parece ser uma oportunidade interessante de investimento no momento, destacando os pontos mais fortes e os pontos de atenção.

    **Importante:**
    - Mantenha um tom neutro, educativo e profissional.
    - Finalize o relatório com o seguinte aviso obrigatório em uma nova linha: 'Lembre-se: Esta é uma análise baseada em dados e não constitui uma recomendação de compra ou venda. Faça sua própria pesquisa.'
    `;
    
     try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Falha ao gerar a análise de valuation da API Gemini.");
    }
}

export async function parsePortfolioData(textData: string): Promise<SimplifiedAsset[]> {
    if (!ai) {
        throw new Error(aiNotReadyError);
    }
    
    const model = 'gemini-2.5-flash';

    const validCategories = ['stocks', 'fiis', 'crypto', 'etfs', 'etfsInt', 'treasury', 'fixedIncome'];

    const prompt = `
    Você é um assistente inteligente de finanças. Sua tarefa é extrair informações de ativos financeiros de um texto não estruturado e retorná-las em um formato JSON.
    
    O texto a seguir contém uma lista de ativos de uma carteira de investimentos:
    ---
    ${textData}
    ---
    
    Analise o texto e para cada ativo, extraia as seguintes informações:
    1.  'ticker': O código do ativo (ex: "PETR4", "BTC", "VOO").
    2.  'quantity': A quantidade de cotas ou unidades.
    3.  'avgPrice': O preço médio de compra.
    4.  'currentPrice': O preço atual de mercado do ativo.
    5.  'category': A categoria do ativo. Deve ser OBRIGATORIAMENTE uma das seguintes opções: ${validCategories.join(', ')}. Use o bom senso para classificar (ex: PETR4 é 'stocks', KISU11 é 'fiis', BTC é 'crypto', VOO é 'etfsInt').
    6. 'currency': A moeda do ativo, deve ser 'BRL' ou 'USD'. Se não for especificado, assuma 'BRL' para ativos brasileiros e 'USD' para ativos internacionais.

    Retorne o resultado como um array de objetos JSON, seguindo estritamente o schema fornecido.
    `;

    const simplifiedAssetSchema = {
      type: Type.OBJECT,
      properties: {
        ticker: { type: Type.STRING, description: "O código de negociação do ativo. Ex: PETR4, BTC, VOO." },
        quantity: { type: Type.NUMBER, description: "A quantidade de cotas ou unidades do ativo." },
        avgPrice: { type: Type.NUMBER, description: "O preço médio de compra do ativo." },
        currentPrice: { type: Type.NUMBER, description: "O preço atual de mercado do ativo." },
        category: { type: Type.STRING, description: `A categoria do ativo. Deve ser uma das seguintes: ${validCategories.join(', ')}.` },
        currency: { type: Type.STRING, description: "A moeda do ativo, BRL ou USD.", enum: ['BRL', 'USD'] },
      },
      required: ['ticker', 'quantity', 'avgPrice', 'currentPrice', 'category', 'currency']
    };

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: simplifiedAssetSchema
                }
            }
        });
        
        const jsonResponse = JSON.parse(response.text);
        return jsonResponse as SimplifiedAsset[];

    } catch (error) {
        console.error("Error calling Gemini API for portfolio parsing:", error);
        throw new Error("Falha ao analisar os dados da carteira da API Gemini.");
    }
}