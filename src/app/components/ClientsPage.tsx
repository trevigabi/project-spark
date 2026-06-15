import { useState } from "react";
import { Search, MapPin, ShoppingBag, TrendingUp, Users, Store, X } from "lucide-react";
import { clients, Client, formatCurrency, formatDate } from "../data/mockData";

type View = 'dashboard' | 'catalog' | 'order-grade' | 'cart' | 'history' | 'marketing' | 'sellout' | 'admin' | 'clients';

interface ClientsPageProps {
  onNavigate: (view: View) => void;
  selectedClient: Client | null;
  setSelectedClient: (client: Client | null) => void;
}

const statusColors: Record<string, string> = {
  'ativo': 'text-emerald-400 bg-emerald-400/10',
  'inativo': 'text-red-400 bg-red-400/10',
  'em aberto': 'text-amber-400 bg-amber-400/10',
};

export function ClientsPage({ onNavigate, selectedClient, setSelectedClient }: ClientsPageProps) {
  const [search, setSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState('Todos');

  const regions = ['Todos', 'Sudeste', 'Sul', 'Nordeste', 'Centro-Oeste', 'Norte'];

  const filtered = clients.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase()) ||
      c.rep.toLowerCase().includes(search.toLowerCase());
    const matchRegion = regionFilter === 'Todos' || c.region === regionFilter;
    return matchSearch && matchRegion;
  });

  const totalPortfolio = filtered.reduce((acc, c) => acc + c.totalPurchased, 0);
  const activeCount = filtered.filter(c => c.status === 'ativo').length;

  const handleSelectClient = (client: Client) => {
    setSelectedClient(client);
    onNavigate('catalog');
  };

  return (
    <div className="p-6 max-w-[1100px] space-y-5">
      {/* Banner — client selected */}
      {selectedClient && (
        <div className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3">
          <Store className="w-4 h-4 text-primary flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-primary truncate" style={{ fontSize: '0.88rem', fontWeight: 600 }}>{selectedClient.name}</p>
            <p className="text-muted-foreground" style={{ fontSize: '0.72rem' }}>Cliente selecionado — clique em outro para trocar</p>
          </div>
          <button
            onClick={() => setSelectedClient(null)}
            className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded"
            title="Remover seleção"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total de clientes', value: String(filtered.length), sub: 'na carteira filtrada' },
          { label: 'Clientes ativos', value: String(activeCount), sub: `de ${filtered.length} total` },
          { label: 'Volume total', value: formatCurrency(totalPortfolio), sub: 'compras históricas', mono: true },
        ].map(stat => (
          <div key={stat.label} className="bg-card border border-border rounded-xl p-4">
            <p className="text-muted-foreground mb-1" style={{ fontSize: '0.75rem', fontWeight: 500 }}>{stat.label}</p>
            <p className={`text-foreground ${stat.mono ? 'mono' : ''}`} style={{ fontSize: '1.15rem', fontWeight: 700 }}>{stat.value}</p>
            <p className="text-muted-foreground" style={{ fontSize: '0.7rem' }}>{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar cliente, cidade, rep..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-card text-foreground placeholder-muted-foreground outline-none focus:border-primary"
            style={{ fontSize: '0.82rem' }}
          />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {regions.map(r => (
            <button
              key={r}
              onClick={() => setRegionFilter(r)}
              className={`px-3 py-1.5 rounded-full transition-colors ${regionFilter === r ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-muted-foreground hover:text-foreground'}`}
              style={{ fontSize: '0.75rem', fontWeight: 500 }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Client grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.map(client => {
          const isSelected = selectedClient?.id === client.id;
          return (
            <div
              key={client.id}
              className={`bg-card border rounded-xl p-4 cursor-pointer transition-all hover:border-primary/40 ${isSelected ? 'border-primary/50 bg-primary/5' : 'border-border'}`}
              onClick={() => handleSelectClient(client)}
            >
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary" style={{ fontSize: '0.75rem', fontWeight: 700 }}>{client.avatar}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-foreground truncate" style={{ fontSize: '0.9rem', fontWeight: 600 }}>{client.name}</p>
                    <span className={`px-1.5 py-0.5 rounded-full flex-shrink-0 ${statusColors[client.status]}`} style={{ fontSize: '0.62rem', fontWeight: 600 }}>
                      {client.status}
                    </span>
                    {isSelected && (
                      <span className="px-1.5 py-0.5 rounded-full flex-shrink-0 bg-primary/15 text-primary" style={{ fontSize: '0.62rem', fontWeight: 600 }}>
                        selecionado
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground flex items-center gap-1 mt-0.5" style={{ fontSize: '0.75rem' }}>
                    <MapPin className="w-3 h-3" /> {client.city}, {client.state} · {client.region}
                  </p>
                  <p className="text-muted-foreground" style={{ fontSize: '0.72rem' }}>Rep: {client.rep}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-foreground mono" style={{ fontSize: '0.85rem', fontWeight: 700 }}>{formatCurrency(client.totalPurchased)}</p>
                  <p className="text-muted-foreground" style={{ fontSize: '0.68rem' }}>histórico</p>
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="col-span-2 flex flex-col items-center justify-center py-16 text-center">
            <Users className="w-10 h-10 text-muted-foreground/30 mb-3" />
            <p className="text-foreground" style={{ fontWeight: 600 }}>Nenhum cliente encontrado</p>
            <p className="text-muted-foreground mt-1" style={{ fontSize: '0.85rem' }}>Tente ajustar os filtros</p>
          </div>
        )}
      </div>
    </div>
  );
}
