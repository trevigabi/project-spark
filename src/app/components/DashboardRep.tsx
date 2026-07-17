import { useState } from "react";
import { Users, ShoppingBag, Target, Star, ChevronRight, MapPin, Boxes, Map } from "lucide-react";
import {
  clients, orders, formatCurrency, formatDate, products, Client,
  repGoalData, repOrderStatus, repTicket, repPortfolio, repFrmClients, repProductsSold,
  repActiveCatalog, repLineBreakdown, repTerritory, repSelloutParticipation,
  repRupturaOpportunities, repRecommendClients, repRecommendProducts,
  type Granularity,
} from "../data/mockData";
import { RadialBarChart, RadialBar, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { SelloutDashboard } from "./SelloutDashboard";
import { RuptureAlerts } from "./RuptureAlerts";
import { SectionTitle, GoalPanel, StatusStack, RankBars, RecommendationList } from "./DashboardWidgets";

type View = 'dashboard' | 'catalog' | 'order-grade' | 'cart' | 'history' | 'marketing' | 'sellout' | 'admin' | 'clients';

interface DashboardRepProps {
  onNavigate: (view: View) => void;
  selectedClient: Client | null;
  embedded?: boolean;
}

const monthlyData = [
  { month: 'Jan', valor: 180000 },
  { month: 'Fev', valor: 210000 },
  { month: 'Mar', valor: 195000 },
  { month: 'Abr', valor: 240000 },
  { month: 'Mai', valor: 228000 },
  { month: 'Jun', valor: 524000 },
];

export function DashboardRep({ onNavigate, selectedClient, embedded = false }: DashboardRepProps) {
  const [activeTab, setActiveTab] = useState<'indicadores' | 'sellout'>('indicadores');
  const [granularity, setGranularity] = useState<Granularity>('semana');

  const myClients = clients.filter(c => c.rep === 'Marcos Andrade');
  const myOrders = orders.filter(o => o.rep === 'Marcos Andrade');
  const metaPercent = Math.round((524000 / 480000) * 100);

  const opportunities = [
    { client: 'Calçadão Paulista', product: 'Bota Chelsea Couro', reason: 'Reposição sugerida', value: 4800 },
    { client: 'Shoestore Norte', product: 'Derby Casual Urban', reason: 'Último pedido há 35 dias', value: 2400 },
    { client: 'Fashion Feet SP', product: 'Oxford Clássico', reason: 'Alta demanda na região', value: 7200 },
  ];

  const statusColors: Record<string, string> = {
    'aprovado': 'bg-black/20 text-black',
    'em análise': 'bg-amber-400/20 text-amber-400',
    'faturado': 'bg-emerald-400/20 text-emerald-400',
    'cancelado': 'bg-red-400/20 text-red-400',
    'entregue': 'bg-purple-400/20 text-purple-400',
  };

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto w-full">
      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border">
        <button
          onClick={() => setActiveTab('indicadores')}
          className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
            activeTab === 'indicadores'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
          style={{ fontSize: '0.85rem' }}
        >
          Meus Indicadores
        </button>
        <button
          onClick={() => setActiveTab('sellout')}
          className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
            activeTab === 'sellout'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
          style={{ fontSize: '0.85rem' }}
        >
          Sell-out
        </button>
      </div>

      {activeTab === 'sellout' ? (
        <div className="-mx-6 -mb-6">
          <SelloutDashboard />
        </div>
      ) : (
      <>
      {/* Welcome + Meta */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-muted-foreground mb-1" style={{ fontSize: '0.78rem' }}>Bom dia,</p>
              <h2 className="text-foreground" style={{ fontSize: '1.3rem', fontWeight: 700, letterSpacing: '-0.02em' }}>Marcos Andrade</h2>
              <p className="text-muted-foreground mt-1" style={{ fontSize: '0.82rem' }}>
                Você tem <span className="text-primary font-semibold">3 visitas</span> agendadas e <span className="text-amber-400 font-semibold">2 pedidos</span> pendentes hoje.
              </p>
            </div>
            <div className="text-right">
              <p className="text-muted-foreground" style={{ fontSize: '0.72rem' }}>Junho 2026</p>
              <p className="text-foreground mono" style={{ fontSize: '1.4rem', fontWeight: 700, letterSpacing: '-0.02em' }}>{formatCurrency(524000)}</p>
              <p className="text-emerald-400" style={{ fontSize: '0.78rem', fontWeight: 600 }}>+9,2% vs meta</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={100}>
            <AreaChart data={monthlyData} margin={{ top: 2, right: 2, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="repGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.6 0.22 262)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(0.6 0.22 262)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="valor" stroke="oklch(0.6 0.22 262)" strokeWidth={2} fill="url(#repGrad)" dot={false} />
              <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 11 }}
                formatter={(v: any) => [formatCurrency(v), 'Vendido']}
                labelStyle={{ color: '#6b7280' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Meta Donut */}
        <div className="bg-card border border-border rounded-xl p-5 flex flex-col items-center justify-center">
          <p className="text-muted-foreground mb-3" style={{ fontSize: '0.78rem', fontWeight: 500 }}>Meta Mensal</p>
          <div className="relative w-28 h-28">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart innerRadius="70%" outerRadius="100%" data={[{ value: metaPercent }]} startAngle={90} endAngle={90 - (metaPercent / 100) * 360}>
                <RadialBar dataKey="value" fill="oklch(0.5 0.22 262)" background={{ fill: '#f3f4f6' }} cornerRadius={4} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-foreground" style={{ fontSize: '1.4rem', fontWeight: 700, lineHeight: 1 }}>{metaPercent}%</span>
              <span className="text-muted-foreground" style={{ fontSize: '0.65rem' }}>atingido</span>
            </div>
          </div>
          <div className="text-center mt-3">
            <p className="text-foreground mono" style={{ fontSize: '0.85rem', fontWeight: 600 }}>{formatCurrency(524000)}</p>
            <p className="text-muted-foreground" style={{ fontSize: '0.72rem' }}>de {formatCurrency(480000)}</p>
          </div>
        </div>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Clientes da carteira */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-foreground" style={{ fontWeight: 600, fontSize: '0.9rem' }}>Carteira de Clientes</h3>
            <button onClick={() => onNavigate('clients')} className="text-primary" style={{ fontSize: '0.78rem' }}>
              Ver todos <ChevronRight className="inline w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-3">
            {myClients.slice(0, 4).map(client => (
              <div key={client.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/40 cursor-pointer transition-colors -mx-2">
                <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary" style={{ fontSize: '0.7rem', fontWeight: 700 }}>{client.avatar}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-foreground truncate" style={{ fontSize: '0.82rem', fontWeight: 500 }}>{client.name}</p>
                  <p className="text-muted-foreground" style={{ fontSize: '0.72rem' }}>
                    <MapPin className="inline w-3 h-3 mr-0.5" />{client.city} · Último: {formatDate(client.lastOrder)}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-foreground mono" style={{ fontSize: '0.78rem', fontWeight: 600 }}>{formatCurrency(client.totalPurchased)}</p>
                  <span className={`px-1.5 py-0.5 rounded-full text-emerald-400 bg-emerald-400/10`} style={{ fontSize: '0.65rem', fontWeight: 600 }}>ativo</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Oportunidades */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-foreground" style={{ fontWeight: 600, fontSize: '0.9rem' }}>Oportunidades</h3>
            <span className="px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-400" style={{ fontSize: '0.65rem', fontWeight: 600 }}>
              {opportunities.length} sugestões
            </span>
          </div>
          <div className="space-y-3">
            {opportunities.map((opp, i) => (
              <div key={i} className="rounded-lg border border-border/60 p-3 hover:border-primary/30 hover:bg-primary/5 transition-colors cursor-pointer">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-foreground" style={{ fontSize: '0.82rem', fontWeight: 500 }}>{opp.client}</p>
                    <p className="text-muted-foreground mt-0.5" style={{ fontSize: '0.75rem' }}>{opp.product}</p>
                    <p className="text-amber-400 mt-1" style={{ fontSize: '0.72rem' }}>{opp.reason}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-foreground mono" style={{ fontSize: '0.85rem', fontWeight: 700 }}>{formatCurrency(opp.value)}</p>
                    <button
                      onClick={() => onNavigate('order-grade')}
                      className="mt-1 px-2 py-1 rounded-md bg-primary/15 text-primary text-right hover:bg-primary/25 transition-colors"
                      style={{ fontSize: '0.68rem', fontWeight: 600 }}
                    >
                      Pedir →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <RuptureAlerts profile="rep" />

      {/* Recent Orders */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-foreground" style={{ fontWeight: 600, fontSize: '0.9rem' }}>Pedidos Recentes</h3>
          <button onClick={() => onNavigate('history')} className="text-primary" style={{ fontSize: '0.78rem' }}>
            Histórico completo
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {myOrders.map(order => (
            <div key={order.id} className="flex items-center gap-3 p-3 rounded-lg border border-border/60 hover:border-border transition-colors">
              <div>
                <p className="text-foreground" style={{ fontSize: '0.82rem', fontWeight: 500 }}>{order.client}</p>
                <p className="text-muted-foreground" style={{ fontSize: '0.7rem' }}>{order.id} · {formatDate(order.date)}</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-foreground mono" style={{ fontSize: '0.82rem', fontWeight: 600 }}>{formatCurrency(order.total)}</p>
                <span className={`px-1.5 py-0.5 rounded-full ${statusColors[order.status]}`} style={{ fontSize: '0.65rem', fontWeight: 600 }}>
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ============ META E VENDA ============ */}
      <SectionTitle>Meta e venda</SectionTitle>
      <GoalPanel title="Meta e venda" data={repGoalData} granularity={granularity} onGranularityChange={setGranularity} />

      {/* ============ PEDIDOS E TICKET ============ */}
      <SectionTitle>Pedidos e ticket</SectionTitle>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
          <h3 className="text-foreground" style={{ fontWeight: 600, fontSize: '0.9rem' }}>Pedidos por status</h3>
          <p className="text-muted-foreground mb-4" style={{ fontSize: '0.75rem' }}>
            {repOrderStatus.reduce((a, s) => a + s.qty, 0)} pedidos no período
          </p>
          <StatusStack segments={repOrderStatus} />
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-foreground mb-4" style={{ fontWeight: 600, fontSize: '0.9rem' }}>Ticket médio</h3>
          <div>
            <p className="text-muted-foreground" style={{ fontSize: '0.72rem' }}>Atual (semana)</p>
            <p className="text-foreground mono" style={{ fontSize: '1.4rem', fontWeight: 700 }}>{formatCurrency(repTicket.current)}</p>
            <p className="text-emerald-400" style={{ fontSize: '0.75rem', fontWeight: 600 }}>▲ {repTicket.deltaPct}% vs semana anterior</p>
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-muted-foreground" style={{ fontSize: '0.72rem' }}>Acumulado (ano)</p>
            <p className="text-foreground mono" style={{ fontSize: '1.1rem', fontWeight: 700 }}>{formatCurrency(repTicket.yearAvg)}</p>
          </div>
        </div>
      </div>

      {/* ============ CARTEIRA DE CLIENTES ============ */}
      <SectionTitle>Carteira de clientes — composição e valor</SectionTitle>
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-foreground" style={{ fontWeight: 600, fontSize: '0.9rem' }}>Composição da carteira + cobertura</h3>
        <p className="text-muted-foreground mb-4" style={{ fontSize: '0.75rem' }}>{repPortfolio.total} clientes na carteira</p>
        <StatusStack segments={[
          { label: 'Atendidos', qty: repPortfolio.atendidos, color: 'oklch(0.6 0.22 262)' },
          { label: 'Não atendidos', qty: repPortfolio.naoAtendidos, color: 'oklch(0.55 0.22 25)' },
          { label: 'Aguardando visita', qty: repPortfolio.aguardandoVisita, color: 'oklch(0.78 0.15 80)', action: true },
        ]} />
        <div className="mt-4">
          <div className="flex justify-between items-baseline mb-1">
            <span className="text-muted-foreground" style={{ fontSize: '0.78rem' }}>Cobertura (comprou no período)</span>
            <span className="text-foreground" style={{ fontSize: '0.9rem', fontWeight: 700 }}>{repPortfolio.coveragePct}%</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-secondary">
            <div className="h-full rounded-full bg-primary" style={{ width: `${repPortfolio.coveragePct}%` }} />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-muted-foreground" style={{ fontSize: '0.7rem' }}>{repPortfolio.atendidos} atendidos</span>
            <span className="text-muted-foreground" style={{ fontSize: '0.7rem' }}>alvo {repPortfolio.target}%</span>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-5 overflow-x-auto">
        <h3 className="text-foreground mb-1" style={{ fontWeight: 600, fontSize: '0.9rem' }}>FRM + Ticket médio por cliente</h3>
        <p className="text-muted-foreground mb-4" style={{ fontSize: '0.75rem' }}>Frequência, Recência e Montante · vermelho para risco/churn e recência acima do limite (40 dias)</p>
        <table className="w-full" style={{ fontSize: '0.8rem' }}>
          <thead>
            <tr className="border-b border-border">
              {['Cliente', 'Score', 'Frequência', 'Recência (dias)', 'Montante', 'Ticket médio'].map((c, i) => (
                <th key={c} className={`pb-2.5 text-muted-foreground font-medium ${i === 0 ? 'text-left' : 'text-right'}`} style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.03em' }}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {repFrmClients.map(c => {
              const badgeClass = c.score === 'A' ? 'bg-emerald-400/10 text-emerald-400' : c.score === 'B' ? 'bg-primary/10 text-primary' : c.score === 'C' ? 'bg-amber-400/10 text-amber-500' : 'bg-red-400/10 text-red-400';
              const risky = c.score === 'Risco' || c.recencyDays > 40;
              return (
                <tr key={c.name} className="border-b border-border/40">
                  <td className="py-2.5 text-foreground" style={{ fontWeight: 500 }}>{c.name}</td>
                  <td className="py-2.5 text-right"><span className={`px-2 py-0.5 rounded-full ${badgeClass}`} style={{ fontSize: '0.68rem', fontWeight: 700 }}>{c.score}</span></td>
                  <td className="py-2.5 text-right text-muted-foreground">{c.freq}</td>
                  <td className={`py-2.5 text-right ${risky ? 'text-red-400' : 'text-muted-foreground'}`} style={{ fontWeight: risky ? 600 : 400 }}>{c.recencyDays}</td>
                  <td className="py-2.5 text-right text-foreground mono">{formatCurrency(c.montante)}</td>
                  <td className="py-2.5 text-right text-foreground mono">{formatCurrency(c.ticket)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ============ PRODUTOS ============ */}
      <SectionTitle>Produtos</SectionTitle>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-foreground mb-4" style={{ fontWeight: 600, fontSize: '0.9rem' }}>Produtos mais vendidos</h3>
          <RankBars rows={repProductsSold} />
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-foreground mb-1" style={{ fontWeight: 600, fontSize: '0.9rem' }}>Produtos ativos × vendidos</h3>
          <p className="text-muted-foreground mb-3" style={{ fontSize: '0.75rem' }}>Catálogo do rep · período</p>
          <div className="flex gap-4 mb-3">
            <div><p className="text-muted-foreground" style={{ fontSize: '0.7rem' }}>Ativos</p><p className="text-foreground" style={{ fontSize: '1.1rem', fontWeight: 700 }}>{repActiveCatalog.active}</p></div>
            <div><p className="text-muted-foreground" style={{ fontSize: '0.7rem' }}>Vendidos</p><p className="text-foreground" style={{ fontSize: '1.1rem', fontWeight: 700 }}>{repActiveCatalog.sold}</p></div>
            <div><p className="text-amber-500" style={{ fontSize: '0.7rem' }}>Sem venda</p><p className="text-amber-500" style={{ fontSize: '1.1rem', fontWeight: 700 }}>{repActiveCatalog.noSale}</p></div>
          </div>
          <div className="flex h-5 rounded-md overflow-hidden gap-0.5">
            <div className="bg-primary flex items-center justify-center text-white" style={{ flex: repActiveCatalog.sold, fontSize: '0.65rem', fontWeight: 600 }}>{repActiveCatalog.sold}</div>
            <div className="bg-amber-400 flex items-center justify-center text-white" style={{ flex: repActiveCatalog.noSale, fontSize: '0.65rem', fontWeight: 600 }}>{repActiveCatalog.noSale}</div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-foreground mb-1" style={{ fontWeight: 600, fontSize: '0.9rem' }}>Tipo de linha ativa</h3>
          <p className="text-muted-foreground mb-3" style={{ fontSize: '0.75rem' }}>Participação da oferta</p>
          <div className="flex h-6 rounded-md overflow-hidden gap-0.5">
            {repLineBreakdown.map(l => (
              <div key={l.label} className="flex items-center justify-center text-white" style={{ flex: l.qty, background: l.color, fontSize: '0.62rem', fontWeight: 600 }}>{l.qty}</div>
            ))}
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1.5 mt-3">
            {repLineBreakdown.map(l => (
              <span key={l.label} className="flex items-center gap-1.5 text-muted-foreground" style={{ fontSize: '0.72rem' }}>
                <span className="w-2.5 h-2.5 rounded-sm" style={{ background: l.color }} /> {l.label} · {l.qty}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ============ VENDA POR REGIÃO ============ */}
      <SectionTitle>Venda por região — território do representante</SectionTitle>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-1">
            <Map className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-foreground" style={{ fontWeight: 600, fontSize: '0.9rem' }}>Por estado</h3>
          </div>
          <div className="space-y-2 mt-3">
            {repTerritory.states.map(s => (
              <div key={s.uf} className="flex items-center justify-between p-2.5 rounded-lg border border-border/60">
                <span className="text-foreground" style={{ fontSize: '0.82rem', fontWeight: 600 }}>{s.name}</span>
                <div className="flex items-center gap-2.5">
                  <span className="text-foreground mono" style={{ fontSize: '0.8rem', fontWeight: 600 }}>{formatCurrency(s.value)}</span>
                  <span className={`${s.deltaPct >= 0 ? 'text-emerald-400' : 'text-red-400'}`} style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                    {s.deltaPct >= 0 ? '▲' : '▼'} {Math.abs(s.deltaPct)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-muted-foreground" style={{ fontSize: '0.72rem' }}>Total do território</p>
            <p className="text-foreground mono" style={{ fontSize: '1.1rem', fontWeight: 700 }}>{formatCurrency(repTerritory.total)}</p>
            <p className="text-emerald-400" style={{ fontSize: '0.75rem', fontWeight: 600 }}>▲ {repTerritory.totalDeltaPct}% vs período anterior</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-foreground mb-4" style={{ fontWeight: 600, fontSize: '0.9rem' }}>Por cidade</h3>
          <RankBars rows={repTerritory.cities.map(c => ({ label: c.name, value: c.value }))} formatValue={formatCurrency} />
        </div>
      </div>

      {/* ============ SELL-OUT E INTELIGÊNCIA ============ */}
      <SectionTitle>Sell-out e inteligência</SectionTitle>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-foreground mb-1" style={{ fontWeight: 600, fontSize: '0.9rem' }}>Clientes com sell-out</h3>
          <p className="text-muted-foreground mb-3" style={{ fontSize: '0.75rem' }}>Enviam o dado</p>
          <p className="text-foreground" style={{ fontSize: '1.8rem', fontWeight: 700 }}>
            {repSelloutParticipation.participating} <span className="text-muted-foreground" style={{ fontSize: '0.9rem', fontWeight: 500 }}>/ {repSelloutParticipation.total}</span>
          </p>
          <p className="text-amber-500 mt-1" style={{ fontSize: '0.75rem', fontWeight: 600 }}>
            {repSelloutParticipation.total - repSelloutParticipation.participating} não participam
          </p>
          <div className="w-full h-2 rounded-full bg-secondary mt-2">
            <div className="h-full rounded-full bg-primary" style={{ width: `${(repSelloutParticipation.participating / repSelloutParticipation.total) * 100}%` }} />
          </div>
        </div>
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-1">
            <Boxes className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-foreground" style={{ fontWeight: 600, fontSize: '0.9rem' }}>Alerta de ruptura como oportunidade</h3>
          </div>
          <p className="text-muted-foreground mb-4" style={{ fontSize: '0.75rem' }}>Cobertura em dias abaixo do lead time de entrega</p>
          <div className="space-y-2">
            {repRupturaOpportunities.map((r, i) => (
              <div key={i} className="flex items-start gap-2.5 p-3 rounded-lg border border-amber-400/30 bg-amber-400/5">
                <span className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'oklch(0.78 0.15 80)' }} />
                <div className="flex-1 min-w-0">
                  <p className="text-foreground" style={{ fontSize: '0.82rem', fontWeight: 600 }}>{r.client} — {r.product}</p>
                  <p className="text-muted-foreground mt-0.5" style={{ fontSize: '0.75rem' }}>Cobertura {r.coverageDays} dias · entrega {r.leadDays} dias → repor antes de zerar</p>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-500 flex-shrink-0" style={{ fontSize: '0.65rem', fontWeight: 700 }}>oportunidade</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============ RECOMENDAÇÕES ============ */}
      <SectionTitle>Recomendações</SectionTitle>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-foreground mb-4" style={{ fontWeight: 600, fontSize: '0.9rem' }}>Clientes para atender</h3>
          <RecommendationList items={repRecommendClients} />
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-foreground mb-4" style={{ fontWeight: 600, fontSize: '0.9rem' }}>Produtos a oferecer</h3>
          <RecommendationList items={repRecommendProducts} />
        </div>
      </div>
      </>
      )}
    </div>
  );
}
