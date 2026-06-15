import { useState } from "react";
import {
  Search, Filter, Grid3X3, List, Heart, Star, ShoppingCart, ChevronDown,
  X, Package2, Tag, Layers, ArrowUpDown, Eye,
} from "lucide-react";
import { products, Product, formatCurrency, Client } from "../data/mockData";

type View = 'dashboard' | 'catalog' | 'order-grade' | 'cart' | 'history' | 'marketing' | 'sellout' | 'admin' | 'clients';

interface CatalogFiltersShape {
  search: string;
  line: string;
  category: string;
  colors: string[];
  priceRange: [number, number];
}

interface CatalogPageProps {
  onNavigate: (view: View) => void;
  onSelectProduct?: (product: Product) => void;
  selectedClient?: Client | null;
  externalFilters?: CatalogFiltersShape;
  onExternalFiltersChange?: (f: CatalogFiltersShape) => void;
}

const lines = ['Todos', 'Premium', 'Urban', 'Sport'];
const categories = ['Todos', 'Social', 'Casual', 'Esportivo', 'Sandália', 'Bota'];
const collections = ['Todas', 'Inverno 2026', 'Primavera/Verão 2026'];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <Star
          key={s}
          className={`w-3 h-3 ${s <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground/30'}`}
        />
      ))}
      <span className="text-muted-foreground ml-1" style={{ fontSize: '0.68rem' }}>{rating}</span>
    </div>
  );
}

function ProductCard({ product, onOrder, onToggleFav, viewMode }: {
  product: Product;
  onOrder: () => void;
  onToggleFav: () => void;
  viewMode: 'grid' | 'list';
}) {
  const [imgError, setImgError] = useState(false);

  const availColor = {
    'disponível': 'text-emerald-400 bg-emerald-400/10',
    'baixo estoque': 'text-amber-400 bg-amber-400/10',
    'esgotado': 'text-red-400 bg-red-400/10',
  }[product.availability];

  if (viewMode === 'list') {
    return (
      <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4 hover:border-border/60 transition-colors group">
        <div className="w-20 h-20 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
          {!imgError ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" onError={() => setImgError(true)} />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package2 className="w-6 h-6 text-muted-foreground/40" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-muted-foreground" style={{ fontSize: '0.7rem', fontWeight: 500 }}>{product.reference}</p>
              <p className="text-foreground" style={{ fontSize: '0.9rem', fontWeight: 600 }}>{product.name}</p>
              <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>{product.line} · {product.category} · {product.collection}</p>
            </div>
            <StarRating rating={product.rating} />
          </div>
          <div className="flex items-center gap-3 mt-2">
            <span className={`px-2 py-0.5 rounded-full ${availColor}`} style={{ fontSize: '0.65rem', fontWeight: 600 }}>{product.availability}</span>
            <span className="text-muted-foreground" style={{ fontSize: '0.72rem' }}>{product.material}</span>
            <span className="text-muted-foreground" style={{ fontSize: '0.72rem' }}>{product.soldUnits.toLocaleString('pt-BR')} vendidos</span>
          </div>
        </div>
        <div className="text-right flex-shrink-0 space-y-2">
          <div>
            <p className="text-foreground mono" style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '-0.01em' }}>{formatCurrency(product.price)}</p>
            <p className="text-muted-foreground line-through" style={{ fontSize: '0.75rem' }}>{formatCurrency(product.priceRetail)}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onToggleFav} className={`p-2 rounded-lg border border-border transition-colors ${product.isFavorite ? 'text-red-400 border-red-400/30 bg-red-400/10' : 'text-muted-foreground hover:text-red-400'}`}>
              <Heart className={`w-3.5 h-3.5 ${product.isFavorite ? 'fill-red-400' : ''}`} />
            </button>
            <button
              onClick={onOrder}
              disabled={product.availability === 'esgotado'}
              className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-40"
              style={{ fontSize: '0.78rem', fontWeight: 600 }}
            >
              Pedir
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-border rounded-xl overflow-hidden hover:border-border/60 transition-all group hover:shadow-xl hover:shadow-black/20 hover:-translate-y-0.5">
      <div className="relative w-full pt-[80%] bg-gray-50 overflow-hidden mb-[-12px]">
        {!imgError ? (
          <img
            src={product.image}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-contain object-bottom px-2 pt-2"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Package2 className="w-10 h-10 text-muted-foreground/30" />
          </div>
        )}
        <button
          onClick={onToggleFav}
          className={`absolute top-3 right-3 p-1.5 rounded-full border transition-colors ${product.isFavorite ? 'bg-red-50 border-red-200 text-red-400' : 'bg-white/80 border-gray-200 text-gray-400 hover:text-red-400'}`}
        >
          <Heart className={`w-3.5 h-3.5 ${product.isFavorite ? 'fill-red-400' : ''}`} />
        </button>
        <div className="absolute inset-x-0 bottom-0 opacity-0 group-hover:opacity-100 transition-all">
          <button
            onClick={onOrder}
            disabled={product.availability === 'esgotado'}
            className="w-full bg-primary text-primary-foreground py-2.5 flex items-center justify-center gap-2 rounded-none disabled:opacity-40"
            style={{ fontSize: '0.85rem', fontWeight: 600 }}
          >
            <ShoppingCart className="w-4 h-4" /> Pedir por grade
          </button>
        </div>
      </div>

      <div className="p-3">
        <span className={`inline-block px-2 py-0.5 rounded-full mb-2 ${availColor}`} style={{ fontSize: '0.62rem', fontWeight: 600 }}>
          {product.availability}
        </span>
        <p className="text-muted-foreground" style={{ fontSize: '0.68rem', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{product.line} · {product.reference}</p>
        <p className="text-foreground mt-0.5 truncate" style={{ fontSize: '0.95rem', fontWeight: 600 }}>{product.name}</p>
        <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>{product.material}</p>

        <div className="flex items-center justify-between mt-2">
          <StarRating rating={product.rating} />
          <span className="text-muted-foreground" style={{ fontSize: '0.68rem' }}>{product.soldUnits.toLocaleString('pt-BR')} un.</span>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
          <div>
            <p className="text-foreground mono" style={{ fontSize: '1rem', fontWeight: 700 }}>{formatCurrency(product.price)}</p>
            <p className="text-muted-foreground line-through" style={{ fontSize: '0.72rem' }}>{formatCurrency(product.priceRetail)}</p>
          </div>
          <div className="flex items-center gap-1.5">
            {product.colors.slice(0, 3).map(color => (
              <span key={color} className="text-muted-foreground" style={{ fontSize: '0.62rem' }}>
                {color === product.colors[0] ? color : '·'}
              </span>
            ))}
            {product.colors.length > 1 && (
              <span className="text-muted-foreground" style={{ fontSize: '0.62rem' }}>+{product.colors.length - 1}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function CatalogPage({ onNavigate, externalFilters, onExternalFiltersChange }: CatalogPageProps) {
  const usingExternal = !!externalFilters;
  const [internalSearch, setInternalSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedLine, setSelectedLine] = useState('Todos');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedCollection, setSelectedCollection] = useState('Todas');
  const [sortBy, setSortBy] = useState('relevância');
  const [showFilters, setShowFilters] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(
    new Set(products.filter(p => p.isFavorite).map(p => p.id))
  );

  const search = usingExternal ? externalFilters!.search : internalSearch;
  const setSearch = (v: string) => {
    if (usingExternal && onExternalFiltersChange) onExternalFiltersChange({ ...externalFilters!, search: v });
    else setInternalSearch(v);
  };
  const effLine = usingExternal ? externalFilters!.line : selectedLine;
  const effCategory = usingExternal ? externalFilters!.category : selectedCategory;
  const effColors = usingExternal ? externalFilters!.colors : [];
  const effPriceRange = usingExternal ? externalFilters!.priceRange : null;

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.reference.toLowerCase().includes(search.toLowerCase()) ||
      p.line.toLowerCase().includes(search.toLowerCase());
    const matchLine = effLine === 'Todos' || p.line === effLine;
    const matchCat = effCategory === 'Todos' || p.category === effCategory;
    const matchCol = usingExternal || selectedCollection === 'Todas' || p.collection === selectedCollection;
    const matchColors = effColors.length === 0 || p.colors.some(c => effColors.includes(c));
    const matchPrice = !effPriceRange || (p.price >= effPriceRange[0] && p.price <= effPriceRange[1]);
    return matchSearch && matchLine && matchCat && matchCol && matchColors && matchPrice;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'preço ↑') return a.price - b.price;
    if (sortBy === 'preço ↓') return b.price - a.price;
    if (sortBy === 'mais vendidos') return b.soldUnits - a.soldUnits;
    if (sortBy === 'avaliação') return b.rating - a.rating;
    return 0;
  });

  const toggleFav = (id: string) => {
    setFavoriteIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const hasActiveFilters = selectedLine !== 'Todos' || selectedCategory !== 'Todos' || selectedCollection !== 'Todas';

  return (
    <div className="p-6 space-y-5 max-w-[1400px]">
      {/* Header + Controls */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar produto, referência, linha..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border bg-card text-foreground placeholder-muted-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            style={{ fontSize: '0.85rem' }}
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {!usingExternal && (
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg border transition-colors ${showFilters || hasActiveFilters ? 'border-primary/50 bg-primary/10 text-primary' : 'border-border bg-card text-muted-foreground hover:text-foreground'}`}
            style={{ fontSize: '0.83rem', fontWeight: 500 }}
          >
            <Filter className="w-4 h-4" />
            Filtros
            {hasActiveFilters && (
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            )}
          </button>
        )}

        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="px-3 py-2.5 rounded-lg border border-border bg-card text-foreground outline-none focus:border-primary"
          style={{ fontSize: '0.83rem' }}
        >
          {['relevância', 'mais vendidos', 'avaliação', 'preço ↑', 'preço ↓'].map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <div className="flex items-center border border-border rounded-lg overflow-hidden">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2.5 transition-colors ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:text-foreground'}`}
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2.5 transition-colors ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:text-foreground'}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {!usingExternal && showFilters && (
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-muted-foreground mb-2" style={{ fontSize: '0.75rem', fontWeight: 500 }}>Linha</p>
              <div className="flex flex-wrap gap-1.5">
                {lines.map(line => (
                  <button
                    key={line}
                    onClick={() => setSelectedLine(line)}
                    className={`px-3 py-1 rounded-full transition-colors ${selectedLine === line ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}
                    style={{ fontSize: '0.75rem', fontWeight: 500 }}
                  >
                    {line}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-muted-foreground mb-2" style={{ fontSize: '0.75rem', fontWeight: 500 }}>Categoria</p>
              <div className="flex flex-wrap gap-1.5">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-full transition-colors ${selectedCategory === cat ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}
                    style={{ fontSize: '0.75rem', fontWeight: 500 }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-muted-foreground mb-2" style={{ fontSize: '0.75rem', fontWeight: 500 }}>Coleção</p>
              <div className="flex flex-wrap gap-1.5">
                {collections.map(col => (
                  <button
                    key={col}
                    onClick={() => setSelectedCollection(col)}
                    className={`px-3 py-1 rounded-full transition-colors ${selectedCollection === col ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}
                    style={{ fontSize: '0.75rem', fontWeight: 500 }}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {hasActiveFilters && (
            <button
              onClick={() => { setSelectedLine('Todos'); setSelectedCategory('Todos'); setSelectedCollection('Todas'); }}
              className="mt-3 text-primary hover:text-primary/80 flex items-center gap-1"
              style={{ fontSize: '0.75rem' }}
            >
              <X className="w-3 h-3" /> Limpar filtros
            </button>
          )}
        </div>
      )}

      {/* Results header */}
      <div className="flex items-center justify-between">
        <div />
        {hasActiveFilters && (
          <div className="flex items-center gap-1.5">
            {selectedLine !== 'Todos' && (
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary flex items-center gap-1" style={{ fontSize: '0.72rem' }}>
                {selectedLine} <X className="w-2.5 h-2.5 cursor-pointer" onClick={() => setSelectedLine('Todos')} />
              </span>
            )}
            {selectedCategory !== 'Todos' && (
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary flex items-center gap-1" style={{ fontSize: '0.72rem' }}>
                {selectedCategory} <X className="w-2.5 h-2.5 cursor-pointer" onClick={() => setSelectedCategory('Todos')} />
              </span>
            )}
          </div>
        )}
      </div>

      {/* Products Grid/List */}
      {sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Package2 className="w-12 h-12 text-muted-foreground/30 mb-4" />
          <p className="text-foreground" style={{ fontWeight: 600 }}>Nenhum produto encontrado</p>
          <p className="text-muted-foreground mt-1" style={{ fontSize: '0.85rem' }}>Tente ajustar os filtros ou a busca</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 items-start">
          {sorted.map(product => (
            <ProductCard
              key={product.id}
              product={{ ...product, isFavorite: favoriteIds.has(product.id) }}
              viewMode="grid"
              onOrder={() => onNavigate('order-grade')}
              onToggleFav={() => toggleFav(product.id)}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map(product => (
            <ProductCard
              key={product.id}
              product={{ ...product, isFavorite: favoriteIds.has(product.id) }}
              viewMode="list"
              onOrder={() => onNavigate('order-grade')}
              onToggleFav={() => toggleFav(product.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
