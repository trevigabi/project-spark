import { useMemo, useState } from "react";
import {
  Search,
  ShoppingCart,
  ChevronDown,
  ChevronUp,
  User,
  LogOut,
  X,
  Loader2,
  Plus,
  Minus,
  Trash2,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { Slider } from "./ui/slider";
import { Switch } from "./ui/switch";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

// ---------- Brand tokens ----------
const NAVY = "#0D1B4B";
const ELECTRIC = "#1E50E2";

// ---------- Types & data ----------
type Line = "Coil" | "Hertz" | "Hertz Art" | "Flow" | "Flow XL";
type GradeSize = 90 | 120 | 150 | 180 | 210;

interface Product {
  id: number;
  name: string;
  ref: string;
  line: Line;
  color: string;
  colorHex: string;
  price: number;
  grades: GradeSize[];
  inStock: boolean;
  createdAt: number; // ordering "novidades"
}

const ALL_GRADES: GradeSize[] = [90, 120, 150, 180, 210];

const COLORS: { name: string; hex: string }[] = [
  { name: "Preto", hex: "#111111" },
  { name: "Branco", hex: "#F5F5F5" },
  { name: "Marinho", hex: "#0D1B4B" },
  { name: "Caramelo", hex: "#A0612A" },
  { name: "Cinza", hex: "#8A8F98" },
  { name: "Denim", hex: "#3B5C8A" },
];

const PRODUCTS: Product[] = [
  { id: 1, name: "Coil Classic Preto", ref: "2301-01", line: "Coil", color: "Preto", colorHex: "#111111", price: 243.73, grades: [90,120,150,180,210], inStock: true, createdAt: 1 },
  { id: 2, name: "Coil Classic Branco", ref: "2301-02", line: "Coil", color: "Branco", colorHex: "#F5F5F5", price: 243.73, grades: [90,120,150,180,210], inStock: true, createdAt: 2 },
  { id: 3, name: "Hertz Caramelo", ref: "2401-05", line: "Hertz", color: "Caramelo", colorHex: "#A0612A", price: 299.90, grades: [90,120,150,180,210], inStock: true, createdAt: 3 },
  { id: 4, name: "Hertz Marinho", ref: "2401-07", line: "Hertz", color: "Marinho", colorHex: "#0D1B4B", price: 299.90, grades: [90,120,150,180], inStock: false, createdAt: 4 },
  { id: 5, name: "Hertz Art Grafite", ref: "2401-12", line: "Hertz Art", color: "Cinza", colorHex: "#8A8F98", price: 319.90, grades: [120,150,180,210], inStock: true, createdAt: 5 },
  { id: 6, name: "Flow Branco", ref: "2501-03", line: "Flow", color: "Branco", colorHex: "#F5F5F5", price: 339.80, grades: [90,120,150,180,210], inStock: true, createdAt: 6 },
  { id: 7, name: "Flow Preto", ref: "2501-04", line: "Flow", color: "Preto", colorHex: "#111111", price: 339.80, grades: [90,120,150,180,210], inStock: true, createdAt: 7 },
  { id: 8, name: "Flow Cinza", ref: "2501-08", line: "Flow", color: "Cinza", colorHex: "#8A8F98", price: 339.80, grades: [120,150,180,210], inStock: true, createdAt: 8 },
  { id: 9, name: "Flow XL Denim", ref: "2502-19", line: "Flow XL", color: "Denim", colorHex: "#3B5C8A", price: 359.60, grades: [90,120,150,180,210], inStock: true, createdAt: 9 },
  { id: 10, name: "Flow XL Caramelo", ref: "2502-21", line: "Flow XL", color: "Caramelo", colorHex: "#A0612A", price: 359.60, grades: [120,150,180,210], inStock: true, createdAt: 10 },
  { id: 11, name: "Flow XL Preto", ref: "2502-22", line: "Flow XL", color: "Preto", colorHex: "#111111", price: 359.60, grades: [90,120,150,180,210], inStock: true, createdAt: 11 },
  { id: 12, name: "Flow XL Branco", ref: "2502-23", line: "Flow XL", color: "Branco", colorHex: "#F5F5F5", price: 446.46, grades: [90,120,150,180,210], inStock: true, createdAt: 12 },
];

// Repeat catalog to simulate infinite scroll
const EXPANDED: Product[] = Array.from({ length: 4 }).flatMap((_, i) =>
  PRODUCTS.map((p) => ({ ...p, id: p.id + i * 100, ref: i === 0 ? p.ref : `${p.ref}-${i+1}` }))
);

const LINES: Line[] = ["Coil", "Hertz", "Hertz Art", "Flow", "Flow XL"];

const formatBRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// ---------- Filter Section ----------
function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-neutral-200 py-4">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between text-left"
      >
        <span className="text-[13px] font-semibold tracking-wide uppercase text-neutral-700">
          {title}
        </span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-neutral-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-neutral-500" />
        )}
      </button>
      <div
        className="overflow-hidden transition-all duration-150"
        style={{ maxHeight: open ? 1000 : 0, opacity: open ? 1 : 0 }}
      >
        <div className="pt-3">{children}</div>
      </div>
    </div>
  );
}

// ---------- Cart ----------
interface CartItem {
  product: Product;
  grade: GradeSize;
  qty: number;
}

interface LojistaAppProps {
  onLogout: () => void;
}

export function LojistaApp({ onLogout }: LojistaAppProps) {
  // filters
  const [search, setSearch] = useState("");
  const [selectedLines, setSelectedLines] = useState<Line[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 800]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedGrades, setSelectedGrades] = useState<GradeSize[]>([]);
  const [sortBy, setSortBy] = useState<string>("relevance");

  // catalog (infinite scroll)
  const [visibleCount, setVisibleCount] = useState(9);
  const [loadingMore, setLoadingMore] = useState(false);

  // cart
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const toggleLine = (l: Line) =>
    setSelectedLines((s) => (s.includes(l) ? s.filter((x) => x !== l) : [...s, l]));
  const toggleColor = (c: string) =>
    setSelectedColors((s) => (s.includes(c) ? s.filter((x) => x !== c) : [...s, c]));
  const toggleGrade = (g: GradeSize) =>
    setSelectedGrades((s) => (s.includes(g) ? s.filter((x) => x !== g) : [...s, g]));

  const clearAll = () => {
    setSelectedLines([]);
    setSelectedColors([]);
    setPriceRange([0, 800]);
    setInStockOnly(false);
    setSelectedGrades([]);
    setSearch("");
  };

  const filtered = useMemo(() => {
    let list = EXPANDED.filter((p) => {
      if (search) {
        const q = search.toLowerCase();
        if (!p.name.toLowerCase().includes(q) && !p.ref.toLowerCase().includes(q))
          return false;
      }
      if (selectedLines.length && !selectedLines.includes(p.line)) return false;
      if (selectedColors.length && !selectedColors.includes(p.color)) return false;
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
      if (inStockOnly && !p.inStock) return false;
      if (selectedGrades.length && !selectedGrades.some((g) => p.grades.includes(g)))
        return false;
      return true;
    });

    switch (sortBy) {
      case "priceAsc":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "priceDesc":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "new":
        list = [...list].sort((a, b) => b.createdAt - a.createdAt);
        break;
    }
    return list;
  }, [search, selectedLines, selectedColors, priceRange, inStockOnly, selectedGrades, sortBy]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 240 && hasMore && !loadingMore) {
      setLoadingMore(true);
      setTimeout(() => {
        setVisibleCount((c) => c + 9);
        setLoadingMore(false);
      }, 500);
    }
  };

  const addToCart = (p: Product, grade: GradeSize) => {
    setCart((prev) => {
      const idx = prev.findIndex((c) => c.product.id === p.id && c.grade === grade);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + 1 };
        return copy;
      }
      return [...prev, { product: p, grade, qty: 1 }];
    });
  };

  const updateQty = (i: number, delta: number) => {
    setCart((prev) => {
      const copy = [...prev];
      const next = copy[i].qty + delta;
      if (next <= 0) return copy.filter((_, idx) => idx !== i);
      copy[i] = { ...copy[i], qty: next };
      return copy;
    });
  };

  const removeItem = (i: number) =>
    setCart((prev) => prev.filter((_, idx) => idx !== i));

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const subtotal = cart.reduce((s, i) => s + i.qty * i.product.price, 0);

  // Active filter chips
  const activeChips: { key: string; label: string; onRemove: () => void }[] = [
    ...selectedLines.map((l) => ({ key: `l-${l}`, label: l, onRemove: () => toggleLine(l) })),
    ...selectedColors.map((c) => ({ key: `c-${c}`, label: c, onRemove: () => toggleColor(c) })),
    ...selectedGrades.map((g) => ({ key: `g-${g}`, label: `Grade ${g}`, onRemove: () => toggleGrade(g) })),
    ...(inStockOnly ? [{ key: "stock", label: "Em estoque", onRemove: () => setInStockOnly(false) }] : []),
    ...(priceRange[0] !== 0 || priceRange[1] !== 800
      ? [{ key: "price", label: `${formatBRL(priceRange[0])} - ${formatBRL(priceRange[1])}`, onRemove: () => setPriceRange([0, 800]) }]
      : []),
  ];

  return (
    <div className="h-screen flex flex-col bg-white text-neutral-900" style={{ fontFamily: "Inter, ui-sans-serif, system-ui" }}>
      {/* TOPBAR */}
      <header
        className="h-16 flex items-center justify-between px-6 border-b border-neutral-200 flex-shrink-0"
        style={{ backgroundColor: NAVY, color: "white" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-md flex items-center justify-center font-bold"
            style={{ backgroundColor: ELECTRIC }}
          >
            TF
          </div>
          <div className="leading-tight">
            <div className="text-[15px] font-bold tracking-wide">TESLA FOOTWEAR</div>
            <div className="text-[11px] opacity-70 uppercase tracking-widest">Pace Seller</div>
          </div>
        </div>

        <div className="flex-1 max-w-xl mx-8 relative hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setVisibleCount(9);
            }}
            placeholder='Buscar por nome ou referência (ex: "Flow XL Denim")'
            className="w-full h-10 rounded-md bg-white/10 border border-white/20 pl-10 pr-4 text-sm placeholder:text-white/50 text-white focus:outline-none focus:ring-2 focus:ring-white/40 transition"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCartOpen(true)}
            className="relative w-10 h-10 flex items-center justify-center rounded-md hover:bg-white/10 transition-colors duration-150"
            aria-label="Carrinho"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span
                className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center"
                style={{ backgroundColor: ELECTRIC, color: "white" }}
              >
                {cartCount}
              </span>
            )}
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors duration-150">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: ELECTRIC }}
                >
                  <User className="w-4 h-4" />
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Minha Loja</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout} className="cursor-pointer">
                <LogOut className="w-4 h-4 mr-2" /> Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* BODY */}
      <div className="flex-1 flex min-h-0">
        {/* SIDEBAR FILTERS */}
        <aside className="w-[260px] flex-shrink-0 border-r border-neutral-200 bg-white overflow-y-auto hidden lg:block">
          <div className="px-5 py-4 flex items-center justify-between border-b border-neutral-200">
            <h3 className="text-[15px] font-bold" style={{ color: NAVY }}>Filtros</h3>
            <button
              onClick={clearAll}
              className="text-xs font-medium hover:underline"
              style={{ color: ELECTRIC }}
            >
              Limpar tudo
            </button>
          </div>
          <div className="px-5">
            <FilterSection title="Linha de produto">
              <div className="space-y-2">
                {LINES.map((l) => (
                  <label key={l} className="flex items-center gap-2 cursor-pointer text-sm text-neutral-700">
                    <Checkbox
                      checked={selectedLines.includes(l)}
                      onCheckedChange={() => toggleLine(l)}
                    />
                    {l}
                  </label>
                ))}
              </div>
            </FilterSection>

            <FilterSection title="Cor">
              <div className="flex flex-wrap gap-2">
                {COLORS.map((c) => {
                  const active = selectedColors.includes(c.name);
                  return (
                    <button
                      key={c.name}
                      onClick={() => toggleColor(c.name)}
                      title={c.name}
                      className="w-8 h-8 rounded-full transition-all duration-150"
                      style={{
                        backgroundColor: c.hex,
                        border: active ? `2px solid ${ELECTRIC}` : "1px solid #E5E7EB",
                        boxShadow: active ? `0 0 0 2px white inset` : "none",
                      }}
                    />
                  );
                })}
              </div>
            </FilterSection>

            <FilterSection title="Faixa de preço">
              <div className="px-1">
                <Slider
                  min={0}
                  max={800}
                  step={10}
                  value={priceRange}
                  onValueChange={(v) => setPriceRange([v[0], v[1]] as [number, number])}
                />
                <div className="flex items-center gap-2 mt-3">
                  <Input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="h-8 text-xs"
                  />
                  <span className="text-neutral-400 text-xs">—</span>
                  <Input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="h-8 text-xs"
                  />
                </div>
              </div>
            </FilterSection>

            <FilterSection title="Disponibilidade">
              <label className="flex items-center justify-between cursor-pointer text-sm text-neutral-700">
                Apenas em estoque
                <Switch checked={inStockOnly} onCheckedChange={setInStockOnly} />
              </label>
            </FilterSection>

            <FilterSection title="Grade disponível">
              <div className="flex flex-wrap gap-2">
                {ALL_GRADES.map((g) => {
                  const active = selectedGrades.includes(g);
                  return (
                    <button
                      key={g}
                      onClick={() => toggleGrade(g)}
                      className="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150"
                      style={{
                        backgroundColor: active ? ELECTRIC : "#F3F4F6",
                        color: active ? "white" : "#374151",
                      }}
                    >
                      {g}
                    </button>
                  );
                })}
              </div>
            </FilterSection>
          </div>
        </aside>

        {/* MAIN CATALOG */}
        <main className="flex-1 overflow-y-auto" onScroll={handleScroll}>
          <div className="px-6 py-5">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h1 className="text-2xl font-bold tracking-tight" style={{ color: NAVY }}>
                  Catálogo
                </h1>
                <p className="text-sm text-neutral-500 mt-0.5">
                  {filtered.length} produtos encontrados
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-500">Ordenar por</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-44 h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevância</SelectItem>
                    <SelectItem value="priceAsc">Menor preço</SelectItem>
                    <SelectItem value="priceDesc">Maior preço</SelectItem>
                    <SelectItem value="new">Novidades</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active chips */}
            {activeChips.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mt-4">
                {activeChips.map((c) => (
                  <button
                    key={c.key}
                    onClick={c.onRemove}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors duration-150 hover:bg-neutral-50"
                    style={{ borderColor: "#E5E7EB", color: NAVY }}
                  >
                    {c.label}
                    <X className="w-3 h-3" />
                  </button>
                ))}
                <button
                  onClick={clearAll}
                  className="text-xs font-medium ml-1 hover:underline"
                  style={{ color: ELECTRIC }}
                >
                  Limpar tudo
                </button>
              </div>
            )}

            {/* Product grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
              {visible.map((p) => (
                <ProductCard key={p.id} product={p} onAdd={addToCart} />
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-20 text-neutral-500">
                Nenhum produto encontrado com os filtros aplicados.
              </div>
            )}

            {hasMore && (
              <div className="flex justify-center py-8">
                <Loader2 className="w-5 h-5 animate-spin text-neutral-400" />
              </div>
            )}
          </div>
        </main>
      </div>

      {/* CART DRAWER */}
      <Sheet open={cartOpen} onOpenChange={setCartOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0">
          <SheetHeader className="px-6 py-4 border-b border-neutral-200">
            <SheetTitle style={{ color: NAVY }}>Carrinho ({cartCount})</SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {cart.length === 0 && (
              <div className="text-center text-neutral-500 py-12 text-sm">
                Seu carrinho está vazio.
              </div>
            )}
            {cart.map((item, i) => (
              <div key={`${item.product.id}-${item.grade}`} className="flex gap-3 border-b border-neutral-100 pb-4">
                <div className="w-16 h-16 rounded-md bg-neutral-100 flex items-center justify-center flex-shrink-0 text-[10px] text-neutral-500 text-center px-1">
                  {item.product.line}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold truncate" style={{ color: NAVY }}>
                        {item.product.name}
                      </div>
                      <div className="text-xs text-neutral-500">
                        Grade {item.grade} · Ref {item.product.ref}
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(i)}
                      className="text-neutral-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-neutral-200 rounded-md">
                      <button
                        onClick={() => updateQty(i, -1)}
                        className="w-7 h-7 flex items-center justify-center hover:bg-neutral-50"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-sm">{item.qty}</span>
                      <button
                        onClick={() => updateQty(i, 1)}
                        className="w-7 h-7 flex items-center justify-center hover:bg-neutral-50"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="text-sm font-semibold" style={{ color: NAVY }}>
                      {formatBRL(item.qty * item.product.price)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-neutral-200 px-6 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-500">Subtotal</span>
              <span className="text-lg font-bold" style={{ color: NAVY }}>
                {formatBRL(subtotal)}
              </span>
            </div>
            <Button
              className="w-full h-11 font-semibold"
              style={{ backgroundColor: NAVY, color: "white" }}
              disabled={cart.length === 0}
            >
              Finalizar pedido
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

// ---------- Product Card ----------
function ProductCard({
  product,
  onAdd,
}: {
  product: Product;
  onAdd: (p: Product, g: GradeSize) => void;
}) {
  const [selectedGrade, setSelectedGrade] = useState<GradeSize | null>(
    product.grades[0] ?? null
  );

  return (
    <div className="group relative rounded-lg border border-neutral-200 bg-white overflow-hidden hover:shadow-lg transition-all duration-150">
      {/* Image */}
      <div className="relative aspect-square bg-white flex items-center justify-center overflow-hidden">
        <span
          className="absolute top-3 left-3 z-10 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider"
          style={{ backgroundColor: ELECTRIC, color: "white" }}
        >
          {product.line}
        </span>
        <img
          src={`https://placehold.co/400x400/F5F5F5/${NAVY.slice(1)}?text=${encodeURIComponent(product.name)}`}
          alt={product.name}
          className="w-full h-full object-contain p-6"
          loading="lazy"
        />
        {/* Hover CTA */}
        <button
          onClick={() => selectedGrade && onAdd(product, selectedGrade)}
          disabled={!selectedGrade}
          className="absolute bottom-0 left-0 right-0 h-11 font-semibold text-sm translate-y-full group-hover:translate-y-0 transition-transform duration-150 disabled:opacity-60"
          style={{ backgroundColor: ELECTRIC, color: "white" }}
        >
          Adicionar ao pedido
        </button>
      </div>

      {/* Info */}
      <div className="p-4 space-y-2">
        <div>
          <h3 className="text-sm font-semibold leading-tight" style={{ color: NAVY }}>
            {product.name}
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">Ref: {product.ref}</p>
        </div>

        <div className="flex items-baseline gap-1">
          <span className="text-base font-bold" style={{ color: NAVY }}>
            {formatBRL(product.price)}
          </span>
          <span className="text-xs text-neutral-500">— 5x</span>
        </div>

        <div className="flex flex-wrap gap-1 pt-1">
          {ALL_GRADES.map((g) => {
            const available = product.grades.includes(g);
            const active = selectedGrade === g;
            return (
              <button
                key={g}
                onClick={() => available && setSelectedGrade(g)}
                disabled={!available}
                className="px-2 py-0.5 rounded text-[11px] font-medium transition-colors duration-150"
                style={{
                  backgroundColor: active ? NAVY : "#F3F4F6",
                  color: active ? "white" : available ? "#4B5563" : "#9CA3AF",
                  textDecoration: available ? "none" : "line-through",
                  cursor: available ? "pointer" : "not-allowed",
                }}
              >
                {g}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
