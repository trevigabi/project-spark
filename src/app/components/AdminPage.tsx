import { useState } from "react";
import { Users, Package2, Tag, Settings, Shield, Plus, Edit3, Trash2, Search, ChevronDown, ChevronRight, Check } from "lucide-react";
import { clients, products, formatCurrency, formatDate } from "../data/mockData";

const tabs = [
  { id: 'catalog', label: 'Produtos', icon: Package2 },
  { id: 'pricing', label: 'Preços', icon: Tag },
  { id: 'policies', label: 'Políticas', icon: Shield },
  { id: 'settings', label: 'Configurações', icon: Settings },
];

const mockUsers = [
  { id: 'U001', name: 'Marcos Andrade', email: 'marcos@tesla.com.br', role: 'Representante', region: 'Sudeste', status: 'ativo', lastLogin: '2026-06-11' },
  { id: 'U002', name: 'Fernanda Lima', email: 'fernanda@tesla.com.br', role: 'Representante', region: 'Sul', status: 'ativo', lastLogin: '2026-06-10' },
  { id: 'U003', name: 'Carlos Mendes', email: 'carlos@tesla.com.br', role: 'Representante', region: 'Sudeste', status: 'ativo', lastLogin: '2026-06-11' },
  { id: 'U004', name: 'Ana Santos', email: 'ana@tesla.com.br', role: 'Representante', region: 'Nordeste', status: 'ativo', lastLogin: '2026-06-09' },
  { id: 'U005', name: 'Rafael Costa', email: 'rafael@tesla.com.br', role: 'Admin', region: 'Nacional', status: 'ativo', lastLogin: '2026-06-11' },
];

const pricePolicies = [
  { id: 'P001', name: 'Política Padrão', discount: '0%', minOrder: 'R$ 1.000', payment: '30 DDL', clients: 180 },
  { id: 'P002', name: 'Cliente Premium', discount: '12%', minOrder: 'R$ 2.000', payment: '30/60/90 DDL', clients: 42 },
  { id: 'P003', name: 'Distribuidor Exclusivo', discount: '20%', minOrder: 'R$ 5.000', payment: '60/90/120 DDL', clients: 8 },
  { id: 'P004', name: 'Novos Clientes', discount: '5%', minOrder: 'R$ 500', payment: '30 DDL', clients: 17 },
];

export function AdminPage() {
  const [activeTab, setActiveTab] = useState('catalog');
  const [search, setSearch] = useState('');
  const [showAddUser, setShowAddUser] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);

  return (
    <div className="p-6 max-w-[1200px] space-y-5">
      {/* Tab bar */}
      <div className="flex items-center gap-1 bg-card border border-border rounded-xl p-1 overflow-x-auto">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors flex-shrink-0 ${activeTab === tab.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'}`}
              style={{ fontSize: '0.82rem', fontWeight: activeTab === tab.id ? 600 : 400 }}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Catalog Tab */}
      {activeTab === 'catalog' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar produto por nome ou referência..."
                value={productSearch}
                onChange={e => setProductSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-card text-foreground outline-none focus:border-primary"
                style={{ fontSize: '0.82rem' }}
              />
            </div>
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors" style={{ fontSize: '0.82rem', fontWeight: 600 }}>
              <Plus className="w-3.5 h-3.5" /> Novo produto
            </button>
          </div>
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/20">
                  {['', 'Produto', 'Referência', 'Linha', 'Preço', 'Estoque', 'Disponibilidade', ''].map(col => (
                    <th key={col} className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: '0.72rem', fontWeight: 500 }}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products
                  .filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()) || p.reference.toLowerCase().includes(productSearch.toLowerCase()))
                  .map(product => {
                  const totalStock = Object.values(product.grades).reduce((a, b) => a + b, 0);
                  const availColor = {
                    'disponível': 'bg-emerald-400/10 text-emerald-400',
                    'baixo estoque': 'bg-amber-400/10 text-amber-400',
                    'esgotado': 'bg-red-400/10 text-red-400',
                  }[product.availability];
                  const expanded = expandedProduct === product.id;
                  return (
                    <>
                      <tr key={product.id} className="border-b border-border/40 hover:bg-secondary/20 transition-colors">
                        <td className="px-3 py-3">
                          <button
                            onClick={() => setExpandedProduct(expanded ? null : product.id)}
                            className="p-1 rounded text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                          >
                            <ChevronRight className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-90' : ''}`} />
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                              <img src={product.image} alt={product.name} className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                            </div>
                            <span className="text-foreground" style={{ fontSize: '0.82rem', fontWeight: 500 }}>{product.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground mono" style={{ fontSize: '0.75rem' }}>{product.reference}</td>
                        <td className="px-4 py-3 text-muted-foreground" style={{ fontSize: '0.78rem' }}>{product.line}</td>
                        <td className="px-4 py-3 text-foreground mono" style={{ fontSize: '0.82rem', fontWeight: 600 }}>{formatCurrency(product.price)}</td>
                        <td className="px-4 py-3 text-foreground mono" style={{ fontSize: '0.82rem' }}>{totalStock}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full ${availColor}`} style={{ fontSize: '0.65rem', fontWeight: 600 }}>
                            {product.availability}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors">
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                      {expanded && (
                        <tr key={`${product.id}-detail`} className="border-b border-border/40 bg-secondary/10">
                          <td colSpan={8} className="px-6 py-4">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                              <div>
                                <p className="text-muted-foreground mb-1" style={{ fontSize: '0.7rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Categoria</p>
                                <p className="text-foreground" style={{ fontSize: '0.82rem' }}>{product.category}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground mb-1" style={{ fontSize: '0.7rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Coleção</p>
                                <p className="text-foreground" style={{ fontSize: '0.82rem' }}>{product.collection}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground mb-1" style={{ fontSize: '0.7rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Avaliação</p>
                                <p className="text-foreground" style={{ fontSize: '0.82rem' }}>{product.rating} ★</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground mb-1" style={{ fontSize: '0.7rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pedidos</p>
                                <p className="text-foreground" style={{ fontSize: '0.82rem' }}>{product.orders}</p>
                              </div>
                              <div className="col-span-2 sm:col-span-4">
                                <p className="text-muted-foreground mb-1" style={{ fontSize: '0.7rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Grade de numeração</p>
                                <div className="flex gap-2 flex-wrap">
                                  {Object.entries(product.grades).map(([size, stock]) => (
                                    <span key={size} className="px-2 py-1 rounded-md bg-background border border-border" style={{ fontSize: '0.75rem' }}>
                                      <span className="text-foreground font-medium">Nº {size}</span>
                                      <span className="text-muted-foreground ml-1">({stock})</span>
                                    </span>
                                  ))}
                                </div>
                              </div>
                              {product.description && (
                                <div className="col-span-2 sm:col-span-4">
                                  <p className="text-muted-foreground mb-1" style={{ fontSize: '0.7rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Descrição</p>
                                  <p className="text-foreground" style={{ fontSize: '0.82rem' }}>{product.description}</p>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pricing Tab */}
      {activeTab === 'pricing' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground" style={{ fontSize: '0.85rem' }}>Políticas de preço ativas</p>
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors" style={{ fontSize: '0.82rem', fontWeight: 600 }}>
              <Plus className="w-3.5 h-3.5" /> Nova política
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pricePolicies.map(policy => (
              <div key={policy.id} className="bg-card border border-border rounded-xl p-5 hover:border-border/60 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-foreground" style={{ fontWeight: 600, fontSize: '0.9rem' }}>{policy.name}</h3>
                  <button className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors">
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-3">
                  {[
                    { label: 'Desconto', value: policy.discount, highlight: true },
                    { label: 'Pedido mín.', value: policy.minOrder, mono: true },
                    { label: 'Pagamento', value: policy.payment },
                  ].map(detail => (
                    <div key={detail.label}>
                      <p className="text-muted-foreground" style={{ fontSize: '0.7rem' }}>{detail.label}</p>
                      <p className={`${detail.highlight ? 'text-primary' : 'text-foreground'} ${detail.mono ? 'mono' : ''}`} style={{ fontSize: '0.85rem', fontWeight: detail.highlight ? 700 : 500 }}>
                        {detail.value}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="text-muted-foreground" style={{ fontSize: '0.72rem' }}>
                  <span className="text-foreground font-semibold">{policy.clients}</span> clientes nesta política
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Policies Tab */}
      {activeTab === 'policies' && (
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="text-foreground mb-4" style={{ fontWeight: 600 }}>Configurações de aprovação</h3>
            <div className="space-y-4">
              {[
                { label: 'Aprovação automática até', desc: 'Pedidos abaixo deste valor são aprovados automaticamente', value: 'R$ 5.000' },
                { label: 'Prazo de aprovação', desc: 'Tempo máximo para aprovação manual de pedidos', value: '48 horas' },
                { label: 'Desconto máximo por rep', desc: 'Desconto máximo que um representante pode conceder', value: '15%' },
              ].map(setting => (
                <div key={setting.label} className="flex items-center justify-between p-4 rounded-lg border border-border/60 bg-secondary/20">
                  <div>
                    <p className="text-foreground" style={{ fontSize: '0.85rem', fontWeight: 500 }}>{setting.label}</p>
                    <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>{setting.desc}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-primary mono" style={{ fontWeight: 700 }}>{setting.value}</span>
                    <button className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors">
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-4">
          {/* Usuários */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-4 gap-3">
              <h3 className="text-foreground" style={{ fontWeight: 600 }}>Usuários</h3>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Buscar usuário..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="pl-9 pr-3 py-1.5 rounded-lg border border-border bg-surface text-foreground outline-none focus:border-primary"
                    style={{ fontSize: '0.82rem' }}
                  />
                </div>
                <button
                  onClick={() => setShowAddUser(!showAddUser)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  style={{ fontSize: '0.82rem', fontWeight: 600 }}
                >
                  <Plus className="w-3.5 h-3.5" /> Novo usuário
                </button>
              </div>
            </div>
            {showAddUser && (
              <div className="bg-secondary/20 border border-primary/30 rounded-xl p-4 mb-4 space-y-3">
                <h4 className="text-foreground" style={{ fontWeight: 600, fontSize: '0.88rem' }}>Adicionar usuário</h4>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Nome completo', placeholder: 'Nome do usuário' },
                    { label: 'E-mail', placeholder: 'email@tesla.com.br' },
                  ].map(field => (
                    <div key={field.label}>
                      <label className="block text-muted-foreground mb-1" style={{ fontSize: '0.75rem' }}>{field.label}</label>
                      <input type="text" placeholder={field.placeholder} className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-foreground placeholder-muted-foreground outline-none focus:border-primary" style={{ fontSize: '0.82rem' }} />
                    </div>
                  ))}
                  <div>
                    <label className="block text-muted-foreground mb-1" style={{ fontSize: '0.75rem' }}>Perfil</label>
                    <select className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-foreground outline-none focus:border-primary" style={{ fontSize: '0.82rem' }}>
                      <option>Representante</option><option>Lojista</option><option>Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-muted-foreground mb-1" style={{ fontSize: '0.75rem' }}>Região</label>
                    <select className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-foreground outline-none focus:border-primary" style={{ fontSize: '0.82rem' }}>
                      <option>Sudeste</option><option>Sul</option><option>Nordeste</option><option>Centro-Oeste</option><option>Norte</option><option>Nacional</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <button onClick={() => setShowAddUser(false)} className="px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors" style={{ fontSize: '0.82rem' }}>Cancelar</button>
                  <button onClick={() => setShowAddUser(false)} className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors" style={{ fontSize: '0.82rem', fontWeight: 600 }}>Criar usuário</button>
                </div>
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary/20">
                    {['Nome', 'E-mail', 'Perfil', 'Região', 'Status', 'Último acesso', ''].map(col => (
                      <th key={col} className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: '0.72rem', fontWeight: 500 }}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {mockUsers.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())).map(user => (
                    <tr key={user.id} className="border-b border-border/40 hover:bg-secondary/20 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                            <span className="text-primary" style={{ fontSize: '0.62rem', fontWeight: 700 }}>{user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</span>
                          </div>
                          <span className="text-foreground" style={{ fontSize: '0.82rem', fontWeight: 500 }}>{user.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground" style={{ fontSize: '0.78rem' }}>{user.email}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full ${user.role === 'Admin' ? 'bg-purple-400/10 text-purple-400' : 'bg-blue-400/10 text-blue-400'}`} style={{ fontSize: '0.65rem', fontWeight: 600 }}>{user.role}</span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground" style={{ fontSize: '0.78rem' }}>{user.region}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-400/10 text-emerald-400" style={{ fontSize: '0.65rem', fontWeight: 600 }}>{user.status}</span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground mono" style={{ fontSize: '0.75rem' }}>{formatDate(user.lastLogin)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"><Edit3 className="w-3.5 h-3.5" /></button>
                          <button className="p-1.5 rounded text-muted-foreground hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="text-foreground mb-4" style={{ fontWeight: 600 }}>Informações da empresa</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Nome da empresa', value: 'Tesla Footwear Indústria LTDA' },
                { label: 'CNPJ', value: '12.345.678/0001-90' },
                { label: 'Website', value: 'teslafootwear.com.br' },
                { label: 'Suporte', value: 'suporte@tesla.com.br' },
              ].map(field => (
                <div key={field.label}>
                  <label className="block text-muted-foreground mb-1" style={{ fontSize: '0.75rem' }}>{field.label}</label>
                  <input
                    type="text"
                    defaultValue={field.value}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-foreground outline-none focus:border-primary"
                    style={{ fontSize: '0.85rem' }}
                  />
                </div>
              ))}
            </div>
            <button className="mt-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors" style={{ fontSize: '0.82rem', fontWeight: 600 }}>
              Salvar alterações
            </button>
          </div>

          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="text-foreground mb-4" style={{ fontWeight: 600 }}>Permissões por perfil</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left pb-3 text-muted-foreground" style={{ fontSize: '0.72rem', fontWeight: 500 }}>Funcionalidade</th>
                    {['Admin', 'Representante', 'Lojista'].map(p => (
                      <th key={p} className="text-center pb-3 text-muted-foreground" style={{ fontSize: '0.72rem', fontWeight: 500 }}>{p}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: 'Catálogo (visualizar)', admin: true, rep: true, lojista: true },
                    { feature: 'Catálogo (editar)', admin: true, rep: false, lojista: false },
                    { feature: 'Pedidos (criar)', admin: true, rep: true, lojista: true },
                    { feature: 'Pedidos (aprovar)', admin: true, rep: false, lojista: false },
                    { feature: 'Marketing IA', admin: true, rep: true, lojista: false },
                    { feature: 'Sell-out Dashboard', admin: true, rep: true, lojista: false },
                    { feature: 'Gestão de usuários', admin: true, rep: false, lojista: false },
                    { feature: 'Políticas comerciais', admin: true, rep: false, lojista: false },
                  ].map(row => (
                    <tr key={row.feature} className="border-b border-border/40">
                      <td className="py-2.5 text-foreground" style={{ fontSize: '0.82rem' }}>{row.feature}</td>
                      {(['admin', 'rep', 'lojista'] as const).map(role => (
                        <td key={role} className="py-2.5 text-center">
                          {row[role] ? (
                            <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                          ) : (
                            <div className="w-4 h-px bg-border mx-auto" />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
