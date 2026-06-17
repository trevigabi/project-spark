import { useMemo, useState } from "react";
import { ShoppingCart, Plus, Search, Store, Package2, Calendar, User, Users, ArrowLeftRight, ShoppingBag, Eye } from "lucide-react";
import { clients, formatCurrency, type Client } from "../data/mockData";

export interface CartContext {
  id: string;
  clientId: string;
  clientName: string;
  cartName: string;
}

interface MockCart extends CartContext {
  items: number;
  pairs: number;
  total: number;
  updatedAt: string;
  rep: string;
}

export const mockCarts: MockCart[] = [
  { id: 'CART-001', clientId: clients[0].id, clientName: clients[0].name, cartName: 'Reposição Inverno 26', items: 3, pairs: 44, total: 5652.97, updatedAt: '2026-06-16', rep: clients[0].rep },
  { id: 'CART-002', clientId: clients[0].id, clientName: clients[0].name, cartName: 'Lançamento Flow XL', items: 2, pairs: 28, total: 3890.40, updatedAt: '2026-06-14', rep: clients[0].rep },
  { id: 'CART-003', clientId: clients[2].id, clientName: clients[2].name, cartName: 'Pedido principal', items: 5, pairs: 72, total: 9120.00, updatedAt: '2026-06-15', rep: clients[2].rep },
  { id: 'CART-004', clientId: clients[5].id, clientName: clients[5].name, cartName: 'Coleção Primavera', items: 4, pairs: 56, total: 7240.80, updatedAt: '2026-06-13', rep: clients[5].rep },
  { id: 'CART-005', clientId: clients[1].id, clientName: clients[1].name, cartName: 'Reposição MG', items: 2, pairs: 22, total: 2750.60, updatedAt: '2026-06-12', rep: clients[1].rep },
  { id: 'CART-006', clientId: clients[6].id, clientName: clients[6].name, cartName: 'Pedido teste Sul', items: 1, pairs: 12, total: 1480.00, updatedAt: '2026-06-11', rep: clients[6].rep },
];

interface CartsListPageProps {
  onOpenCart: (ctx: CartContext) => void;
  onCreateCart?: (ctx: CartContext) => void;
  onNavigateClients?: () => void;
  selectedClient?: Client | null;
  onSelectClient?: (client: Client) => void;
  onGoToCatalog?: (ctx: CartContext) => void;
}

export function CartsListPage({ onOpenCart, onCreateCart, onNavigateClients, selectedClient, onSelectClient, onGoToCatalog }: CartsListPageProps) {
  const [q, setQ] = useState('');
  const [newOpen, setNewOpen] = useState(false);
  const [newName, setNewName] = useState('');
  // Busca rápida de cliente quando nenhum está selecionado
  const [clientQuery, setClientQuery] = useState('');
  const [showAll, setShowAll] = useState(!selectedClient);

  const scopedCarts = useMemo(() => {
    if (selectedClient && !showAll) return mockCarts.filter(c => c.clientId === selectedClient.id);
    return mockCarts;
  }, [selectedClient, showAll]);

  const otherCarts = useMemo(
    () => selectedClient ? mockCarts.filter(c => c.clientId !== selectedClient.id) : [],
    [selectedClient]
  );

  const filtered = scopedCarts.filter(c =>
    c.clientName.toLowerCase().includes(q.toLowerCase()) ||
    c.cartName.toLowerCase().includes(q.toLowerCase())
  );

  const clientMatches = useMemo(() => {
    const t = clientQuery.trim().toLowerCase();
    if (!t) return [];
    return clients.filter(c => c.name.toLowerCase().includes(t) || c.id.toLowerCase().includes(t)).slice(0, 6);
  }, [clientQuery]);

  const canCreate = !!selectedClient;

  const handleCreate = () => {
    if (!selectedClient) return;
    const ctx: CartContext = {
      id: `CART-NEW-${Date.now()}`,
      clientId: selectedClient.id,
      clientName: selectedClient.name,
      cartName: newName || 'Novo carrinho',
    };
    (onCreateCart ?? onOpenCart)(ctx);
  };

  return (
    <div className="p-6 max-w-[1200px] mx-auto w-full">
      <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
        <div>
          <h2 className="text-foreground" style={{ fontWeight: 700, fontSize: '1.15rem' }}>
            {selectedClient && !showAll ? `Carrinhos de ${selectedClient.name}` : 'Carrinhos em construção'}
          </h2>
          <p className="text-muted-foreground" style={{ fontSize: '0.82rem' }}>
            {selectedClient && !showAll
              ? 'Carrinhos vinculados ao cliente atual. Você pode manter mais de um.'
              : 'Cada carrinho está vinculado a um cliente. Abrir um carrinho de outro cliente troca o cliente ativo.'}
          </p>
        </div>
        {!newOpen && (
          <button
            onClick={() => canCreate && setNewOpen(true)}
            disabled={!canCreate}
            title={canCreate ? 'Criar novo carrinho' : 'Selecione um cliente para criar um carrinho'}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-colors ${canCreate ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-muted text-muted-foreground cursor-not-allowed opacity-70'}`}
            style={{ fontSize: '0.83rem', fontWeight: 600 }}
          >
            <Plus className="w-4 h-4" /> Novo carrinho
          </button>
        )}
      </div>

      {/* Bloco sem cliente selecionado: busca rápida + atalho para carteira */}
      {!selectedClient && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-5">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
              <Users className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-foreground" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Selecione um cliente para criar um carrinho</p>
              <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>Busque pelo nome ou abra sua carteira de clientes.</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <div className="flex items-center gap-2 rounded-lg bg-background border border-border px-3 py-2">
                <Search className="w-3.5 h-3.5 text-muted-foreground" />
                <input
                  value={clientQuery}
                  onChange={e => setClientQuery(e.target.value)}
                  placeholder="Buscar cliente por nome ou código..."
                  className="flex-1 bg-transparent outline-none text-foreground placeholder-muted-foreground"
                  style={{ fontSize: '0.82rem' }}
                />
              </div>
              {clientQuery && clientMatches.length > 0 && (
                <div className="absolute z-10 left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg overflow-hidden">
                  {clientMatches.map(c => (
                    <button
                      key={c.id}
                      onClick={() => {
                        onSelectClient?.(c);
                        setClientQuery('');
                        setNewOpen(true);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-secondary/60 flex items-center gap-2 transition-colors"
                    >
                      <Store className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-foreground" style={{ fontSize: '0.82rem' }}>{c.name}</span>
                      <span className="text-muted-foreground ml-auto mono" style={{ fontSize: '0.7rem' }}>{c.id}</span>
                    </button>
                  ))}
                </div>
              )}
              {clientQuery && clientMatches.length === 0 && (
                <div className="absolute z-10 left-0 right-0 mt-1 bg-card border border-border rounded-lg p-3 text-muted-foreground" style={{ fontSize: '0.78rem' }}>
                  Nenhum cliente encontrado.
                </div>
              )}
            </div>
            {onNavigateClients && (
              <button
                onClick={onNavigateClients}
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-primary/30 text-primary hover:bg-primary/10 transition-colors"
                style={{ fontSize: '0.8rem', fontWeight: 600 }}
              >
                <Users className="w-3.5 h-3.5" />
                Buscar clientes em carteira
              </button>
            )}
          </div>
        </div>
      )}

      {/* Toggle para ver carrinhos de outros clientes */}
      {selectedClient && (
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => setShowAll(false)}
            className={`px-3 py-1.5 rounded-md border transition-colors ${!showAll ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:text-foreground'}`}
            style={{ fontSize: '0.78rem', fontWeight: 600 }}
          >
            Deste cliente
          </button>
          <button
            onClick={() => setShowAll(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border transition-colors ${showAll ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:text-foreground'}`}
            style={{ fontSize: '0.78rem', fontWeight: 600 }}
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            Todos os clientes
            {otherCarts.length > 0 && (
              <span className={`ml-1 px-1.5 rounded ${showAll ? 'bg-primary-foreground/20' : 'bg-muted'}`} style={{ fontSize: '0.7rem' }}>
                +{otherCarts.length}
              </span>
            )}
          </button>
        </div>
      )}

      {newOpen && selectedClient && (
        <div className="bg-card border border-border rounded-xl p-4 mb-5">
          <p className="text-foreground mb-1" style={{ fontWeight: 600, fontSize: '0.9rem' }}>Criar novo carrinho</p>
          <p className="text-muted-foreground mb-3 flex items-center gap-1.5" style={{ fontSize: '0.78rem' }}>
            <Store className="w-3 h-3" /> Cliente: <span className="text-foreground" style={{ fontWeight: 600 }}>{selectedClient.name}</span>
          </p>
          <div>
            <label className="block text-muted-foreground mb-1" style={{ fontSize: '0.72rem' }}>Nome do carrinho</label>
            <input
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="Ex.: Reposição Inverno 26"
              className="w-full px-2.5 py-2 rounded-md border border-border bg-surface text-foreground placeholder-muted-foreground outline-none focus:border-primary"
              style={{ fontSize: '0.82rem' }}
            />
          </div>
          <div className="flex justify-end gap-2 mt-3">
            <button onClick={() => setNewOpen(false)} className="px-3 py-1.5 rounded-md border border-border text-muted-foreground hover:text-foreground" style={{ fontSize: '0.8rem' }}>Cancelar</button>
            <button onClick={handleCreate} className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90" style={{ fontSize: '0.8rem', fontWeight: 600 }}>Criar e abrir</button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 rounded-lg bg-secondary/40 border border-border px-3 py-2 mb-5 max-w-md">
        <Search className="w-3.5 h-3.5 text-muted-foreground" />
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Buscar por cliente ou nome do carrinho..."
          className="flex-1 bg-transparent outline-none text-foreground placeholder-muted-foreground"
          style={{ fontSize: '0.82rem' }}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(c => {
          const isOther = selectedClient && c.clientId !== selectedClient.id;
          return (
            <button
              key={c.id}
              onClick={() => onOpenCart({ id: c.id, clientId: c.clientId, clientName: c.clientName, cartName: c.cartName })}
              className="text-left bg-card border border-border rounded-xl p-4 hover:border-primary/50 hover:bg-secondary/30 transition-all group relative"
            >
              {isOther && (
                <span className="absolute top-3 right-3 flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400" style={{ fontSize: '0.65rem', fontWeight: 600 }}>
                  <ArrowLeftRight className="w-2.5 h-2.5" /> troca cliente
                </span>
              )}
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4 text-primary" />
                </div>
                <span className="text-foreground mono" style={{ fontSize: '0.95rem', fontWeight: 700 }}>{formatCurrency(c.total)}</span>
              </div>
              <p className="text-foreground group-hover:text-primary transition-colors truncate" style={{ fontWeight: 600, fontSize: '0.92rem' }}>{c.cartName}</p>
              <div className="flex items-center gap-1.5 mt-1 text-muted-foreground">
                <Store className="w-3 h-3" />
                <span className="truncate" style={{ fontSize: '0.76rem' }}>{c.clientName}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-border">
                <div className="flex items-center gap-1 text-muted-foreground" title="Itens">
                  <Package2 className="w-3 h-3" />
                  <span style={{ fontSize: '0.72rem' }}>{c.items} itens</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground" title="Pares">
                  <span className="mono" style={{ fontSize: '0.72rem' }}>{c.pairs} pares</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground justify-end" title="Atualizado">
                  <Calendar className="w-3 h-3" />
                  <span style={{ fontSize: '0.72rem' }}>{new Date(c.updatedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-muted-foreground">
                <User className="w-3 h-3" />
                <span className="truncate" style={{ fontSize: '0.7rem' }}>Rep: {c.rep}</span>
              </div>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <ShoppingCart className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p style={{ fontSize: '0.88rem' }}>
            {selectedClient && !showAll
              ? `Nenhum carrinho para ${selectedClient.name} ainda. Crie um novo ou veja carrinhos de outros clientes.`
              : 'Nenhum carrinho encontrado.'}
          </p>
        </div>
      )}
    </div>
  );
}
