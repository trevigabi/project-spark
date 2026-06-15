Você é um Principal Product Designer + UX Architect + Staff Front-end Engineer especialista em SaaS B2B enterprise.

Crie uma plataforma web responsiva chamada **Pace Seller**, para uma indústria calçadista B2B (Tesla Footwear), com experiência premium, moderna e altamente utilizável em desktop e mobile.

## Contexto do produto

O Pace Seller substitui um processo atual baseado em PDF estático, WhatsApp e planilhas.

Hoje:

* coleção é enviada por PDF
* pedido é feito manualmente por WhatsApp
* ERP importa manualmente
* indústria não tem visibilidade do giro real das lojas

O produto resolve isso através de 3 pilares:

### 1. Catálogo & Pedido B2B

Uma vitrine digital da coleção onde lojistas e representantes fazem pedidos por grade.

Funcionalidades:

* catálogo de produtos
* busca e filtros avançados
* cards de produto com imagem, linha, categoria, preço do cliente e disponibilidade
* visualização detalhada do produto
* compra por grade (exemplo: 90 / 120 / 150 / 180 / 210)
* quantidade por numeração
* cálculo automático de total
* regras comerciais por cliente
* preços personalizados
* carrinho B2B
* checkout B2B
* histórico de pedidos
* recompra rápida
* favoritos
* status de pedidos

### 2. Estúdio de Marketing com IA

Área onde representantes e lojistas criam materiais promocionais automaticamente.

Fluxo:

1. usuário seleciona produtos do catálogo
2. escolhe objetivo da campanha
3. define tema visual
4. IA gera automaticamente uma lâmina promocional seguindo identidade da marca

Funcionalidades:

* biblioteca de templates
* IA generativa controlada pela marca
* editor leve
* exportação para WhatsApp, Instagram e impressão
* campanhas por coleção
* personalização por loja

### 3. Inteligência de Sell-out

A indústria recebe estoque atual da loja e calcula o que realmente vendeu.

Objetivo:
mostrar sell-in × sell-out e gerar inteligência comercial.

Funcionalidades:

* input manual de estoque
* importação via API
* dashboard de sell-out
* indicadores por:

  * loja
  * região
  * representante
  * linha
  * produto
* alertas de encalhe
* sugestão de reposição
* ranking de performance
* heatmap regional
* insights por IA

## Perfis de usuário

### 1. Indústria (Admin)

Responsável por:

* catálogo
* preços
* campanhas
* políticas comerciais
* dashboards
* gestão de usuários
* sell-out
* relatórios

### 2. Representante Comercial

Usa principalmente no celular durante visitas.

Necessidades:

* visualizar carteira de clientes
* montar pedidos rapidamente
* sugerir reposição
* acessar histórico
* gerar campanha personalizada
* acompanhar metas
* visualizar oportunidades

### 3. Lojista (Cliente B2B)

Necessidades:

* comprar coleção
* recompra rápida
* consultar histórico
* baixar materiais promocionais
* informar estoque
* receber recomendações

## Objetivo de UX

A plataforma deve parecer um produto SaaS premium moderno.

Referências visuais:

* Linear
* Stripe Dashboard
* Monday
* Shopify Admin
* Notion
* Hubspot
* Vercel

Evitar aparência de ERP antigo.

Visual:

* clean
* sofisticado
* enterprise
* moderno
* alto contraste visual
* excelente hierarquia
* muitos espaços bem utilizados
* responsivo mobile-first
* componentes reutilizáveis

## Crie as telas completas

### Autenticação

* login
* recuperação de senha
* seleção de perfil

### Dashboard principal

Diferente por perfil.

Admin:

* KPIs
* sell-in x sell-out
* performance comercial
* alertas
* campanhas
* giro de coleção

Representante:

* carteira de clientes
* pedidos recentes
* metas
* oportunidades
* produtos sugeridos

Lojista:

* novidades
* histórico
* recompra
* promoções
* recomendação de compra

### Catálogo

* grid/lista
* filtros
* busca
* cards premium
* detalhe do produto
* comparação
* favoritos

### Pedido por grade

Criar uma experiência MUITO inteligente e rápida para pedido em visita comercial no celular.

O representante precisa montar um pedido em menos de 2 minutos.

Criar:

* grade editável
* stepper de quantidade
* preenchimento inteligente
* sugestões automáticas
* validação comercial
* subtotal instantâneo

### Carrinho e Checkout B2B

* resumo do pedido
* política comercial
* condições de pagamento
* aprovação
* observações

### Histórico

* timeline de pedidos
* recompra com 1 clique
* comparação de compra

### Estúdio de Marketing IA

Criar experiência premium de criação assistida.

Fluxo visual tipo wizard:

1. selecionar produtos
2. selecionar tema
3. prompt assistido
4. preview em tempo real
5. exportação

### Sell-out Intelligence

Criar dashboards executivos avançados.

Adicionar:

* gráficos
* mapas
* tendências
* rankings
* alertas inteligentes
* insights acionáveis

### Gestão Admin

* usuários
* políticas
* preços
* catálogo
* campanhas
* permissões

## Arquitetura de UI

Crie:

* design system consistente
* sidebar inteligente
* top navigation
* responsividade completa
* dark mode opcional
* componentes modernos
* estados vazios
* loading
* feedbacks de sucesso
* UX excelente para toque no celular

## Regras importantes

* NÃO criar interface genérica
* NÃO criar cara de ERP antigo
* NÃO usar excesso de tabelas
* foco em UX comercial
* foco em velocidade de pedido
* criar experiência premium B2B
* projetar como produto escalável SaaS multi-tenant
* usar dados mock realistas da indústria calçadista

Entregue:

1. arquitetura de navegação
2. sitemap
3. design system
4. telas completas em alta fidelidade
5. componentes reutilizáveis
6. fluxos mobile e desktop
7. protótipo navegável
