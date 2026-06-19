import { ShoppingBag, Star, RotateCcw, Tag, TrendingUp, ChevronRight, Package, Sparkles } from "lucide-react";
import { products, orders, formatCurrency, formatDate } from "../data/mockData";

type View = 'dashboard' | 'catalog' | 'order-grade' | 'cart' | 'history' | 'marketing' | 'sellout' | 'admin' | 'clients';

interface DashboardLojistaProps {
  onNavigate: (view: View) => void;
}

export function DashboardLojista({ onNavigate }: DashboardLojistaProps) {
  const myOrders = orders.slice(0, 4);
  const featuredProducts = products.slice(0, 4);
  const favProducts = products.filter(p => p.isFavorite);

  const statusColors: Record<string, string> = {
    'aprovado': 'bg-blue-400/20 text-blue-400',
    'em análise': 'bg-amber-400/20 text-amber-400',
    'faturado': 'bg-emerald-400/20 text-emerald-400',
    'cancelado': 'bg-red-400/20 text-red-400',
    'entregue': 'bg-purple-400/20 text-purple-400',
  };

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto w-full">
      {/* Header banner */}
      <div className="rounded-xl border border-primary/20 bg-gradient-to-r from-primary/10 to-transparent p-5">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-muted-foreground" style={{ fontSize: '0.78rem', fontWeight: 500 }}>Olá, Calçadão Paulista!</p>
            <h2 className="text-foreground" style={{ fontSize: '1.4rem', fontWeight: 700, letterSpacing: '-0.02em' }}>Novidades da Coleção Inverno 2026</h2>
            <p className="text-muted-foreground mt-1" style={{ fontSize: '0.85rem' }}>
              <span className="text-primary font-semibold">47 novos produtos</span> disponíveis. Condição especial até 30/06.
            </p>
          </div>
          <button
            onClick={() => onNavigate('catalog')}
            className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-2 flex-shrink-0"
            style={{ fontWeight: 600, fontSize: '0.85rem' }}
          >
            Ver catálogo <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Pedidos este mês', value: '3', sub: 'R$ 42.500,00 total', icon: ShoppingBag, color: 'text-blue-400' },
          { label: 'Produtos favoritos', value: String(favProducts.length), sub: 'salvo para compra', icon: Star, color: 'text-amber-400' },
          { label: 'Última compra', value: '9 Jun', sub: 'PED-2026-0412', icon: Package, color: 'text-emerald-400' },
          { label: 'Desconto negociado', value: '12%', sub: 'na coleção atual', icon: Tag, color: 'text-purple-400' },
        ].map(kpi => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-muted-foreground" style={{ fontSize: '0.75rem', fontWeight: 500 }}>{kpi.label}</p>
                <Icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
              <p className="text-foreground" style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1 }}>{kpi.value}</p>
              <p className="text-muted-foreground mt-1" style={{ fontSize: '0.72rem' }}>{kpi.sub}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recompra rápida */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-foreground" style={{ fontWeight: 600, fontSize: '0.9rem' }}>Recompra Rápida</h3>
            <RotateCcw className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="space-y-3">
            {myOrders.slice(0, 3).map(order => (
              <div key={order.id} className="rounded-lg border border-border/60 p-3">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-foreground" style={{ fontSize: '0.8rem', fontWeight: 500 }}>{order.id}</p>
                    <p className="text-muted-foreground" style={{ fontSize: '0.7rem' }}>{formatDate(order.date)} · {order.items} pares</p>
                  </div>
                  <span className="text-foreground mono" style={{ fontSize: '0.82rem', fontWeight: 600 }}>{formatCurrency(order.total)}</span>
                </div>
                <button
                  onClick={() => onNavigate('cart')}
                  className="w-full py-1.5 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                  style={{ fontSize: '0.75rem', fontWeight: 600 }}
                >
                  Repetir pedido →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Produtos em destaque */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-foreground" style={{ fontWeight: 600, fontSize: '0.9rem' }}>Destaques da Coleção</h3>
            <button onClick={() => onNavigate('catalog')} className="text-primary" style={{ fontSize: '0.78rem' }}>
              Ver todos
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {featuredProducts.map(product => (
              <div
                key={product.id}
                className="rounded-lg border border-border/60 overflow-hidden hover:border-primary/30 transition-colors cursor-pointer group"
                onClick={() => onNavigate('catalog')}
              >
                <div className="h-32 bg-secondary overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
                <div className="p-3">
                  <p className="text-foreground truncate" style={{ fontSize: '0.8rem', fontWeight: 500 }}>{product.name}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-foreground mono" style={{ fontSize: '0.82rem', fontWeight: 700 }}>{formatCurrency(product.price)}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded-full ${product.availability === 'disponível' ? 'bg-emerald-400/10 text-emerald-400' : 'bg-amber-400/10 text-amber-400'}`}
                      style={{ fontSize: '0.62rem', fontWeight: 600 }}
                    >
                      {product.availability}
                    </span>
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); onNavigate('order-grade'); }}
                    className="w-full mt-2 py-1.5 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                    style={{ fontSize: '0.72rem', fontWeight: 600 }}
                  >
                    Pedir agora
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Histórico + Recomendação */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-foreground" style={{ fontWeight: 600, fontSize: '0.9rem' }}>Histórico de Pedidos</h3>
            <button onClick={() => onNavigate('history')} className="text-primary" style={{ fontSize: '0.78rem' }}>Ver completo</button>
          </div>
          <div className="space-y-3">
            {myOrders.map(order => (
              <div key={order.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/40 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                  <ShoppingBag className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-foreground" style={{ fontSize: '0.8rem', fontWeight: 500 }}>{order.id}</p>
                  <p className="text-muted-foreground" style={{ fontSize: '0.7rem' }}>{formatDate(order.date)} · {order.items} pares</p>
                </div>
                <div className="text-right">
                  <p className="text-foreground mono" style={{ fontSize: '0.8rem', fontWeight: 600 }}>{formatCurrency(order.total)}</p>
                  <span className={`px-1.5 py-0.5 rounded-full ${statusColors[order.status]}`} style={{ fontSize: '0.62rem', fontWeight: 600 }}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <h3 className="text-foreground" style={{ fontWeight: 600, fontSize: '0.9rem' }}>Recomendado para você</h3>
          </div>
          <div className="rounded-lg bg-purple-400/5 border border-purple-400/20 p-4 mb-4">
            <p className="text-muted-foreground mb-2" style={{ fontSize: '0.78rem' }}>Baseado no seu histórico de compras e tendências da sua região:</p>
            <p className="text-foreground" style={{ fontSize: '0.85rem', fontWeight: 500 }}>
              Tênis Runner Foam e Oxford Clássico Premium têm <span className="text-purple-400">alta saída</span> em São Paulo nesta temporada.
            </p>
          </div>
          <div className="space-y-2">
            {products.slice(0, 3).map(p => (
              <div key={p.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/40 transition-colors cursor-pointer" onClick={() => onNavigate('catalog')}>
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-foreground truncate" style={{ fontSize: '0.8rem', fontWeight: 500 }}>{p.name}</p>
                  <p className="text-muted-foreground" style={{ fontSize: '0.7rem' }}>{p.line} · {p.category}</p>
                </div>
                <p className="text-foreground mono flex-shrink-0" style={{ fontSize: '0.82rem', fontWeight: 600 }}>{formatCurrency(p.price)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
