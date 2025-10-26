# Balanceador de Carteira Inteligente 📈🤖

Uma aplicação web moderna e interativa para ajudar investidores a visualizar, gerenciar e rebalancear sua carteira de investimentos com o poder da inteligência artificial do Google Gemini.

## ✨ Funcionalidades Principais

- **📊 Dashboard de Investimentos:** Visualize o valor total da sua carteira e a composição detalhada por categoria de ativos (Ações, FIIs, Cripto, ETFs, etc.), com gráficos de alocação atual vs. meta.

- **🤖 Assistente de Rebalanceamento com IA:** Informe seu aporte mensal e a IA sugere a distribuição ideal de capital entre as categorias de ativos para manter sua carteira alinhada com seus objetivos. Receba uma análise personalizada em linguagem natural sobre a estratégia de aporte.

- **🔍 Calculadora de Valuation com Análise de IA:** Ferramenta de análise fundamentalista que utiliza os métodos de **Décio Bazin** (preço teto focado em dividendos) e **Benjamin Graham** (preço justo/valor intrínseco). Com base nos indicadores, a IA gera um relatório detalhado sobre o valuation, a qualidade e a rentabilidade do ativo.

- **✍️ Atualização de Carteira por Texto (IA-Powered):** Esqueça os formulários! Simplesmente cole uma descrição em texto dos seus ativos (ex: "Tenho 100 ações de PETR4 com preço médio de R$ 30") e a IA irá extrair, estruturar e atualizar toda a sua carteira na aplicação.

- **📚 Glossário Financeiro Interativo:** Um glossário pesquisável com os principais termos do mercado financeiro para ajudar investidores iniciantes e experientes a entenderem todos os indicadores.

- **🔒 Gerenciamento Seguro de Chave de API:** Projetado para ser hospedado em ambientes estáticos (como o GitHub Pages), o app solicita a chave de API do Google Gemini no primeiro acesso e a armazena de forma segura apenas na sessão do navegador, sem expô-la.

## 🛠️ Tecnologias Utilizadas

- **Frontend:** React, TypeScript
- **Estilização:** Tailwind CSS
- **Inteligência Artificial:** Google Gemini API
- **Hospedagem:** Projetado para ser compatível com qualquer serviço de hospedagem estática (GitHub Pages, Vercel, Netlify).

## 🚀 Como Executar

Este projeto é configurado para rodar diretamente no navegador sem a necessidade de um passo de compilação (build).

1.  **Clone o Repositório:**
    ```bash
    git clone https://github.com/seu-usuario/seu-repositorio.git
    ```

2.  **Abra o `index.html`:**
    Navegue até a pasta do projeto e abra o arquivo `index.html` diretamente no seu navegador de preferência (Chrome, Firefox, etc.).

3.  **Insira sua Chave de API:**
    - Para usar as funcionalidades de IA, você precisará de uma chave de API do Google Gemini.
    - Siga o guia [aqui](https://aistudio.google.com/app/apikey) para obter sua chave gratuitamente.
    - Na primeira vez que abrir a aplicação, um modal aparecerá solicitando sua chave. Cole-a no campo indicado para começar a usar.

## 🖼️ Telas da Aplicação

*(Em breve: Adicione screenshots da visão geral, do assistente de rebalanceamento e da calculadora de valuation aqui.)*
