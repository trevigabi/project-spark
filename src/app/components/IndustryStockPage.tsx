import { useMemo, useState } from "react";
import {
  Boxes, Search, Filter, Pencil, Save, X, AlertTriangle, PackageX,
  PackageCheck, TrendingDown, Eye, Upload, Plus,
} from "lucide-react";
import { products as allProducts, formatCurrency, type Product } from "../data/mockData";

interface IndustryStockPageProps {
  /** Rep (e viewers sem gestão) só enxergam os dados, sem controles de edição. */
  readOnly?: boolean;
}

interface StockRow {
  sku: string;
  name: string;
  line: string;
  category: string;
  image: string;
  price: number;
  stock: number;
  availability: Product['availability'];
}

const initialRows: StockRow[] = allProducts.map(p => ({
  sku: p.id,
  name: p.name,
  line: p.line,
  category: p.category,
  image: p.image,
  price: p.price,
  stock: Object.values(p.grades).reduce((a, b) => a + b, 0),
  availability: p.availability,
}));

const statusMeta: Record<Product['availability'], { label: string; cls: string }> = {
  'esgotado': { label: 'Ruptura', cls: 'bg-red-400/15 text-red-400' },
  'baixo estoque': { label: 'Baixo', cls: 'bg-amber-400/15 text-amber-400' },
  'disponível': { label: 'OK', cls: 'bg-emerald-400/15 text-emerald-400' },
};

export function IndustryStockPage({ readOnly = false }: IndustryStockPageProps) {
  const [rows, setRows] = useState<StockRow[]>(initialRows);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'todos' | Product['availability']>('todos');
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState(0);

  const filtered = useMemo(() => {
    return rows.filter(r => {
      if (query && !`${r.name} ${r.sku}`.toLowerCase().includes(query.toLowerCase())) return false;
      if (filter !== 'todos' && r.availability !== filter) return false;
      return true;
    });
  }, [rows, query, filter]);

  const kpis = useMemo(() => {
    const ruptura = rows.filter(r => r.availability === 'esgotado').length;
    const baixo = rows.filter(r => r.availability === 'baixo estoque').length;
    const ok = rows.length - ruptura - baixo;
    const valor = rows.reduce((s, r) => s + r.stock * r.price, 0);
    return { ruptura, baixo, ok, valor, total: rows.length };
  }, [rows]);

  const startEdit = (r: StockRow) => {
    setEditing(r.sku);
    setDraft(r.stock);
  };
  const saveEdit = (sku: string) => {
    setRows(prev => prev.map(r => r.sku === sku ? { ...r, stock: draft } : r));
    setEditing(null);
  };

  return (
    <div className="p-6 space-y-5 max-w-[1400px] mx-auto w-full">
      {/* Header */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Boxes className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-foreground" style={{ fontSize: '1.05rem', fontWeight: 700, letterSpacing: '-0.01em' }}>Estoque da Indústria</h2>
            <p className="text-muted-foreground" style={{ fontSize: '0.78rem' }}>
              {readOnly
                ? 'Disponibilidade consolidada de fábrica por SKU. Somente visualização.'
                : 'Gerencie a disponibilidade consolidada de fábrica que alimenta o catálogo e os alertas de ruptura.'}
            </p>
          </div>
          {readOnly && (
            <span className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary/60 text-muted-foreground flex-shrink-0" style={{ fontSize: '0.7rem', fontWeight: 600 }}>
              <Eye className="w-3 h-3" /> Somente visualização
            </span>
          )}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Em ruptura', value: String(kpis.ruptura), sub: `${kpis.total} SKUs cadastrados`, icon: PackageX, color: 'text-red-400', bg: 'bg-red-400/10' },
          { label: 'Estoque baixo', value: String(kpis.baixo), sub: 'abaixo do limiar', icon: TrendingDown, color: 'text-amber-400', bg: 'bg-amber-400/10' },
          { label: 'Estoque OK', value: String(kpis.ok), sub: 'disponíveis para venda', icon: PackageCheck, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
          { label: 'Valor em estoque', value: formatCurrency(kpis.valor), sub: 'a preço de tabela', icon: Boxes, color: 'text-black', bg: 'bg-black/10' },
        ].map(k => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-muted-foreground" style={{ fontSize: '0.75rem', fontWeight: 500 }}>{k.label}</p>
                <div className={`w-7 h-7 rounded-lg ${k.bg} flex items-center justify-center`}>
                  <Icon className={`w-3.5 h-3.5 ${k.color}`} />
                </div>
              </div>
              <p className="text-foreground" style={{ fontSize: '1.4rem', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1 }}>{k.value}</p>
              <p className="text-muted-foreground mt-1" style={{ fontSize: '0.72rem' }}>{k.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="bg-card border border-border rounded-xl p-3 flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] bg-secondary/40 border border-border rounded-lg px-3 py-2">
          <Search className="w-3.5 h-3.5 text-muted-foreground" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar por SKU ou nome..."
            className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
            style={{ fontSize: '0.82rem' }}
          />
        </div>
        <div className="inline-flex rounded-lg bg-secondary p-0.5">
          {([
            { v: 'todos', l: 'Todos' },
            { v: 'esgotado', l: 'Ruptura' },
            { v: 'baixo estoque', l: 'Baixo' },
            { v: 'disponível', l: 'OK' },
          ] as const).map(o => (
            <button
              key={o.v}
              onClick={() => setFilter(o.v)}
              className={`px-2.5 py-1.5 rounded-md transition-colors ${filter === o.v ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              style={{ fontSize: '0.75rem', fontWeight: 500 }}
            >
              {o.l}
            </button>
          ))}
        </div>
        {!readOnly && (
          <>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-secondary/60 border border-border text-foreground hover:bg-secondary transition-colors" style={{ fontSize: '0.78rem', fontWeight: 500 }}>
              <Upload className="w-3.5 h-3.5" /> Importar planilha
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors" style={{ fontSize: '0.78rem', fontWeight: 600 }}>
              <Plus className="w-3.5 h-3.5" /> Adicionar SKU
            </button>
          </>
        )}
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                {['Produto', 'SKU', 'Linha', 'Estoque de fábrica', 'Status', ...(readOnly ? [] : ['Ações'])].map(h => (
                  <th key={h} className="text-left text-muted-foreground px-4 py-2.5" style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => {
                const st = statusMeta[r.availability];
                const isEditing = editing === r.sku;
                return (
                  <tr key={r.sku} className="border-b border-border/60 hover:bg-secondary/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                          <img src={r.image} alt={r.name} className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-foreground truncate" style={{ fontSize: '0.82rem', fontWeight: 500 }}>{r.name}</p>
                          <p className="text-muted-foreground" style={{ fontSize: '0.7rem' }}>{r.category} · {formatCurrency(r.price)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground mono" style={{ fontSize: '0.75rem' }}>{r.sku}</td>
                    <td className="px-4 py-3 text-foreground" style={{ fontSize: '0.78rem' }}>{r.line}</td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <input
                          type="number"
                          value={draft}
                          onChange={e => setDraft(Number(e.target.value))}
                          className="w-24 bg-secondary border border-border rounded-md px-2 py-1 text-foreground outline-none focus:border-primary"
                          style={{ fontSize: '0.78rem' }}
                        />
                      ) : (
                        <span className="text-foreground mono" style={{ fontSize: '0.82rem', fontWeight: 600 }}>{r.stock}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full ${st.cls} inline-flex items-center gap-1`} style={{ fontSize: '0.68rem', fontWeight: 700 }}>
                        {r.availability !== 'disponível' && <AlertTriangle className="w-3 h-3" />}
                        {st.label}
                      </span>
                    </td>
                    {!readOnly && (
                      <td className="px-4 py-3">
                        {isEditing ? (
                          <div className="flex items-center gap-1">
                            <button onClick={() => saveEdit(r.sku)} className="p-1.5 rounded-md bg-primary/15 text-primary hover:bg-primary/25 transition-colors">
                              <Save className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => setEditing(null)} className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => startEdit(r)} className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={readOnly ? 5 : 6} className="px-4 py-10 text-center text-muted-foreground" style={{ fontSize: '0.82rem' }}>
                    <Filter className="w-5 h-5 mx-auto mb-2 opacity-60" />
                    Nenhum SKU encontrado para os filtros aplicados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
