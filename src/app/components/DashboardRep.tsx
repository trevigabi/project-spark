import { useState } from "react";
import { Users, ShoppingBag, Target, Star, ChevronRight, MapPin } from "lucide-react";
import { clients, orders, formatCurrency, formatDate, products, Client } from "../data/mockData";
import { RadialBarChart, RadialBar, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { SelloutDashboard } from "./SelloutDashboard";
import { RuptureAlerts } from "./RuptureAlerts";

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
      </>
      )}
    </div>
  );
}
