import { useState } from "react";
import { ShoppingBag, Star, RotateCcw, Tag, TrendingUp, ChevronRight, Package, Sparkles, RefreshCw, Boxes } from "lucide-react";
import {
  products, orders, formatCurrency, formatDate,
  clientOrderSummary, clientOrderStatus, clientRepeatOrders, clientTopProducts,
  clientRecurringPurchases, clientSellout, clientStockControl, clientRecommendations, clientSimilarStores,
} from "../data/mockData";
import { SectionTitle, StatusStack, RankBars, RecommendationList } from "./DashboardWidgets";

type View = 'dashboard' | 'catalog' | 'order-grade' | 'cart' | 'history' | 'marketing' | 'sellout' | 'admin' | 'clients';

interface DashboardLojistaProps {
  onNavigate: (view: View) => void;
}

const stockStatusLabel: Record<string, string> = { ruptura: 'Ruptura', baixo: 'Baixo', ok: 'OK' };
const stockStatusClass: Record<string, string> = {
  ruptura: 'bg-red-400/10 text-red-400',
  baixo: 'bg-amber-400/10 text-amber-500',
  ok: 'bg-emerald-400/10 text-emerald-400',
};

export function DashboardLojista({ onNavigate }: DashboardLojistaProps) {
  const [activeTab, setActiveTab] = useState<'geral' | 'indicadores'>('geral');
  const myOrders = orders.slice(0, 4);
  const featuredProducts = products.slice(0, 4);
  const favProducts = products.filter(p => p.isFavorite);

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
          onClick={() => setActiveTab('geral')}
          className={`px-4 py-2.5 font-medium transition-colors border-b-2 -mb-px ${activeTab === 'geral' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          style={{ fontSize: '0.85rem' }}
        >
          Visão Geral
        </button>
        <button
          onClick={() => setActiveTab('indicadores')}
          className={`px-4 py-2.5 font-medium transition-colors border-b-2 -mb-px ${activeTab === 'indicadores' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          style={{ fontSize: '0.85rem' }}
        >
          Indicadores
        </button>
      </div>

      {activeTab === 'indicadores' ? (
        <>
          {/* ============ MEUS PEDIDOS ============ */}
          <SectionTitle>Meus pedidos</SectionTitle>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="text-foreground mb-1" style={{ fontWeight: 600, fontSize: '0.9rem' }}>Resumo do período</h3>
              <p className="text-muted-foreground mb-3" style={{ fontSize: '0.75rem' }}>Recência e volume da loja</p>
              <p className="text-muted-foreground" style={{ fontSize: '0.72rem' }}>Último pedido</p>
              <p className="text-foreground" style={{ fontSize: '1.3rem', fontWeight: 700 }}>há {clientOrderSummary.lastOrderDays} dias</p>
              <p className="text-muted-foreground" style={{ fontSize: '0.72rem' }}>{formatDate(clientOrderSummary.lastOrderDate)} · dentro do esperado</p>
              <div className="flex gap-4 mt-4 pt-4 border-t border-border">
                <div><p className="text-muted-foreground" style={{ fontSize: '0.68rem' }}>Pedidos</p><p className="text-foreground" style={{ fontSize: '1rem', fontWeight: 700 }}>{clientOrderSummary.ordersCount}</p></div>
                <div><p className="text-muted-foreground" style={{ fontSize: '0.68rem' }}>Pares</p><p className="text-foreground" style={{ fontSize: '1rem', fontWeight: 700 }}>{clientOrderSummary.pairs}</p></div>
                <div><p className="text-muted-foreground" style={{ fontSize: '0.68rem' }}>Valor</p><p className="text-foreground mono" style={{ fontSize: '1rem', fontWeight: 700 }}>{formatCurrency(clientOrderSummary.value)}</p></div>
              </div>
            </div>

            <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
              <h3 className="text-foreground mb-1" style={{ fontWeight: 600, fontSize: '0.9rem' }}>Carteira de pedidos por status</h3>
              <p className="text-muted-foreground mb-4" style={{ fontSize: '0.75rem' }}>Situação dos {clientOrderSummary.ordersCount} pedidos do período</p>
              <StatusStack segments={clientOrderStatus} />
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-1">
              <RefreshCw className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-foreground" style={{ fontWeight: 600, fontSize: '0.9rem' }}>Pedidos repetidos</h3>
            </div>
            <p className="text-muted-foreground mb-3" style={{ fontSize: '0.75rem' }}>Contados pelo botão "repetir pedido" do histórico</p>
            <p className="text-foreground" style={{ fontSize: '1.6rem', fontWeight: 700 }}>{clientRepeatOrders.count}</p>
            <p className="text-emerald-400 mb-3" style={{ fontSize: '0.78rem', fontWeight: 600 }}>{clientRepeatOrders.deltaLabel}</p>
            <div className="space-y-2">
              {clientRepeatOrders.list.map(o => (
                <div key={o.orderId} className="flex items-start gap-2.5 p-2.5 rounded-lg border border-border/60">
                  <span className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'oklch(0.6 0.22 262)' }} />
                  <div>
                    <p className="text-foreground" style={{ fontSize: '0.8rem', fontWeight: 600 }}>{o.orderId} → repetido {o.times}x</p>
                    <p className="text-muted-foreground" style={{ fontSize: '0.72rem' }}>{o.product}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ============ RECOMPRA E PRODUTOS ============ */}
          <SectionTitle>Recompra e produtos</SectionTitle>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="text-foreground mb-1" style={{ fontWeight: 600, fontSize: '0.9rem' }}>Produtos mais comprados</h3>
              <p className="text-muted-foreground mb-4" style={{ fontSize: '0.75rem' }}>Mix da loja · por pares</p>
              <RankBars rows={clientTopProducts} />
            </div>
            <div className="bg-card border border-border rounded-xl p-5 overflow-x-auto">
              <h3 className="text-foreground mb-1" style={{ fontWeight: 600, fontSize: '0.9rem' }}>Compra recorrente</h3>
              <p className="text-muted-foreground mb-4" style={{ fontSize: '0.75rem' }}>Itens comprados com regularidade</p>
              <table className="w-full" style={{ fontSize: '0.78rem' }}>
                <thead>
                  <tr className="border-b border-border">
                    {['Produto', 'Cadência média', 'Compras', 'Última compra', 'Próxima prevista'].map((c, i) => (
                      <th key={c} className={`pb-2 text-muted-foreground font-medium ${i === 0 ? 'text-left' : 'text-right'}`} style={{ fontSize: '0.66rem', textTransform: 'uppercase', letterSpacing: '0.03em' }}>{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {clientRecurringPurchases.map(p => (
                    <tr key={p.product} className="border-b border-border/40">
                      <td className="py-2 text-foreground" style={{ fontWeight: 500 }}>{p.product}</td>
                      <td className="py-2 text-right text-muted-foreground">a cada {p.cadenceDays} dias</td>
                      <td className="py-2 text-right text-muted-foreground">{p.purchasesInPeriod}</td>
                      <td className="py-2 text-right text-muted-foreground">há {p.lastPurchaseDays} dias</td>
                      <td className={`py-2 text-right ${p.nextExpectedDays < 0 ? 'text-red-400' : 'text-muted-foreground'}`} style={{ fontWeight: p.nextExpectedDays < 0 ? 600 : 400 }}>
                        {p.nextExpectedDays < 0 ? `atrasado ${Math.abs(p.nextExpectedDays)}d` : `em ~${p.nextExpectedDays}d`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ============ ESTOQUE E SELL-OUT ============ */}
          <SectionTitle>Estoque e sell-out da loja</SectionTitle>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center gap-2 mb-1">
                <Boxes className="w-4 h-4 text-muted-foreground" />
                <h3 className="text-foreground" style={{ fontWeight: 600, fontSize: '0.9rem' }}>Sell-out</h3>
              </div>
              <p className="text-muted-foreground mb-3" style={{ fontSize: '0.75rem' }}>Envio do dado de venda na ponta</p>
              {clientSellout.participating && (
                <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-400/10 text-emerald-400 mb-3" style={{ fontSize: '0.7rem', fontWeight: 700 }}>✓ Loja participante</span>
              )}
              <div className="space-y-3">
                <div><p className="text-muted-foreground" style={{ fontSize: '0.7rem' }}>Giro médio do estoque</p><p className="text-foreground" style={{ fontSize: '1rem', fontWeight: 700 }}>{clientSellout.turnoverDays} dias</p></div>
                <div><p className="text-muted-foreground" style={{ fontSize: '0.7rem' }}>Valor em estoque</p><p className="text-foreground mono" style={{ fontSize: '1rem', fontWeight: 700 }}>{formatCurrency(clientSellout.stockValue)}</p></div>
                <div><p className="text-red-400" style={{ fontSize: '0.7rem' }}>SKUs em ruptura</p><p className="text-red-400" style={{ fontSize: '1rem', fontWeight: 700 }}>{clientSellout.ruptureSkus}</p></div>
              </div>
            </div>
            <div className="lg:col-span-3 bg-card border border-border rounded-xl p-5 overflow-x-auto">
              <h3 className="text-foreground mb-1" style={{ fontWeight: 600, fontSize: '0.9rem' }}>Controle de estoque</h3>
              <p className="text-muted-foreground mb-4" style={{ fontSize: '0.75rem' }}>Situação por SKU: ruptura, baixo, OK e valor</p>
              <table className="w-full" style={{ fontSize: '0.78rem' }}>
                <thead>
                  <tr className="border-b border-border">
                    {['Produto', 'Situação', 'Estoque (pares)', 'Dias em ruptura', 'Giro (dias)', 'Valor em estoque'].map((c, i) => (
                      <th key={c} className={`pb-2 text-muted-foreground font-medium ${i === 0 ? 'text-left' : 'text-right'}`} style={{ fontSize: '0.66rem', textTransform: 'uppercase', letterSpacing: '0.03em' }}>{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {clientStockControl.map(p => (
                    <tr key={p.product} className="border-b border-border/40">
                      <td className="py-2 text-foreground" style={{ fontWeight: 500 }}>{p.product}</td>
                      <td className="py-2 text-right"><span className={`px-2 py-0.5 rounded-full ${stockStatusClass[p.status]}`} style={{ fontSize: '0.66rem', fontWeight: 700 }}>{stockStatusLabel[p.status]}</span></td>
                      <td className="py-2 text-right text-muted-foreground">{p.stockPairs}</td>
                      <td className={`py-2 text-right ${p.ruptureDays ? 'text-red-400' : 'text-muted-foreground'}`} style={{ fontWeight: p.ruptureDays ? 600 : 400 }}>{p.ruptureDays ?? '—'}</td>
                      <td className="py-2 text-right text-muted-foreground">{p.turnoverDays}</td>
                      <td className="py-2 text-right text-foreground mono">{p.stockValue ? formatCurrency(p.stockValue) : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ============ RECOMENDAÇÕES ============ */}
          <SectionTitle>Recomendações</SectionTitle>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="text-foreground mb-1" style={{ fontWeight: 600, fontSize: '0.9rem' }}>Sugestões para a loja</h3>
              <p className="text-muted-foreground mb-4" style={{ fontSize: '0.75rem' }}>Top produto da empresa + top produto da região</p>
              <RecommendationList items={clientRecommendations} />
            </div>
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="text-foreground mb-1" style={{ fontWeight: 600, fontSize: '0.9rem' }}>Lojas de perfil semelhante estão comprando</h3>
              <p className="text-muted-foreground mb-4" style={{ fontSize: '0.75rem' }}>Recomendação por perfil/região similar</p>
              <RecommendationList items={clientSimilarStores} />
            </div>
          </div>
        </>
      ) : (
      <>
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
          { label: 'Pedidos este mês', value: '3', sub: 'R$ 42.500,00 total', icon: ShoppingBag, color: 'text-black' },
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
      </>
      )}
    </div>
  );
}
