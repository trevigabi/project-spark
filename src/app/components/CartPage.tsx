import { useState, useMemo } from "react";
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, FileText, Check, ChevronRight, Tag, Sparkles, Percent, Store, ChevronLeft, FolderPlus, List } from "lucide-react";
import { products, formatCurrency, commercialPolicies } from "../data/mockData";
import type { CartContext } from "./CartsListPage";


type View = 'dashboard' | 'catalog' | 'order-grade' | 'cart' | 'carts' | 'history' | 'marketing' | 'sellout' | 'admin' | 'clients';

interface CartPageProps {
  onNavigate: (view: View) => void;
  cartContext?: CartContext | null;
  multiCart?: boolean;
  onCreateNewCart?: (name: string) => void;
}

interface CartItem {
  product: typeof products[0];
  sizes: Record<string, number>;
}

const initialCart: CartItem[] = [
  {
    product: products[0],
    sizes: { '39': 4, '40': 6, '41': 4, '42': 2 },
  },
  {
    product: products[3],
    sizes: { '40': 8, '41': 6, '42': 4 },
  },
  {
    product: products[4],
    sizes: { '39': 2, '40': 4, '41': 4 },
  },
];

// Condições de pagamento disponíveis por tabela de preço
const paymentOptionsByTable: Record<string, { id: string; label: string; surcharge: number; description?: string }[]> = {
  'TAB-A': [
    { id: 'avista', label: 'À vista (PIX/Boleto)', surcharge: -3, description: '3% de desconto adicional' },
    { id: '30',    label: '30 DDL',               surcharge: 0 },
    { id: '30-60', label: '30/60 DDL',            surcharge: 0 },
    { id: '5x',    label: '5x sem juros',         surcharge: 0, description: 'Condição padrão da Tabela A' },
  ],
  'TAB-B': [
    { id: 'avista', label: 'À vista (PIX/Boleto)', surcharge: -2 },
    { id: '30-60', label: '30/60 DDL',            surcharge: 0 },
    { id: '5x',    label: '5x sem juros',         surcharge: 0, description: 'Condição padrão da Tabela B' },
  ],
  'TAB-C': [
    { id: 'avista', label: 'À vista (PIX/Boleto)', surcharge: -2 },
    { id: '30',    label: '30 DDL',               surcharge: 0 },
    { id: '3x',    label: '3x sem juros',         surcharge: 0, description: 'Condição padrão da Tabela C' },
  ],
};

// Campanhas ativas por tabela de preço
const campaignsByTable: Record<string, { id: string; name: string; description: string; discount: number }[]> = {
  'TAB-A': [
    { id: 'mid-year', name: 'Mid Year Boost', description: 'Coleção 2026 · 5% extra em pedidos acima de R$ 5.000', discount: 5 },
  ],
  'TAB-B': [
    { id: 'fidelidade', name: 'Fidelidade Tesla', description: 'Clientes recorrentes · 4% adicional', discount: 4 },
  ],
  'TAB-C': [
    { id: 'parceiro', name: 'Parceiro Regional', description: '3% de desconto em coleção atual', discount: 3 },
  ],
};

export function CartPage({ onNavigate, cartContext, multiCart, onCreateNewCart }: CartPageProps) {
  const [cart, setCart] = useState<CartItem[]>(initialCart);
  const [tableId, setTableId] = useState<string>('TAB-A');
  const policy = useMemo(() => commercialPolicies.find(p => p.id === tableId)!, [tableId]);
  const paymentOptions = paymentOptionsByTable[tableId] ?? [];
  const campaigns = campaignsByTable[tableId] ?? [];
  const [paymentId, setPaymentId] = useState<string>(paymentOptions[0]?.id ?? '');
  const [campaignIds, setCampaignIds] = useState<string[]>([]);
  const [obs, setObs] = useState('');
  const [step, setStep] = useState<'cart' | 'checkout' | 'done'>('cart');
  const [approvalRequired] = useState(true);

  const selectedPayment = paymentOptions.find(p => p.id === paymentId) ?? paymentOptions[0];

  const updateQty = (productId: string, size: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id !== productId) return item;
      const newSizes = { ...item.sizes, [size]: Math.max(0, (item.sizes[size] || 0) + delta) };
      if (newSizes[size] === 0) delete newSizes[size];
      return { ...item, sizes: newSizes };
    }).filter(item => Object.keys(item.sizes).length > 0));
  };

  const removeItem = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const getItemTotal = (item: CartItem) => {
    const pairs = Object.values(item.sizes).reduce((a, b) => a + b, 0);
    return { pairs, value: pairs * item.product.price };
  };

  const grandTotal = cart.reduce((acc, item) => acc + getItemTotal(item).value, 0);
  const grandPairs = cart.reduce((acc, item) => acc + getItemTotal(item).pairs, 0);

  const tableDiscount = (grandTotal * policy.discount) / 100;
  const paymentAdj = (grandTotal * (selectedPayment?.surcharge ?? 0)) / 100;
  const campaignDiscount = campaigns
    .filter(c => campaignIds.includes(c.id))
    .reduce((acc, c) => acc + (grandTotal * c.discount) / 100, 0);
  const discount = tableDiscount + campaignDiscount + Math.max(0, -paymentAdj);
  const finalTotal = grandTotal - tableDiscount - campaignDiscount + paymentAdj;
  const belowMin = finalTotal < policy.minOrderValue;



  if (step === 'done') {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-emerald-400/20 flex items-center justify-center mx-auto mb-5">
            <Check className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-foreground" style={{ fontWeight: 700, fontSize: '1.3rem' }}>Pedido enviado para aprovação!</h2>
          <p className="text-muted-foreground mt-2" style={{ fontSize: '0.85rem' }}>
            Pedido <span className="text-foreground font-semibold mono">PED-2026-0413</span>
          </p>
          <p className="text-muted-foreground mt-1" style={{ fontSize: '0.82rem' }}>
            {grandPairs} pares · {formatCurrency(finalTotal)}
          </p>
          <p className="text-muted-foreground mt-3 text-sm">Você receberá uma confirmação por e-mail assim que aprovado.</p>
          <div className="flex gap-3 mt-6 justify-center">
            <button onClick={() => onNavigate('history')} className="px-4 py-2 rounded-lg border border-border text-foreground hover:bg-secondary/60 transition-colors" style={{ fontSize: '0.85rem', fontWeight: 500 }}>
              Ver histórico
            </button>
            <button onClick={() => onNavigate('catalog')} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
              Continuar comprando
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1200px] mx-auto w-full">
      {cartContext && (
        <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => onNavigate('carts')}
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
              style={{ fontSize: '0.78rem' }}
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Carrinhos
            </button>
            <div className="w-px h-5 bg-border" />
            <div className="min-w-0">
              <p className="text-foreground truncate" style={{ fontSize: '1rem', fontWeight: 700 }}>{cartContext.cartName}</p>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Store className="w-3 h-3" />
                <span className="truncate" style={{ fontSize: '0.75rem' }}>Cliente: <span className="text-foreground" style={{ fontWeight: 600 }}>{cartContext.clientName}</span></span>
              </div>
            </div>
          </div>
          {multiCart && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('carts')}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
                style={{ fontSize: '0.75rem', fontWeight: 500 }}
                title="Selecionar outro carrinho"
              >
                <List className="w-3.5 h-3.5" /> Outros carrinhos
              </button>
              <button
                onClick={() => {
                  const name = window.prompt(`Nome do novo carrinho para ${cartContext.clientName}:`, '');
                  if (name === null) return;
                  onCreateNewCart?.(name || 'Novo carrinho');
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                style={{ fontSize: '0.75rem', fontWeight: 600 }}
                title="Criar outro carrinho para este cliente"
              >
                <FolderPlus className="w-3.5 h-3.5" /> Novo carrinho
              </button>
            </div>
          )}
        </div>
      )}
      {/* Step indicator */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => setStep('cart')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${step === 'cart' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          style={{ fontSize: '0.82rem', fontWeight: 600 }}
        >
          <ShoppingCart className="w-3.5 h-3.5" /> Carrinho ({cart.length})
        </button>
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
        <button
          onClick={() => cart.length > 0 && setStep('checkout')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${step === 'checkout' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          style={{ fontSize: '0.82rem', fontWeight: 600 }}
        >
          <CreditCard className="w-3.5 h-3.5" /> Checkout
        </button>
      </div>

      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <ShoppingCart className="w-12 h-12 text-muted-foreground/30 mb-4" />
          <p className="text-foreground" style={{ fontWeight: 600 }}>Carrinho vazio</p>
          <p className="text-muted-foreground mt-1" style={{ fontSize: '0.85rem' }}>Adicione produtos do catálogo para criar um pedido.</p>
          <button
            onClick={() => onNavigate('catalog')}
            className="mt-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            style={{ fontSize: '0.85rem', fontWeight: 600 }}
          >
            Ir ao catálogo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Items */}
          <div className="lg:col-span-2 space-y-3">
            {step === 'cart' ? (
              cart.map(item => {
                const { pairs, value } = getItemTotal(item);
                return (
                  <div key={item.product.id} className="bg-card border border-border rounded-xl p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                        <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-foreground" style={{ fontSize: '0.88rem', fontWeight: 600 }}>{item.product.name}</p>
                        <p className="text-muted-foreground" style={{ fontSize: '0.72rem' }}>{item.product.reference} · {formatCurrency(item.product.price)}/par</p>
                        <p className="text-foreground mono mt-0.5" style={{ fontSize: '0.85rem', fontWeight: 700 }}>{formatCurrency(value)}</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="text-muted-foreground hover:text-red-400 transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(item.sizes).map(([size, qty]) => (
                        <div key={size} className="flex items-center gap-1.5 rounded-lg border border-border px-2 py-1 bg-secondary/40">
                          <span className="text-muted-foreground" style={{ fontSize: '0.7rem' }}>Nº {size}</span>
                          <button onClick={() => updateQty(item.product.id, size, -1)} className="w-5 h-5 flex items-center justify-center text-muted-foreground hover:text-foreground">
                            <Minus className="w-2.5 h-2.5" />
                          </button>
                          <span className="text-foreground mono" style={{ fontSize: '0.78rem', fontWeight: 600, minWidth: 16, textAlign: 'center' }}>{qty}</span>
                          <button onClick={() => updateQty(item.product.id, size, 1)} className="w-5 h-5 flex items-center justify-center text-muted-foreground hover:text-foreground">
                            <Plus className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <p className="text-muted-foreground mt-2" style={{ fontSize: '0.72rem' }}>{pairs} pares neste item</p>
                  </div>
                );
              })
            ) : (
              /* Checkout — Tabela, Condição, Campanhas */
              <div className="space-y-4">
                {/* Tabela de preço aplicada */}
                <div className="bg-card border border-border rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-foreground flex items-center gap-2" style={{ fontWeight: 600 }}>
                      <Tag className="w-4 h-4 text-primary" /> Política comercial aplicada
                    </h3>
                    <select
                      value={tableId}
                      onChange={e => { setTableId(e.target.value); setPaymentId((paymentOptionsByTable[e.target.value] ?? [])[0]?.id ?? ''); setCampaignIds([]); }}
                      className="px-2.5 py-1.5 rounded-md border border-border bg-surface text-foreground outline-none focus:border-primary"
                      style={{ fontSize: '0.78rem' }}
                    >
                      {commercialPolicies.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <p className="text-muted-foreground" style={{ fontSize: '0.7rem' }}>Desconto da tabela</p>
                      <p className="text-foreground mono mt-0.5" style={{ fontSize: '0.9rem', fontWeight: 600 }}>{policy.discount === 0 ? 'sem desconto' : `${policy.discount}%`}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground" style={{ fontSize: '0.7rem' }}>Pagamento padrão</p>
                      <p className="text-foreground mt-0.5" style={{ fontSize: '0.85rem', fontWeight: 600 }}>{policy.paymentCondition}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground" style={{ fontSize: '0.7rem' }}>Pedido mínimo</p>
                      <p className="text-foreground mono mt-0.5" style={{ fontSize: '0.85rem', fontWeight: 600 }}>{formatCurrency(policy.minOrderValue)}</p>
                    </div>
                  </div>
                </div>

                {/* Condições de pagamento disponíveis */}
                <div className="bg-card border border-border rounded-xl p-5">
                  <h3 className="text-foreground flex items-center gap-2 mb-3" style={{ fontWeight: 600 }}>
                    <CreditCard className="w-4 h-4 text-primary" /> Condições de pagamento disponíveis
                  </h3>
                  <p className="text-muted-foreground mb-3" style={{ fontSize: '0.75rem' }}>
                    Opções habilitadas para a <span className="text-foreground" style={{ fontWeight: 600 }}>{policy.name}</span>.
                  </p>
                  <div className="space-y-2">
                    {paymentOptions.map(opt => {
                      const active = paymentId === opt.id;
                      return (
                        <label
                          key={opt.id}
                          className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${active ? 'border-primary bg-primary/5' : 'border-border hover:bg-secondary/40'}`}
                        >
                          <input type="radio" name="payment" checked={active} onChange={() => setPaymentId(opt.id)} className="mt-1 accent-primary" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-foreground" style={{ fontSize: '0.85rem', fontWeight: 600 }}>{opt.label}</p>
                              {opt.surcharge !== 0 && (
                                <span className={`mono ${opt.surcharge < 0 ? 'text-emerald-400' : 'text-amber-400'}`} style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                                  {opt.surcharge < 0 ? `${opt.surcharge}%` : `+${opt.surcharge}%`}
                                </span>
                              )}
                            </div>
                            {opt.description && <p className="text-muted-foreground mt-0.5" style={{ fontSize: '0.72rem' }}>{opt.description}</p>}
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Campanhas disponíveis */}
                {campaigns.length > 0 && (
                  <div className="bg-card border border-border rounded-xl p-5">
                    <h3 className="text-foreground flex items-center gap-2 mb-3" style={{ fontWeight: 600 }}>
                      <Sparkles className="w-4 h-4 text-primary" /> Campanhas disponíveis
                    </h3>
                    <div className="space-y-2">
                      {campaigns.map(c => {
                        const active = campaignIds.includes(c.id);
                        return (
                          <label
                            key={c.id}
                            className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${active ? 'border-emerald-400/60 bg-emerald-400/5' : 'border-border hover:bg-secondary/40'}`}
                          >
                            <input
                              type="checkbox"
                              checked={active}
                              onChange={() => setCampaignIds(prev => prev.includes(c.id) ? prev.filter(x => x !== c.id) : [...prev, c.id])}
                              className="mt-1 accent-emerald-400"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p className="text-foreground flex items-center gap-1.5" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                                  <Percent className="w-3 h-3 text-emerald-400" /> {c.name}
                                </p>
                                <span className="text-emerald-400 mono" style={{ fontSize: '0.75rem', fontWeight: 600 }}>-{c.discount}%</span>
                              </div>
                              <p className="text-muted-foreground mt-0.5" style={{ fontSize: '0.72rem' }}>{c.description}</p>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Observações */}
                <div className="bg-card border border-border rounded-xl p-5">
                  <label className="block text-muted-foreground mb-1.5" style={{ fontSize: '0.78rem' }}>Observações</label>
                  <textarea
                    value={obs}
                    onChange={e => setObs(e.target.value)}
                    rows={3}
                    placeholder="Informações adicionais..."
                    className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-foreground placeholder-muted-foreground outline-none focus:border-primary resize-none"
                    style={{ fontSize: '0.85rem' }}
                  />
                </div>

                {approvalRequired && (
                  <div className="flex items-start gap-2 rounded-lg bg-amber-400/5 border border-amber-400/20 p-3">
                    <FileText className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-amber-400" style={{ fontSize: '0.8rem', fontWeight: 600 }}>Aprovação necessária</p>
                      <p className="text-muted-foreground mt-0.5" style={{ fontSize: '0.75rem' }}>Este pedido passará pela aprovação do representante antes de ser faturado.</p>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Summary */}
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="text-foreground mb-4" style={{ fontWeight: 600, fontSize: '0.9rem' }}>Resumo do pedido</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground" style={{ fontSize: '0.82rem' }}>{grandPairs} pares</span>
                  <span className="text-foreground mono" style={{ fontSize: '0.82rem' }}>{formatCurrency(grandTotal)}</span>
                </div>
                {tableDiscount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-emerald-400" style={{ fontSize: '0.82rem' }}>Desconto {policy.name} ({policy.discount}%)</span>
                    <span className="text-emerald-400 mono" style={{ fontSize: '0.82rem' }}>-{formatCurrency(tableDiscount)}</span>
                  </div>
                )}
                {campaignDiscount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-emerald-400" style={{ fontSize: '0.82rem' }}>Campanhas</span>
                    <span className="text-emerald-400 mono" style={{ fontSize: '0.82rem' }}>-{formatCurrency(campaignDiscount)}</span>
                  </div>
                )}
                {paymentAdj !== 0 && (
                  <div className="flex justify-between">
                    <span className={paymentAdj < 0 ? 'text-emerald-400' : 'text-amber-400'} style={{ fontSize: '0.82rem' }}>
                      Ajuste pagamento
                    </span>
                    <span className={`mono ${paymentAdj < 0 ? 'text-emerald-400' : 'text-amber-400'}`} style={{ fontSize: '0.82rem' }}>
                      {paymentAdj < 0 ? '-' : '+'}{formatCurrency(Math.abs(paymentAdj))}
                    </span>
                  </div>
                )}
                <div className="h-px bg-border my-2" />
                <div className="flex justify-between">
                  <span className="text-foreground" style={{ fontSize: '0.9rem', fontWeight: 600 }}>Total</span>
                  <span className="text-foreground mono" style={{ fontSize: '1rem', fontWeight: 700 }}>{formatCurrency(finalTotal)}</span>
                </div>
                {step === 'checkout' && selectedPayment && (
                  <div className="text-muted-foreground text-center pt-1" style={{ fontSize: '0.72rem' }}>
                    Condição: {selectedPayment.label}
                  </div>
                )}
                {belowMin && step === 'checkout' && (
                  <div className="mt-2 rounded-md bg-amber-400/10 border border-amber-400/30 px-2.5 py-2 text-amber-400" style={{ fontSize: '0.72rem' }}>
                    Pedido mínimo da {policy.name}: {formatCurrency(policy.minOrderValue)}
                  </div>
                )}
              </div>
            </div>


            {step === 'cart' ? (
              <button
                onClick={() => setStep('checkout')}
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                style={{ fontWeight: 600, fontSize: '0.9rem' }}
              >
                Ir para checkout <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setStep('done')}
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                style={{ fontWeight: 600, fontSize: '0.9rem' }}
              >
                <Check className="w-4 h-4" /> Confirmar pedido
              </button>
            )}

            <button
              onClick={() => onNavigate('catalog')}
              className="w-full py-2 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
              style={{ fontSize: '0.85rem' }}
            >
              Continuar comprando
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
