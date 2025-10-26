
export interface GlossaryTerm {
  term: string;
  definition: string;
}

export const glossaryData: GlossaryTerm[] = [
    {
        term: 'Ações',
        definition: 'Representam uma pequena fração do capital social de uma empresa. Ao comprar uma ação, você se torna sócio da companhia.'
    },
    {
        term: 'Alocação de Ativos',
        definition: 'Estratégia de investimento que visa equilibrar risco e retorno, distribuindo o portfólio entre diferentes categorias de ativos, como ações, títulos e imóveis.'
    },
    {
        term: 'Criptomoedas',
        definition: 'Moedas digitais ou virtuais que usam criptografia para segurança. São descentralizadas e baseadas na tecnologia blockchain.'
    },
    {
        term: 'Dividend Yield (DY)',
        definition: 'Indicador que mede o rendimento de um dividendo em relação ao preço da ação. É calculado dividindo o valor dos dividendos pagos por ação pelo preço da ação.'
    },
    {
        term: 'Dividendos',
        definition: 'Parte do lucro de uma empresa que é distribuída aos seus acionistas. É uma forma de remuneração pelo capital investido.'
    },
    {
        term: 'Dívida Líquida / EBITDA',
        definition: 'Mede a saúde financeira de uma empresa, indicando quantos anos de geração de caixa (EBITDA) seriam necessários para pagar toda a sua dívida líquida. Valores baixos são preferíveis.'
    },
    {
        term: 'ETFs (Exchange Traded Funds)',
        definition: 'Fundos de investimento negociados na bolsa de valores como se fossem ações. Geralmente, replicam o desempenho de um índice de referência (ex: Ibovespa).'
    },
    {
        term: 'EV/EBITDA',
        definition: 'Múltiplo que compara o valor de mercado de uma empresa (Enterprise Value) com seu lucro antes de juros, impostos, depreciação e amortização. É usado para avaliar o valor da empresa.'
    },
    {
        term: 'FIIs (Fundos de Investimento Imobiliário)',
        definition: 'Fundos que investem em empreendimentos imobiliários (shoppings, prédios comerciais, galpões, etc.). Suas cotas são negociadas na bolsa e distribuem rendimentos mensais.'
    },
    {
        term: 'Liquidez Corrente',
        definition: 'Indicador da capacidade de uma empresa de pagar suas dívidas de curto prazo. É calculado dividindo o ativo circulante pelo passivo circulante. Um valor acima de 1 é geralmente considerado saudável.'
    },
    {
        term: 'LPA (Lucro por Ação)',
        definition: 'Indicador que mede o lucro líquido da empresa dividido pelo número total de ações emitidas. Mostra quanto de lucro cada ação gerou.'
    },
    {
        term: 'Margem Líquida',
        definition: 'Mede a porcentagem de lucro que a empresa obtém para cada real de receita. É calculada dividindo o lucro líquido pela receita líquida.'
    },
    {
        term: 'P/L (Preço/Lucro)',
        definition: 'Indicador que relaciona o preço atual da ação com o lucro por ação. Ajuda a avaliar se uma ação está "cara" ou "barata" em relação aos seus lucros.'
    },
    {
        term: 'P/VP (Preço/Valor Patrimonial)',
        definition: 'Compara o preço de mercado da ação com o valor patrimonial por ação (VPA). Um P/VP abaixo de 1 pode indicar que a ação está sendo negociada com desconto em relação ao seu valor contábil.'
    },
    {
        term: 'Payout',
        definition: 'A porcentagem do lucro líquido de uma empresa que é distribuída aos acionistas na forma de dividendos.'
    },
    {
        term: 'Preço Médio',
        definition: 'O custo médio de aquisição de todas as unidades de um mesmo ativo em sua carteira. É calculado dividindo o valor total pago pela quantidade total de ativos.'
    },
    {
        term: 'Rebalanceamento de Carteira',
        definition: 'O processo de ajustar a alocação de ativos da sua carteira para retornar às porcentagens-alvo definidas em sua estratégia. Envolve vender ativos que se valorizaram e comprar os que estão abaixo da meta.'
    },
    {
        term: 'Renda Fixa',
        definition: 'Investimentos com regras de remuneração definidas no momento da aplicação. O investidor sabe previamente qual será o critério para o rendimento (ex: Tesouro Direto, CDBs).'
    },
    {
        term: 'ROE (Return on Equity)',
        definition: 'Indicador de rentabilidade que mede a capacidade de uma empresa gerar lucro a partir do seu próprio capital (patrimônio líquido). Um ROE alto indica maior eficiência.'
    },
    {
        term: 'ROIC (Return on Invested Capital)',
        definition: 'Mede o retorno que uma empresa gera sobre todo o capital investido (próprio e de terceiros). É um indicador da eficiência da empresa na alocação de capital para gerar lucros.'
    },
    {
        term: 'Tesouro Direto',
        definition: 'Programa do Tesouro Nacional para venda de títulos públicos federais para pessoas físicas. É considerado o investimento mais seguro do país.'
    },
    {
        term: 'Ticker',
        definition: 'Um código único usado para identificar ações e outros ativos negociados na bolsa de valores (ex: PETR4, MGLU3).'
    },
    {
        term: 'Value Investing (Investimento em Valor)',
        definition: 'Estratégia de investimento que consiste em procurar e comprar ações por um preço abaixo do seu valor intrínseco (valor real). Popularizada por Benjamin Graham e Warren Buffett.'
    },
    {
        term: 'VPA (Valor Patrimonial por Ação)',
        definition: 'Indicador que representa o valor do patrimônio líquido da empresa dividido pelo número total de ações. Indica, teoricamente, quanto cada acionista receberia se a empresa fosse liquidada.'
    },
].sort((a, b) => a.term.localeCompare(b.term)); // Sort alphabetically
