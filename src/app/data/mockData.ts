export type Grade = { [size: string]: number };

export interface Product {
  id: string;
  name: string;
  reference: string;
  line: string;
  category: string;
  collection: string;
  price: number;
  priceRetail: number;
  image: string;
  availability: 'disponível' | 'baixo estoque' | 'esgotado';
  colors: string[];
  material: string;
  isFavorite?: boolean;
  rating: number;
  soldUnits: number;
  grades: Grade;
  description: string;
}

export interface CommercialPolicy {
  id: string;
  name: string;
  discount: number;
  paymentCondition: string;
  minOrderValue: number;
}

export interface Order {
  id: string;
  date: string;
  client: string;
  clientId: string;
  rep: string;
  status: 'aprovado' | 'em análise' | 'faturado' | 'cancelado' | 'entregue';
  total: number;
  items: number;
  paymentCondition: string;
  collection: string;
}

export interface Client {
  id: string;
  name: string;
  cnpj: string;
  city: string;
  state: string;
  region: string;
  rep: string;
  lastOrder: string;
  totalPurchased: number;
  status: 'ativo' | 'inativo' | 'em aberto';
  avatar: string;
  policyId: string;
}

export interface SelloutRecord {
  month: string;
  sellIn: number;
  sellOut: number;
  stock: number;
}

export interface RegionPerformance {
  region: string;
  revenue: number;
  target: number;
  growth: number;
  orders: number;
}

export const commercialPolicies: CommercialPolicy[] = [
  { id: 'TAB-A', name: 'Tabela A', discount: 0, paymentCondition: '5x sem juros', minOrderValue: 1500 },
  { id: 'TAB-B', name: 'Tabela B', discount: 3, paymentCondition: '5x sem juros', minOrderValue: 1200 },
  { id: 'TAB-C', name: 'Tabela C', discount: 5, paymentCondition: '3x sem juros', minOrderValue: 800 },
];

export const products: Product[] = [
  {
    id: 'P001',
    name: 'Flow XL Denim',
    reference: '2502-19',
    line: 'Flow XL',
    category: 'Tênis',
    collection: 'Coleção 2026',
    price: 154.95,
    priceRetail: 309.90,
    image: 'https://cdn.dooca.store/153486/products/flow-xl-2502-10-black-reflect-b-suclc_1600x1600+fill_ffffff.jpg?v=1773944251',
    availability: 'disponível',
    colors: ['Denim', 'Azul'],
    material: 'Lona',
    isFavorite: true,
    rating: 4.8,
    soldUnits: 1400,
    description: 'Tênis infantil linha Flow XL, modelo Denim. Grade 90-120-150-180-210.',
    grades: { '90': 240, '120': 180, '150': 320, '180': 60, '210': 120 },
  },
  {
    id: 'P002',
    name: 'Coil Branco',
    reference: '2510-01',
    line: 'Coil',
    category: 'Tênis',
    collection: 'Coleção 2026',
    price: 107.48,
    priceRetail: 214.95,
    image: 'https://cdn.dooca.store/153486/products/226-tesla-1_1600x1600+fill_ffffff.jpg?v=1727965004',
    availability: 'disponível',
    colors: ['Branco'],
    material: 'Sintético',
    isFavorite: false,
    rating: 4.6,
    soldUnits: 1200,
    description: 'Tênis infantil linha Coil, modelo Branco.',
    grades: { '90': 180, '120': 220, '150': 300, '180': 140, '210': 80 },
  },
  {
    id: 'P003',
    name: 'Hertz Art Vermelho',
    reference: '2489-04',
    line: 'Hertz Art',
    category: 'Tênis',
    collection: 'Coleção 2026',
    price: 124.95,
    priceRetail: 249.90,
    image: 'https://cdn.dooca.store/153486/products/21-tesla_1600x1600+fill_ffffff.jpg?v=1720100415',
    availability: 'baixo estoque',
    colors: ['Vermelho', 'Branco'],
    material: 'Sintético',
    isFavorite: false,
    rating: 4.2,
    soldUnits: 480,
    description: 'Tênis infantil linha Hertz Art, modelo Vermelho.',
    grades: { '90': 20, '120': 30, '150': 40, '180': 15, '210': 10 },
  },
  {
    id: 'P004',
    name: 'Hertz Marrom',
    reference: '2491-07',
    line: 'Hertz',
    category: 'Tênis',
    collection: 'Coleção 2026',
    price: 124.95,
    priceRetail: 249.90,
    image: 'https://cdn.dooca.store/153486/products/dsc00810jpg_1600x1600+fill_ffffff.jpg?v=1759512194',
    availability: 'disponível',
    colors: ['Marrom'],
    material: 'Sintético',
    isFavorite: false,
    rating: 4.5,
    soldUnits: 920,
    description: 'Tênis infantil linha Hertz, modelo Marrom.',
    grades: { '90': 160, '120': 200, '150': 260, '180': 120, '210': 60 },
  },
  {
    id: 'P005',
    name: 'Flow Preto',
    reference: '2501-02',
    line: 'Flow',
    category: 'Tênis',
    collection: 'Coleção 2026',
    price: 109.95,
    priceRetail: 219.90,
    image: 'https://cdn.dooca.store/153486/products/flow-xl-2502-10-black-reflect-b-suclc_1600x1600+fill_ffffff.jpg?v=1773944251',
    availability: 'disponível',
    colors: ['Preto'],
    material: 'Sintético',
    isFavorite: false,
    rating: 4.6,
    soldUnits: 1060,
    description: 'Tênis infantil linha Flow, modelo Preto.',
    grades: { '90': 200, '120': 240, '150': 280, '180': 100, '210': 60 },
  },
  {
    id: 'P006',
    name: 'Coil Navy',
    reference: '2511-03',
    line: 'Coil',
    category: 'Tênis',
    collection: 'Coleção 2026',
    price: 107.48,
    priceRetail: 214.95,
    image: 'https://cdn.dooca.store/153486/products/226-tesla-1_1600x1600+fill_ffffff.jpg?v=1727965004',
    availability: 'disponível',
    colors: ['Navy', 'Branco'],
    material: 'Sintético',
    isFavorite: false,
    rating: 4.4,
    soldUnits: 840,
    description: 'Tênis infantil linha Coil, modelo Navy.',
    grades: { '90': 140, '120': 180, '150': 220, '180': 100, '210': 50 },
  },
  {
    id: 'P007',
    name: 'Hertz Art Azul',
    reference: '2489-06',
    line: 'Hertz Art',
    category: 'Tênis',
    collection: 'Coleção 2026',
    price: 124.95,
    priceRetail: 249.90,
    image: 'https://cdn.dooca.store/153486/products/21-tesla_1600x1600+fill_ffffff.jpg?v=1720100415',
    availability: 'disponível',
    colors: ['Azul', 'Branco'],
    material: 'Sintético',
    isFavorite: false,
    rating: 4.3,
    soldUnits: 560,
    description: 'Tênis infantil linha Hertz Art, modelo Azul.',
    grades: { '90': 100, '120': 140, '150': 180, '180': 80, '210': 40 },
  },
  {
    id: 'P008',
    name: 'Flow XL Preto',
    reference: '2502-02',
    line: 'Flow XL',
    category: 'Tênis',
    collection: 'Coleção 2026',
    price: 154.95,
    priceRetail: 309.90,
    image: 'https://cdn.dooca.store/153486/products/dsc00810jpg_1600x1600+fill_ffffff.jpg?v=1759512194',
    availability: 'disponível',
    colors: ['Preto'],
    material: 'Lona',
    isFavorite: true,
    rating: 4.7,
    soldUnits: 1100,
    description: 'Tênis infantil linha Flow XL, modelo Preto.',
    grades: { '90': 200, '120': 250, '150': 300, '180': 120, '210': 70 },
  },
];

export const orders: Order[] = [
  { id: 'PED-2026-0412', date: '2026-06-09', client: 'Calçadão Paulista LTDA', clientId: 'CLI-001', rep: 'Marcos Andrade', status: 'aprovado', total: 10540.00, items: 124, paymentCondition: '5x sem juros', collection: 'Coleção 2026' },
  { id: 'PED-2026-0411', date: '2026-06-08', client: 'Sapataria Mineira', clientId: 'CLI-002', rep: 'Fernanda Lima', status: 'faturado', total: 7310.00, items: 86, paymentCondition: '5x sem juros', collection: 'Coleção 2026' },
  { id: 'PED-2026-0410', date: '2026-06-07', client: 'Mundo dos Sapatos RJ', clientId: 'CLI-003', rep: 'Carlos Mendes', status: 'em análise', total: 14616.00, items: 168, paymentCondition: '5x sem juros', collection: 'Coleção 2026' },
  { id: 'PED-2026-0409', date: '2026-06-06', client: 'Pé de Pato Bahia', clientId: 'CLI-004', rep: 'Ana Santos', status: 'entregue', total: 5760.00, items: 72, paymentCondition: '3x sem juros', collection: 'Coleção 2026' },
  { id: 'PED-2026-0408', date: '2026-06-05', client: 'Shoestore Norte', clientId: 'CLI-005', rep: 'Marcos Andrade', status: 'cancelado', total: 3840.00, items: 48, paymentCondition: '3x sem juros', collection: 'Coleção 2026' },
  { id: 'PED-2026-0407', date: '2026-06-04', client: 'Fashion Feet SP', clientId: 'CLI-006', rep: 'Fernanda Lima', status: 'entregue', total: 18480.00, items: 210, paymentCondition: '5x sem juros', collection: 'Coleção 2026' },
  { id: 'PED-2026-0406', date: '2026-06-03', client: 'Step Up Calçados', clientId: 'CLI-007', rep: 'Carlos Mendes', status: 'faturado', total: 9180.00, items: 108, paymentCondition: '5x sem juros', collection: 'Coleção 2026' },
  { id: 'PED-2026-0405', date: '2026-06-02', client: 'Andar Bem Gaúcha', clientId: 'CLI-008', rep: 'Ana Santos', status: 'entregue', total: 5120.00, items: 64, paymentCondition: '3x sem juros', collection: 'Coleção 2026' },
];

export const clients: Client[] = [
  { id: 'CLI-001', name: 'Calçadão Paulista LTDA', cnpj: '12.345.678/0001-90', city: 'São Paulo', state: 'SP', region: 'Sudeste', rep: 'Marcos Andrade', lastOrder: '2026-06-09', totalPurchased: 142000, status: 'ativo', avatar: 'CP', policyId: 'TAB-A' },
  { id: 'CLI-002', name: 'Sapataria Mineira', cnpj: '23.456.789/0001-01', city: 'Belo Horizonte', state: 'MG', region: 'Sudeste', rep: 'Fernanda Lima', lastOrder: '2026-06-08', totalPurchased: 76500, status: 'ativo', avatar: 'SM', policyId: 'TAB-B' },
  { id: 'CLI-003', name: 'Mundo dos Sapatos RJ', cnpj: '34.567.890/0001-12', city: 'Rio de Janeiro', state: 'RJ', region: 'Sudeste', rep: 'Carlos Mendes', lastOrder: '2026-06-07', totalPurchased: 196000, status: 'ativo', avatar: 'MS', policyId: 'TAB-A' },
  { id: 'CLI-004', name: 'Pé de Pato Bahia', cnpj: '45.678.901/0001-23', city: 'Salvador', state: 'BA', region: 'Nordeste', rep: 'Ana Santos', lastOrder: '2026-06-06', totalPurchased: 54000, status: 'ativo', avatar: 'PB', policyId: 'TAB-C' },
  { id: 'CLI-005', name: 'Shoestore Norte', cnpj: '56.789.012/0001-34', city: 'Manaus', state: 'AM', region: 'Norte', rep: 'Marcos Andrade', lastOrder: '2026-06-05', totalPurchased: 33400, status: 'em aberto', avatar: 'SN', policyId: 'TAB-C' },
  { id: 'CLI-006', name: 'Fashion Feet SP', cnpj: '67.890.123/0001-45', city: 'Campinas', state: 'SP', region: 'Sudeste', rep: 'Fernanda Lima', lastOrder: '2026-06-04', totalPurchased: 246000, status: 'ativo', avatar: 'FF', policyId: 'TAB-A' },
  { id: 'CLI-007', name: 'Step Up Calçados', cnpj: '78.901.234/0001-56', city: 'Curitiba', state: 'PR', region: 'Sul', rep: 'Carlos Mendes', lastOrder: '2026-06-03', totalPurchased: 123500, status: 'ativo', avatar: 'SU', policyId: 'TAB-B' },
  { id: 'CLI-008', name: 'Andar Bem Gaúcha', cnpj: '89.012.345/0001-67', city: 'Porto Alegre', state: 'RS', region: 'Sul', rep: 'Ana Santos', lastOrder: '2026-06-02', totalPurchased: 70400, status: 'ativo', avatar: 'AB', policyId: 'TAB-B' },
  { id: 'CLI-009', name: 'Passo Certo Campinas', cnpj: '98.765.432/0001-11', city: 'Campinas', state: 'SP', region: 'Sudeste', rep: 'Marcos Andrade', lastOrder: '2026-06-01', totalPurchased: 87000, status: 'ativo', avatar: 'PC', policyId: 'TAB-A' },
  { id: 'CLI-010', name: 'Péquenos do Sul', cnpj: '11.222.333/0001-22', city: 'Florianópolis', state: 'SC', region: 'Sul', rep: 'Marcos Andrade', lastOrder: '2026-05-28', totalPurchased: 45200, status: 'ativo', avatar: 'PS', policyId: 'TAB-B' },
  { id: 'CLI-011', name: 'Caminhos Infantis RJ', cnpj: '22.333.444/0001-33', city: 'Niterói', state: 'RJ', region: 'Sudeste', rep: 'Marcos Andrade', lastOrder: '2026-05-25', totalPurchased: 67800, status: 'em aberto', avatar: 'CI', policyId: 'TAB-A' },
  { id: 'CLI-012', name: 'Pé de Anjo Brasília', cnpj: '33.444.555/0001-44', city: 'Brasília', state: 'DF', region: 'Centro-Oeste', rep: 'Marcos Andrade', lastOrder: '2026-05-20', totalPurchased: 115000, status: 'ativo', avatar: 'PA', policyId: 'TAB-B' },
  { id: 'CLI-013', name: 'Estilo Kids SP', cnpj: '44.555.666/0001-55', city: 'Guarulhos', state: 'SP', region: 'Sudeste', rep: 'Marcos Andrade', lastOrder: '2026-05-18', totalPurchased: 92000, status: 'ativo', avatar: 'EK', policyId: 'TAB-A' },
  { id: 'CLI-014', name: 'Sapatinho de Ouro BH', cnpj: '55.666.777/0001-66', city: 'Contagem', state: 'MG', region: 'Sudeste', rep: 'Marcos Andrade', lastOrder: '2026-05-15', totalPurchased: 38100, status: 'inativo', avatar: 'SO', policyId: 'TAB-C' },
  { id: 'CLI-015', name: 'Mundo Infantil Vitória', cnpj: '66.777.888/0001-77', city: 'Vitória', state: 'ES', region: 'Sudeste', rep: 'Marcos Andrade', lastOrder: '2026-05-10', totalPurchased: 56400, status: 'ativo', avatar: 'MV', policyId: 'TAB-B' },
  { id: 'CLI-016', name: 'Alegria nos Pés PR', cnpj: '77.888.999/0001-88', city: 'Londrina', state: 'PR', region: 'Sul', rep: 'Marcos Andrade', lastOrder: '2026-05-08', totalPurchased: 72300, status: 'ativo', avatar: 'AP', policyId: 'TAB-A' },
];

export const selloutData: SelloutRecord[] = [
  { month: 'Jan', sellIn: 420000, sellOut: 380000, stock: 140000 },
  { month: 'Fev', sellIn: 380000, sellOut: 410000, stock: 110000 },
  { month: 'Mar', sellIn: 510000, sellOut: 480000, stock: 140000 },
  { month: 'Abr', sellIn: 620000, sellOut: 590000, stock: 170000 },
  { month: 'Mai', sellIn: 580000, sellOut: 540000, stock: 210000 },
  { month: 'Jun', sellIn: 490000, sellOut: 460000, stock: 240000 },
];

export const regionData: RegionPerformance[] = [
  { region: 'Sudeste', revenue: 1840000, target: 1600000, growth: 12.4, orders: 284 },
  { region: 'Sul', revenue: 920000, target: 850000, growth: 8.2, orders: 142 },
  { region: 'Nordeste', revenue: 680000, target: 720000, growth: -5.6, orders: 108 },
  { region: 'Centro-Oeste', revenue: 480000, target: 440000, growth: 9.1, orders: 76 },
  { region: 'Norte', revenue: 280000, target: 300000, growth: -6.7, orders: 44 },
];

export const kpiData = {
  totalSellIn: 3000000,
  totalSellOut: 2860000,
  activeClients: 247,
  pendingOrders: 18,
  avgTicket: 8800,
  collectionGiro: 78.4,
  monthlyGrowth: 9.8,
  encalheAlerts: 6,
};

export const topProducts = [
  { name: 'Flow XL Denim', units: 1400, revenue: 125860, growth: 18.2 },
  { name: 'Coil Branco', units: 1200, revenue: 113880, growth: 14.6 },
  { name: 'Flow XL Preto', units: 1100, revenue: 98890, growth: 11.3 },
  { name: 'Flow Preto', units: 1060, revenue: 84694, growth: 8.9 },
  { name: 'Hertz Marrom', units: 920, revenue: 78108, growth: 6.4 },
];

export const repTargets = [
  { name: 'Marcos Andrade', target: 480000, achieved: 524000, clients: 68, orders: 82 },
  { name: 'Fernanda Lima', target: 420000, achieved: 398000, clients: 54, orders: 71 },
  { name: 'Carlos Mendes', target: 390000, achieved: 441000, clients: 62, orders: 79 },
  { name: 'Ana Santos', target: 350000, achieved: 312000, clients: 48, orders: 58 },
];

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

export const formatDate = (dateStr: string) => {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
};

// ============================================================
// Indicadores — Meta e Venda (painel com toggle Semana/Mês/Ano)
// ============================================================
export type Granularity = 'semana' | 'mes' | 'ano';
export interface GoalBar { label: string; pct: number; current?: boolean; tag?: string; }
export interface GoalMini { title: string; target: number; achieved: number; delta?: string; counts?: { value: string; label: string }[]; }
export interface GoalPeriod { hint: string; sub: GoalMini; main: GoalMini; bars: GoalBar[]; }
export type GoalData = Record<Granularity, GoalPeriod>;

export const adminGoalData: GoalData = {
  semana: {
    hint: 'Barras por dia · % da meta diária da rede',
    sub: { title: 'Meta diária da rede (hoje)', target: 220000, achieved: 205000, counts: [{ value: '42', label: 'pedidos' }, { value: '1.250', label: 'pares' }, { value: '96', label: 'clientes' }] },
    main: { title: 'Meta semanal da rede', target: 1100000, achieved: 1060000, delta: '▲ +5% vs semana passada' },
    bars: [{ label: 'Seg', pct: 98 }, { label: 'Ter', pct: 104 }, { label: 'Qua', pct: 96 }, { label: 'Qui', pct: 101 }, { label: 'Sex', pct: 93, current: true, tag: 'Hoje' }],
  },
  mes: {
    hint: 'Barras por semana · % da meta semanal da rede',
    sub: { title: 'Meta semanal da rede (atual)', target: 1100000, achieved: 1060000, counts: [{ value: '255', label: 'pedidos' }, { value: '7.500', label: 'pares' }, { value: '480', label: 'clientes' }] },
    main: { title: 'Meta mensal da rede', target: 4500000, achieved: 4280000, delta: '▲ +7% vs mês passado' },
    bars: [{ label: 'Sem 1', pct: 106 }, { label: 'Sem 2', pct: 97 }, { label: 'Sem 3', pct: 100 }, { label: 'Sem atual', pct: 96, current: true, tag: 'Atual' }],
  },
  ano: {
    hint: 'Barras por mês · % da meta mensal da rede',
    sub: { title: 'Meta mensal da rede (jul)', target: 4500000, achieved: 4280000, counts: [{ value: '1.062', label: 'pedidos' }, { value: '31.400', label: 'pares' }, { value: '812', label: 'clientes' }] },
    main: { title: 'Meta acumulada da rede (jan–jul)', target: 31000000, achieved: 30200000, delta: '▲ +8% vs mesmo período do ano passado' },
    bars: [{ label: 'Jan', pct: 96 }, { label: 'Fev', pct: 103 }, { label: 'Mar', pct: 100 }, { label: 'Abr', pct: 94 }, { label: 'Mai', pct: 107 }, { label: 'Jun', pct: 102 }, { label: 'Jul', pct: 95, current: true, tag: 'Atual' }],
  },
};

export const repGoalData: GoalData = {
  semana: {
    hint: 'Barras por dia · % da meta diária',
    sub: { title: 'Meta diária (hoje)', target: 50000, achieved: 45000, counts: [{ value: '6', label: 'pedidos' }, { value: '350', label: 'pares' }, { value: '5', label: 'clientes' }] },
    main: { title: 'Meta semanal', target: 250000, achieved: 245000, delta: '▲ +10% vs semana passada' },
    bars: [{ label: 'Seg', pct: 95 }, { label: 'Ter', pct: 110 }, { label: 'Qua', pct: 95 }, { label: 'Qui', pct: 100 }, { label: 'Sex', pct: 90, current: true, tag: 'Hoje' }],
  },
  mes: {
    hint: 'Barras por semana · % da meta semanal',
    sub: { title: 'Meta semanal (atual)', target: 250000, achieved: 245000, counts: [{ value: '24', label: 'pedidos' }, { value: '1.400', label: 'pares' }, { value: '18', label: 'clientes' }] },
    main: { title: 'Meta mensal', target: 1000000, achieved: 985000, delta: '▲ +6% vs mês passado' },
    bars: [{ label: 'Sem 1', pct: 110 }, { label: 'Sem 2', pct: 95 }, { label: 'Sem 3', pct: 100 }, { label: 'Sem atual', pct: 98, current: true, tag: 'Atual' }],
  },
  ano: {
    hint: 'Barras por mês · % da meta mensal',
    sub: { title: 'Meta mensal (jul)', target: 1000000, achieved: 985000, counts: [{ value: '96', label: 'pedidos' }, { value: '5.600', label: 'pares' }, { value: '41', label: 'clientes' }] },
    main: { title: 'Meta acumulada (jan–jul)', target: 7000000, achieved: 6870000, delta: '▲ +8% vs mesmo período do ano passado' },
    bars: [{ label: 'Jan', pct: 95 }, { label: 'Fev', pct: 105 }, { label: 'Mar', pct: 100 }, { label: 'Abr', pct: 92 }, { label: 'Mai', pct: 110 }, { label: 'Jun', pct: 103 }, { label: 'Jul', pct: 98, current: true, tag: 'Atual' }],
  },
};

// ============================================================
// Indicadores — pedidos por status (barra 100% empilhada)
// ============================================================
export interface StatusSeg { label: string; qty: number; color: string; action?: boolean; }

export const networkOrderStatus: StatusSeg[] = [
  { label: 'Aprovado', qty: 512, color: 'oklch(0.6 0.22 262)' },
  { label: 'Faturado', qty: 388, color: 'oklch(0.72 0.12 262)' },
  { label: 'Aguardando aprovação', qty: 96, color: 'oklch(0.78 0.15 80)', action: true },
  { label: 'Rascunho', qty: 41, color: 'oklch(0.85 0.03 262)' },
  { label: 'Recusado', qty: 25, color: 'oklch(0.55 0.22 25)' },
];

export const repOrderStatus: StatusSeg[] = [
  { label: 'Aprovado', qty: 22, color: 'oklch(0.6 0.22 262)' },
  { label: 'Faturado', qty: 14, color: 'oklch(0.72 0.12 262)' },
  { label: 'Aguardando aprovação', qty: 6, color: 'oklch(0.78 0.15 80)', action: true },
  { label: 'Rascunho', qty: 3, color: 'oklch(0.85 0.03 262)' },
  { label: 'Recusado', qty: 2, color: 'oklch(0.55 0.22 25)' },
];

export const clientOrderStatus: StatusSeg[] = [
  { label: 'Aprovado', qty: 3, color: 'oklch(0.6 0.22 262)' },
  { label: 'Em trânsito', qty: 1, color: 'oklch(0.72 0.12 262)' },
  { label: 'Aguardando aprovação', qty: 1, color: 'oklch(0.78 0.15 80)', action: true },
  { label: 'Faturado', qty: 2, color: 'oklch(0.65 0.18 162)' },
];

// ============================================================
// Indústria (Admin) — indicadores de rede
// ============================================================
export const networkCoverage = { activeClients: 812, totalClients: 1290, coveragePct: 63, target: 70, frequency: '1,8 pedidos/mês', avgTerm: '42 dias' };

export const repNetworkPerformance = [
  { name: 'Marcos Andrade', clients: 68, coveragePct: 61, sales: 524000, metaPct: 109, avgTicket: 1840, deltaPct: 9 },
  { name: 'Fernanda Lima', clients: 54, coveragePct: 57, sales: 398000, metaPct: 95, avgTicket: 2310, deltaPct: 4 },
  { name: 'Carlos Mendes', clients: 62, coveragePct: 66, sales: 441000, metaPct: 113, avgTicket: 1560, deltaPct: 6 },
  { name: 'Ana Santos', clients: 48, coveragePct: 49, sales: 312000, metaPct: 89, avgTicket: 1410, deltaPct: -8 },
];

export const repSlaRanking = [
  { name: 'Marcos Andrade', days: 1.2 },
  { name: 'Fernanda Lima', days: 1.5 },
  { name: 'Ana Santos', days: 1.9 },
  { name: 'Carlos Mendes', days: 2.6 },
];

export const catalogActiveStats = { offered: 288, activeWithTurn: 214, activeNoTurn: 48, notActive: 26 };
export const stockTurnoverAdmin = { rate: '1,4×', delta: '▲ 0,2 vs trimestre anterior' };

export const campaignEffect = [
  { label: 'Sem campanha', value: 4.2 },
  { label: 'Com campanha', value: 5.1 },
];
export const campaignList = [
  { name: 'Volta às Aulas', message: '+18% de venda no período da campanha', deltaPct: 18 },
  { name: 'Dia dos Pais', message: '+9% vs média sem campanha', deltaPct: 9 },
  { name: 'Inverno 2026', message: '−2% — abaixo da média sem campanha', deltaPct: -2 },
];
export const collectionHistory = [
  { label: 'Inverno 25', value: 3.1 },
  { label: 'Verão 25', value: 3.8 },
  { label: 'Inverno 26', value: 4.3 },
];

// ============================================================
// Representante — indicadores da carteira e território
// ============================================================
export const repTicket = { current: 1840, deltaPct: 7, yearAvg: 1720 };
export const repPortfolio = { atendidos: 38, naoAtendidos: 17, aguardandoVisita: 9, total: 64, coveragePct: 59, target: 70 };

export const repFrmClients = [
  { name: 'Calçadão Paulista LTDA', score: 'A', freq: 8, recencyDays: 4, montante: 28400, ticket: 3200 },
  { name: 'Passo Certo Campinas', score: 'A', freq: 6, recencyDays: 11, montante: 21300, ticket: 2750 },
  { name: 'Estilo Kids SP', score: 'B', freq: 4, recencyDays: 23, montante: 14900, ticket: 2400 },
  { name: 'Péquenos do Sul', score: 'C', freq: 2, recencyDays: 47, montante: 6800, ticket: 1980 },
  { name: 'Sapatinho de Ouro BH', score: 'Risco', freq: 1, recencyDays: 72, montante: 3200, ticket: 1650 },
];

export const repProductsSold = [
  { label: 'Flow XL Denim', value: 320 },
  { label: 'Coil Branco', value: 280 },
  { label: 'Hertz Marrom', value: 190 },
  { label: 'Flow Preto', value: 160 },
  { label: 'Coil Navy', value: 140 },
];

export const repActiveCatalog = { active: 128, sold: 86, noSale: 42 };
export const repLineBreakdown = [
  { label: 'Casual', qty: 42, color: 'oklch(0.6 0.22 262)' },
  { label: 'Esportivo', qty: 28, color: 'oklch(0.72 0.12 262)' },
  { label: 'Social', qty: 18, color: 'oklch(0.82 0.07 262)' },
  { label: 'Infantil', qty: 12, color: 'oklch(0.9 0.02 262)' },
];

export const repTerritory = {
  states: [
    { uf: 'SP', name: 'São Paulo', value: 98000, deltaPct: 8 },
    { uf: 'RJ', name: 'Rio de Janeiro', value: 42000, deltaPct: 12 },
    { uf: 'DF', name: 'Distrito Federal', value: 31000, deltaPct: -4 },
    { uf: 'SC', name: 'Santa Catarina', value: 24000, deltaPct: 6 },
  ],
  cities: [
    { name: 'São Paulo — SP', value: 46000, deltaPct: 9 },
    { name: 'Campinas — SP', value: 28000, deltaPct: 15 },
    { name: 'Niterói — RJ', value: 21000, deltaPct: 11 },
    { name: 'Brasília — DF', value: 18000, deltaPct: -4 },
    { name: 'Florianópolis — SC', value: 14000, deltaPct: 6 },
  ],
  total: 195000,
  totalDeltaPct: 6,
};

export const repSelloutParticipation = { participating: 18, total: 64 };

export const repRupturaOpportunities = [
  { client: 'Calçadão Paulista LTDA', product: 'Flow XL Denim', coverageDays: 10, leadDays: 30 },
  { client: 'Passo Certo Campinas', product: 'Coil Branco', coverageDays: 8, leadDays: 25 },
  { client: 'Estilo Kids SP', product: 'Hertz Marrom', coverageDays: 12, leadDays: 30 },
];

export const repRecommendClients = [
  { title: 'Péquenos do Sul', message: '47 dias sem comprar · recência acima do limite', tag: 'recência' },
  { title: 'Sapatinho de Ouro BH', message: 'Score em risco/churn · resgatar', tag: 'churn', danger: true },
  { title: '+9 clientes aguardando visita', message: 'Fila de visitação dentro dos não atendidos', tag: 'visita' },
];
export const repRecommendProducts = [
  { title: 'Flow XL Denim → Calçadão Paulista LTDA', message: 'Top produto + ruptura próxima na loja' },
  { title: 'Coil Branco → Passo Certo Campinas', message: 'Recorrente na região · coleção 2026' },
  { title: 'Hertz Marrom → Estilo Kids SP', message: 'Histórico de compra + margem' },
];

// ============================================================
// Cliente (Lojista) — indicadores da loja
// ============================================================
export const clientOrderSummary = { lastOrderDays: 11, lastOrderDate: '2026-07-06', ordersCount: 7, pairs: 462, value: 19250 };

export const clientRepeatOrders = {
  count: 4,
  deltaLabel: '▲ 2 vs período anterior',
  list: [
    { orderId: 'PED-2026-0398', times: 2, product: 'Flow XL Denim · grade completa' },
    { orderId: 'PED-2026-0365', times: 2, product: 'Coil Branco · meia grade' },
  ],
};

export const clientTopProducts = [
  { label: 'Flow XL Denim', value: 120 },
  { label: 'Coil Branco', value: 96 },
  { label: 'Hertz Marrom', value: 60 },
  { label: 'Flow Preto', value: 48 },
  { label: 'Coil Navy', value: 36 },
];

export const clientRecurringPurchases = [
  { product: 'Flow XL Denim', cadenceDays: 21, purchasesInPeriod: 6, lastPurchaseDays: 12, nextExpectedDays: 9 },
  { product: 'Coil Branco', cadenceDays: 30, purchasesInPeriod: 4, lastPurchaseDays: 18, nextExpectedDays: 12 },
  { product: 'Hertz Art Vermelho', cadenceDays: 45, purchasesInPeriod: 3, lastPurchaseDays: 40, nextExpectedDays: -5 },
];

export const clientSellout = { participating: true, turnoverDays: 20, stockValue: 9435, ruptureSkus: 1 };

export const clientStockControl = [
  { product: 'Flow XL Denim', status: 'ruptura' as const, stockPairs: 0, ruptureDays: 6, turnoverDays: 12, stockValue: 0 },
  { product: 'Coil Branco', status: 'baixo' as const, stockPairs: 14, ruptureDays: null, turnoverDays: 15, stockValue: 1190 },
  { product: 'Hertz Marrom', status: 'baixo' as const, stockPairs: 9, ruptureDays: null, turnoverDays: 18, stockValue: 405 },
  { product: 'Flow Preto', status: 'ok' as const, stockPairs: 42, ruptureDays: null, turnoverDays: 22, stockValue: 3360 },
  { product: 'Coil Navy', status: 'ok' as const, stockPairs: 28, ruptureDays: null, turnoverDays: 35, stockValue: 4480 },
];

export const clientRecommendations = [
  { title: 'Flow XL Denim', message: 'Top produto da empresa · você está em ruptura deste item', tag: 'repor' },
  { title: 'Hertz Art Vermelho', message: 'Top produto da sua região (Sudeste) nesta coleção' },
];

export const clientSimilarStores = [
  { title: 'Oxford Clássico', message: '8 lojas do seu porte compraram nos últimos 30 dias' },
  { title: 'Hertz Art Azul', message: 'Recorrente em lojas da sua região' },
];
