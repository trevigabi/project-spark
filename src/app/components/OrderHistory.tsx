import { useState } from "react";
import { Clock, Package2, RotateCcw, Eye, Search, Filter, ChevronDown, Download, FileText } from "lucide-react";
import { orders, formatCurrency, formatDate } from "../data/mockData";

type View = 'dashboard' | 'catalog' | 'order-grade' | 'cart' | 'history' | 'marketing' | 'sellout' | 'admin' | 'clients';

type Profile = 'admin' | 'rep' | 'lojista';

interface OrderHistoryProps {
  onNavigate: (view: View) => void;
  profile?: Profile;
}

const statusColors: Record<string, string> = {
  'aprovado': 'text-blue-400 bg-blue-400/10',
  'em análise': 'text-amber-400 bg-amber-400/10',
  'faturado': 'text-emerald-400 bg-emerald-400/10',
  'cancelado': 'text-red-400 bg-red-400/10',
  'entregue': 'text-purple-400 bg-purple-400/10',
};

const statusDot: Record<string, string> = {
  'aprovado': 'bg-blue-400',
  'em análise': 'bg-amber-400',
  'faturado': 'bg-emerald-400',
  'cancelado': 'bg-red-400',
  'entregue': 'bg-purple-400',
};

export function OrderHistory({ onNavigate, profile = 'admin' }: OrderHistoryProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const statuses = ['todos', 'aprovado', 'em análise', 'faturado', 'entregue', 'cancelado'];

  const baseOrders = profile === 'rep'
    ? orders.filter(o => o.rep === 'Marcos Andrade')
    : orders;

  const filtered = baseOrders.filter(o => {
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.client.toLowerCase().includes(search.toLowerCase()) ||
      o.rep.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'todos' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalValue = filtered.reduce((acc, o) => acc + o.total, 0);

  return (
    <div className="p-6 max-w-[1000px] mx-auto w-full space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Pedidos', value: String(filtered.length), sub: 'no período' },
          { label: 'Total', value: formatCurrency(totalValue), sub: 'em pedidos', mono: true },
          { label: 'Ticket médio', value: formatCurrency(filtered.length ? totalValue / filtered.length : 0), sub: 'por pedido', mono: true },
        ].map(stat => (
          <div key={stat.label} className="bg-card border border-border rounded-xl p-4">
            <p className="text-muted-foreground mb-1" style={{ fontSize: '0.75rem', fontWeight: 500 }}>{stat.label}</p>
            <p className={`text-foreground ${stat.mono ? 'mono' : ''}`} style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: stat.mono ? '-0.01em' : undefined }}>{stat.value}</p>
            <p className="text-muted-foreground" style={{ fontSize: '0.7rem' }}>{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[160px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar pedido, cliente, rep..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-card text-foreground placeholder-muted-foreground outline-none focus:border-primary"
            style={{ fontSize: '0.82rem' }}
          />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {statuses.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-full transition-colors capitalize ${statusFilter === s ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-muted-foreground hover:text-foreground'}`}
              style={{ fontSize: '0.75rem', fontWeight: 500 }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Orders table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-left" style={{ fontSize: '0.82rem' }}>
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-4 py-2.5 font-semibold text-muted-foreground" style={{ width: '30%' }}>Pedido</th>
              {profile !== 'rep' && <th className="px-4 py-2.5 font-semibold text-muted-foreground">Representante</th>}
              <th className="px-4 py-2.5 font-semibold text-muted-foreground">Status</th>
              <th className="px-4 py-2.5 font-semibold text-muted-foreground">Data</th>
              <th className="px-4 py-2.5 font-semibold text-muted-foreground">Pares</th>
              <th className="px-4 py-2.5 font-semibold text-muted-foreground text-right">Total</th>
              <th className="px-4 py-2.5 font-semibold text-muted-foreground text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(order => (
              <>
                <tr
                  key={order.id}
                  className={`border-b border-border cursor-pointer transition-colors hover:bg-primary/5 ${expandedId === order.id ? 'bg-primary/5' : ''}`}
                  onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-foreground mono truncate" style={{ fontSize: '0.85rem', fontWeight: 600 }}>{order.id}</p>
                        <p className="text-muted-foreground truncate" style={{ fontSize: '0.72rem' }}>{order.client}</p>
                      </div>
                    </div>
                  </td>
                  {profile !== 'rep' && (
                    <td className="px-4 py-3 text-muted-foreground" style={{ fontSize: '0.8rem' }}>{order.rep}</td>
                  )}
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full ${statusColors[order.status]}`} style={{ fontSize: '0.72rem', fontWeight: 600 }}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground" style={{ fontSize: '0.8rem' }}>{formatDate(order.date)}</td>
                  <td className="px-4 py-3 text-muted-foreground" style={{ fontSize: '0.8rem' }}>{order.items}</td>
                  <td className="px-4 py-3 text-right">
                    <p className="text-foreground mono" style={{ fontSize: '0.85rem', fontWeight: 700 }}>{formatCurrency(order.total)}</p>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform inline-block ${expandedId === order.id ? 'rotate-180' : ''}`} />
                  </td>
                </tr>
                {expandedId === order.id && (
                  <tr key={`${order.id}-expanded`} className="border-b border-border bg-secondary/20">
                    <td colSpan={profile !== 'rep' ? 7 : 6} className="px-4 py-4">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                        {[
                          { label: 'Coleção', value: order.collection },
                          { label: 'Pagamento', value: order.paymentCondition },
                          { label: 'Total de pares', value: `${order.items} pares` },
                          { label: 'Ticket médio/par', value: formatCurrency(order.total / order.items) },
                        ].map(detail => (
                          <div key={detail.label}>
                            <p className="text-muted-foreground" style={{ fontSize: '0.7rem' }}>{detail.label}</p>
                            <p className="text-foreground" style={{ fontSize: '0.82rem', fontWeight: 500 }}>{detail.value}</p>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors" style={{ fontSize: '0.78rem', fontWeight: 500 }}>
                          <Eye className="w-3.5 h-3.5" /> Ver detalhes
                        </button>
                        <button
                          onClick={e => { e.stopPropagation(); onNavigate('cart'); }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                          style={{ fontSize: '0.78rem', fontWeight: 600 }}
                        >
                          <RotateCcw className="w-3.5 h-3.5" /> Repetir pedido
                        </button>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors" style={{ fontSize: '0.78rem', fontWeight: 500 }}>
                          <Download className="w-3.5 h-3.5" /> PDF
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Clock className="w-10 h-10 text-muted-foreground/30 mb-3" />
            <p className="text-foreground" style={{ fontWeight: 600 }}>Nenhum pedido encontrado</p>
            <p className="text-muted-foreground mt-1" style={{ fontSize: '0.85rem' }}>Tente ajustar os filtros de busca</p>
          </div>
        )}
      </div>
    </div>
  );
}
