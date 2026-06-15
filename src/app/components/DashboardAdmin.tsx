import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell,
} from "recharts";
import {
  TrendingUp, TrendingDown, Package2, ShoppingBag, Users, AlertTriangle,
  ArrowUpRight, ArrowDownRight, BarChart3, Zap, ChevronRight,
} from "lucide-react";
import { kpiData, selloutData, regionData, topProducts, repTargets, formatCurrency, orders } from "../data/mockData";

type View = 'dashboard' | 'catalog' | 'order-grade' | 'cart' | 'history' | 'marketing' | 'sellout' | 'admin' | 'clients';

interface DashboardAdminProps {
  onNavigate: (view: View) => void;
}

const CHART_COLORS = {
  primary: 'oklch(0.6 0.22 262)',
  accent: 'oklch(0.72 0.15 48)',
  success: 'oklch(0.65 0.18 162)',
  danger: 'oklch(0.55 0.22 25)',
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-xl">
      <p className="text-muted-foreground mb-1" style={{ fontSize: '0.72rem' }}>{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} style={{ color: entry.color, fontSize: '0.8rem', fontWeight: 600 }}>
          {entry.name}: {typeof entry.value === 'number' && entry.value > 1000
            ? formatCurrency(entry.value)
            : entry.value}
        </p>
      ))}
    </div>
  );
};

function KPICard({ title, value, sub, trend, trendVal, icon: Icon, iconColor }: {
  title: string; value: string; sub?: string;
  trend?: 'up' | 'down'; trendVal?: string;
  icon: React.ComponentType<{ className?: string }>; iconColor: string;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 hover:border-border/60 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <p className="text-muted-foreground" style={{ fontSize: '0.78rem', fontWeight: 500 }}>{title}</p>
        <div className={`p-1.5 rounded-lg bg-card border border-border ${iconColor}`}>
          <Icon className="w-3.5 h-3.5" />
        </div>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-foreground" style={{ fontSize: '1.6rem', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1 }}>{value}</span>
      </div>
      {(sub || trendVal) && (
        <div className="flex items-center gap-1.5 mt-2">
          {trend && (
            <span className={`flex items-center gap-0.5 ${trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`} style={{ fontSize: '0.75rem', fontWeight: 600 }}>
              {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {trendVal}
            </span>
          )}
          {sub && <span className="text-muted-foreground" style={{ fontSize: '0.73rem' }}>{sub}</span>}
        </div>
      )}
    </div>
  );
}

export function DashboardAdmin({ onNavigate }: DashboardAdminProps) {
  const recentOrders = orders.slice(0, 5);

  const statusColors: Record<string, string> = {
    'aprovado': 'bg-blue-400/20 text-blue-400',
    'em análise': 'bg-amber-400/20 text-amber-400',
    'faturado': 'bg-emerald-400/20 text-emerald-400',
    'cancelado': 'bg-red-400/20 text-red-400',
    'entregue': 'bg-purple-400/20 text-purple-400',
  };

  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Sell-in Total"
          value="R$ 3,0M"
          sub="Inverno 2026"
          trend="up"
          trendVal="+9,8%"
          icon={TrendingUp}
          iconColor="text-blue-400"
        />
        <KPICard
          title="Clientes Ativos"
          value="247"
          sub="vs 228 coleção anterior"
          trend="up"
          trendVal="+8,3%"
          icon={Users}
          iconColor="text-emerald-400"
        />
        <KPICard
          title="Pedidos Pendentes"
          value="18"
          sub="aguardando aprovação"
          icon={ShoppingBag}
          iconColor="text-amber-400"
        />
        <KPICard
          title="Alertas Encalhe"
          value="6"
          sub="produtos com baixo giro"
          trend="down"
          trendVal="-2 vs semana"
          icon={AlertTriangle}
          iconColor="text-red-400"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Sell-in vs Sell-out */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-foreground" style={{ fontWeight: 600, fontSize: '0.9rem' }}>Sell-in × Sell-out</h3>
              <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>Comparativo mensal — 2026</p>
            </div>
            <button
              onClick={() => onNavigate('sellout')}
              className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
              style={{ fontSize: '0.78rem', fontWeight: 500 }}
            >
              Ver detalhes <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={selloutData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="sellInGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.6 0.22 262)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(0.6 0.22 262)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="sellOutGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.72 0.15 48)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(0.72 0.15 48)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={v => `${(v / 1000).toFixed(0)}k`} tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="sellIn" name="Sell-in" stroke="oklch(0.6 0.22 262)" strokeWidth={2} fill="url(#sellInGrad)" dot={false} />
              <Area type="monotone" dataKey="sellOut" name="Sell-out" stroke="oklch(0.72 0.15 48)" strokeWidth={2} fill="url(#sellOutGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 bg-blue-500 rounded" />
              <span className="text-muted-foreground" style={{ fontSize: '0.72rem' }}>Sell-in</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 rounded" style={{ background: 'oklch(0.72 0.15 48)' }} />
              <span className="text-muted-foreground" style={{ fontSize: '0.72rem' }}>Sell-out</span>
            </div>
          </div>
        </div>

        {/* Regional */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-foreground" style={{ fontWeight: 600, fontSize: '0.9rem' }}>Por Região</h3>
            <BarChart3 className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="space-y-3">
            {regionData.map(region => {
              const pct = Math.round((region.revenue / region.target) * 100);
              const overTarget = pct >= 100;
              return (
                <div key={region.region}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-foreground" style={{ fontSize: '0.8rem', fontWeight: 500 }}>{region.region}</span>
                    <span className={`${overTarget ? 'text-emerald-400' : 'text-red-400'} flex items-center gap-0.5`} style={{ fontSize: '0.72rem', fontWeight: 600 }}>
                      {overTarget ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {region.growth > 0 ? '+' : ''}{region.growth}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-secondary">
                    <div
                      className={`h-full rounded-full transition-all ${overTarget ? 'bg-primary' : 'bg-amber-500'}`}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-muted-foreground mono" style={{ fontSize: '0.68rem' }}>{formatCurrency(region.revenue)}</span>
                    <span className="text-muted-foreground" style={{ fontSize: '0.68rem' }}>{pct}% meta</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-foreground" style={{ fontWeight: 600, fontSize: '0.9rem' }}>Pedidos Recentes</h3>
            <button
              onClick={() => onNavigate('history')}
              className="text-primary hover:text-primary/80 transition-colors"
              style={{ fontSize: '0.78rem', fontWeight: 500 }}
            >
              Ver todos
            </button>
          </div>
          <div className="space-y-2">
            {recentOrders.map(order => (
              <div key={order.id} className="flex items-center gap-3 rounded-lg hover:bg-secondary/40 transition-colors p-2 -mx-2 cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                  <Package2 className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-foreground truncate" style={{ fontSize: '0.82rem', fontWeight: 500 }}>{order.client}</p>
                  <p className="text-muted-foreground truncate" style={{ fontSize: '0.72rem' }}>{order.id} · {order.rep}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-foreground mono" style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                    {formatCurrency(order.total)}
                  </p>
                  <span className={`inline-block px-2 py-0.5 rounded-full ${statusColors[order.status]}`} style={{ fontSize: '0.65rem', fontWeight: 600 }}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Reps */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-foreground" style={{ fontWeight: 600, fontSize: '0.9rem' }}>Ranking Reps</h3>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="space-y-3">
            {repTargets.map((rep, i) => {
              const pct = Math.round((rep.achieved / rep.target) * 100);
              const over = pct >= 100;
              return (
                <div key={rep.name} className="flex items-center gap-3">
                  <span
                    className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
                    style={{
                      fontSize: '0.68rem', fontWeight: 700,
                      background: i === 0 ? 'oklch(0.78 0.16 80 / 0.2)' : '#f3f4f6',
                      color: i === 0 ? 'oklch(0.78 0.16 80)' : '#6b7280',
                    }}
                  >
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground truncate" style={{ fontSize: '0.8rem', fontWeight: 500 }}>{rep.name.split(' ')[0]}</p>
                    <div className="w-full h-1 rounded-full bg-secondary mt-1">
                      <div
                        className={`h-full rounded-full ${over ? 'bg-emerald-400' : 'bg-primary'}`}
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className={`${over ? 'text-emerald-400' : 'text-muted-foreground'}`} style={{ fontSize: '0.72rem', fontWeight: 600 }}>
                      {pct}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <p className="text-foreground" style={{ fontWeight: 700, fontSize: '1.1rem' }}>R$ 1,67M</p>
                <p className="text-muted-foreground" style={{ fontSize: '0.7rem' }}>Realizado</p>
              </div>
              <div className="text-center">
                <p className="text-foreground" style={{ fontWeight: 700, fontSize: '1.1rem' }}>R$ 1,64M</p>
                <p className="text-muted-foreground" style={{ fontSize: '0.7rem' }}>Meta</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-foreground" style={{ fontWeight: 600, fontSize: '0.9rem' }}>Top Produtos — Coleção Inverno 2026</h3>
            <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>Por unidades vendidas e receita</p>
          </div>
          <button
            onClick={() => onNavigate('catalog')}
            className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
            style={{ fontSize: '0.78rem', fontWeight: 500 }}
          >
            Catálogo <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="space-y-3">
          {topProducts.map((product, i) => (
            <div key={product.name} className="flex items-center gap-4">
              <span className="text-muted-foreground w-4 text-right" style={{ fontSize: '0.75rem', fontWeight: 600 }}>{i + 1}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-foreground" style={{ fontSize: '0.82rem', fontWeight: 500 }}>{product.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground mono" style={{ fontSize: '0.75rem' }}>{product.units.toLocaleString('pt-BR')} un.</span>
                    <span className="text-foreground mono" style={{ fontSize: '0.78rem', fontWeight: 600 }}>{formatCurrency(product.revenue)}</span>
                    <span
                      className={`flex items-center gap-0.5 ${product.growth >= 0 ? 'text-emerald-400' : 'text-red-400'}`}
                      style={{ fontSize: '0.72rem', fontWeight: 600, minWidth: 48, textAlign: 'right' }}
                    >
                      {product.growth >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {product.growth > 0 ? '+' : ''}{product.growth}%
                    </span>
                  </div>
                </div>
                <div className="w-full h-1.5 rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${(product.units / topProducts[0].units) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
