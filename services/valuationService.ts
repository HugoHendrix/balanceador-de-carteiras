/**
 * Calcula o Preço Teto de uma ação com base na fórmula de Décio Bazin.
 * A fórmula define o preço máximo que um investidor deveria pagar por uma ação
 * para garantir um retorno mínimo de 6% ao ano apenas com dividendos.
 * Fórmula: Preço Teto = Dividendo Anual por Ação / 0.06
 * @param dividendPerShare - O dividendo anual pago por ação.
 * @returns O preço teto calculado.
 */
export function calculateBazinPrice(dividendPerShare: number): number {
    if (dividendPerShare <= 0) {
        return 0;
    }
    return dividendPerShare / 0.06;
}

/**
 * Calcula o Valor Intrínseco (Preço Justo) de uma ação com base na fórmula de Benjamin Graham.
 * Esta fórmula foi desenvolvida para encontrar o valor "real" de uma empresa e 
 * identificar se uma ação está sendo negociada com desconto no mercado.
 * Fórmula: VI = √(22.5 × LPA × VPA)
 * @param lpa - Lucro Por Ação (mede a lucratividade da empresa).
 * @param vpa - Valor Patrimonial por Ação (mede o valor contábil da empresa).
 * @returns O valor intrínseco calculado.
 */
export function calculateGrahamPrice(lpa: number, vpa: number): number {
     if (lpa <= 0 || vpa <= 0) {
        return 0;
    }
    return Math.sqrt(22.5 * lpa * vpa);
}

/**
 * Calcula a Margem de Segurança percentual.
 * A margem de segurança é um princípio central do value investing, representando a
 * diferença entre o Valor Intrínseco de uma ação e seu preço de mercado atual.
 * Uma margem positiva indica que a ação pode estar subvalorizada.
 * @param intrinsicValue - O Valor Intrínseco calculado (ex: Preço Justo de Graham).
 * @param currentPrice - O preço atual de mercado da ação.
 * @returns A margem de segurança em percentual (ex: 0.15 para 15%).
 */
export function calculateMarginOfSafety(intrinsicValue: number, currentPrice: number): number {
    if (currentPrice <= 0) {
        return 0;
    }
    return (intrinsicValue - currentPrice) / currentPrice;
}