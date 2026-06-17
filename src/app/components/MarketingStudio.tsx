import { useState } from "react";
import { Sparkles, Check, ChevronRight, ChevronLeft, Download, Share2, Instagram, MessageCircle, Printer, Wand2, Image, Palette, Target, Zap, RefreshCw } from "lucide-react";
import { products, formatCurrency } from "../data/mockData";

const OBJECTIVES = [
  { id: 'lancamento', label: 'Lançamento de coleção', icon: '🚀', description: 'Apresente novidades com destaque' },
  { id: 'promocao', label: 'Promoção / Liquidação', icon: '🏷️', description: 'Ofertas e descontos especiais' },
  { id: 'reposicao', label: 'Reposição rápida', icon: '⚡', description: 'Destaque produtos disponíveis' },
  { id: 'institucional', label: 'Institucional de marca', icon: '🏆', description: 'Fortalecimento de brand' },
];

const THEMES = [
  { id: 'premium', label: 'Premium Dark', colors: ['#0A0A0F', '#1a1a2e', '#4F6EF7'], preview: 'dark' },
  { id: 'clean', label: 'Clean Minimal', colors: ['#FAFAFA', '#F0F0F0', '#1a1a1a'], preview: 'light' },
  { id: 'bold', label: 'Bold Impact', colors: ['#1a0533', '#6B21A8', '#F59E0B'], preview: 'dark' },
  { id: 'nature', label: 'Natural & Warm', colors: ['#1C1208', '#A16207', '#FEF3C7'], preview: 'dark' },
];

const AI_PROMPTS = [
  'Nova coleção Inverno 2026 com exclusividade e sofisticação para distribuidores selecionados.',
  'Qualidade premium para calçados que combinam conforto e estilo nas estações frias.',
  'Descubra a nova linha Tesla Footwear — onde tradição encontra inovação.',
];

export function MarketingStudio() {
  const [step, setStep] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set([products[0].id, products[4].id]));
  const [objective, setObjective] = useState('lancamento');
  const [theme, setTheme] = useState('premium');
  const [prompt, setPrompt] = useState(AI_PROMPTS[0]);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [promptSuggIdx, setPromptSuggIdx] = useState(0);

  const selectedList = products.filter(p => selectedProducts.has(p.id));
  const selectedTheme = THEMES.find(t => t.id === theme)!;
  const selectedObj = OBJECTIVES.find(o => o.id === objective)!;

  const toggleProduct = (id: string) => {
    setSelectedProducts(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); }
      else if (next.size < 4) { next.add(id); }
      return next;
    });
  };

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
      setStep(5);
    }, 2200);
  };

  const steps = [
    { n: 1, label: 'Produtos' },
    { n: 2, label: 'Objetivo' },
    { n: 3, label: 'Tema' },
    { n: 4, label: 'Texto IA' },
    { n: 5, label: 'Preview' },
  ];

  return (
    <div className="p-6 max-w-[900px] mx-auto w-full space-y-5">
      {/* Header */}
      <div className="rounded-xl bg-gradient-to-r from-purple-500/10 via-primary/5 to-transparent border border-purple-500/20 p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h2 className="text-foreground" style={{ fontWeight: 700, fontSize: '1rem' }}>Estúdio de Marketing com IA</h2>
            <p className="text-muted-foreground" style={{ fontSize: '0.8rem' }}>Crie campanhas profissionais em menos de 2 minutos</p>
          </div>
        </div>
      </div>

      {/* Stepper */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center justify-between">
          {steps.map((s, i) => (
            <div key={s.n} className="flex items-center flex-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => s.n <= step && setStep(s.n)}
                  className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${step > s.n ? 'bg-primary text-primary-foreground' : step === s.n ? 'bg-primary text-primary-foreground ring-2 ring-primary/30 ring-offset-2 ring-offset-card' : 'bg-secondary text-muted-foreground'}`}
                  style={{ fontSize: '0.72rem', fontWeight: 700 }}
                >
                  {step > s.n ? <Check className="w-3.5 h-3.5" /> : s.n}
                </button>
                <span className={`hidden sm:block ${step >= s.n ? 'text-foreground' : 'text-muted-foreground'}`} style={{ fontSize: '0.78rem', fontWeight: step === s.n ? 600 : 400 }}>
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && <div className={`flex-1 h-px mx-3 ${step > s.n ? 'bg-primary' : 'bg-border'}`} />}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-card border border-border rounded-xl p-5">
        {/* Step 1: Products */}
        {step === 1 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-foreground" style={{ fontWeight: 600 }}>Selecionar produtos</h3>
                <p className="text-muted-foreground" style={{ fontSize: '0.78rem' }}>Escolha até 4 produtos para a campanha</p>
              </div>
              <span className="text-muted-foreground" style={{ fontSize: '0.78rem' }}>{selectedProducts.size}/4 selecionados</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {products.map(p => {
                const isSelected = selectedProducts.has(p.id);
                return (
                  <button
                    key={p.id}
                    onClick={() => toggleProduct(p.id)}
                    className={`rounded-xl border p-3 text-left transition-all ${isSelected ? 'border-primary bg-primary/10' : 'border-border hover:border-border/60 bg-secondary/20'}`}
                  >
                    <div className="relative h-24 rounded-lg overflow-hidden bg-secondary mb-2">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      {isSelected && (
                        <div className="absolute inset-0 bg-primary/30 flex items-center justify-center">
                          <Check className="w-6 h-6 text-white" />
                        </div>
                      )}
                    </div>
                    <p className="text-foreground truncate" style={{ fontSize: '0.75rem', fontWeight: 500 }}>{p.name}</p>
                    <p className="text-primary mono" style={{ fontSize: '0.72rem', fontWeight: 600 }}>{formatCurrency(p.price)}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Objective */}
        {step === 2 && (
          <div>
            <h3 className="text-foreground mb-1" style={{ fontWeight: 600 }}>Objetivo da campanha</h3>
            <p className="text-muted-foreground mb-4" style={{ fontSize: '0.78rem' }}>Qual é o propósito desta peça?</p>
            <div className="grid grid-cols-2 gap-3">
              {OBJECTIVES.map(obj => (
                <button
                  key={obj.id}
                  onClick={() => setObjective(obj.id)}
                  className={`rounded-xl border p-4 text-left transition-all ${objective === obj.id ? 'border-primary bg-primary/10' : 'border-border hover:border-border/60'}`}
                >
                  <span style={{ fontSize: '1.5rem' }}>{obj.icon}</span>
                  <p className="text-foreground mt-2" style={{ fontWeight: 600, fontSize: '0.85rem' }}>{obj.label}</p>
                  <p className="text-muted-foreground" style={{ fontSize: '0.72rem' }}>{obj.description}</p>
                  {objective === obj.id && <Check className="w-4 h-4 text-primary mt-2" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Theme */}
        {step === 3 && (
          <div>
            <h3 className="text-foreground mb-1" style={{ fontWeight: 600 }}>Tema visual</h3>
            <p className="text-muted-foreground mb-4" style={{ fontSize: '0.78rem' }}>Escolha a identidade visual da peça</p>
            <div className="grid grid-cols-2 gap-3">
              {THEMES.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`rounded-xl border overflow-hidden transition-all ${theme === t.id ? 'border-primary ring-1 ring-primary' : 'border-border hover:border-border/60'}`}
                >
                  <div
                    className="h-20 flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${t.colors[0]} 0%, ${t.colors[1]} 100%)` }}
                  >
                    <div className="flex gap-1.5">
                      {t.colors.map((c, i) => (
                        <div key={i} className="w-5 h-5 rounded-full border-2 border-white/20" style={{ background: c }} />
                      ))}
                    </div>
                  </div>
                  <div className="p-3 bg-secondary/20 flex items-center justify-between">
                    <span className="text-foreground" style={{ fontSize: '0.8rem', fontWeight: 500 }}>{t.label}</span>
                    {theme === t.id && <Check className="w-3.5 h-3.5 text-primary" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Prompt */}
        {step === 4 && (
          <div>
            <h3 className="text-foreground mb-1" style={{ fontWeight: 600 }}>Texto assistido por IA</h3>
            <p className="text-muted-foreground mb-4" style={{ fontSize: '0.78rem' }}>Descreva o tom da campanha ou use uma sugestão</p>
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-foreground placeholder-muted-foreground outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 resize-none mb-3"
              style={{ fontSize: '0.88rem', lineHeight: 1.6 }}
            />
            <div className="mb-4">
              <p className="text-muted-foreground mb-2" style={{ fontSize: '0.75rem', fontWeight: 500 }}>Sugestões da IA:</p>
              <div className="space-y-2">
                {AI_PROMPTS.map((sugg, i) => (
                  <button
                    key={i}
                    onClick={() => setPrompt(sugg)}
                    className={`w-full text-left rounded-lg border p-3 transition-colors ${prompt === sugg ? 'border-purple-400/50 bg-purple-400/5 text-foreground' : 'border-border text-muted-foreground hover:text-foreground hover:border-border/60'}`}
                    style={{ fontSize: '0.78rem', lineHeight: 1.5 }}
                  >
                    {sugg}
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-lg bg-secondary/40 p-3 text-muted-foreground" style={{ fontSize: '0.75rem' }}>
              <Wand2 className="inline w-3.5 h-3.5 mr-1.5 text-purple-400" />
              A IA irá gerar textos, adaptar o layout e compor a lâmina automaticamente usando os produtos selecionados.
            </div>
          </div>
        )}

        {/* Step 5: Preview */}
        {step === 5 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-foreground" style={{ fontWeight: 600 }}>Preview da campanha</h3>
              <button
                onClick={() => { setGenerated(false); setStep(4); }}
                className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                style={{ fontSize: '0.78rem' }}
              >
                <RefreshCw className="w-3.5 h-3.5" /> Regenerar
              </button>
            </div>

            {/* Generated "lâmina" mockup */}
            <div className="rounded-2xl overflow-hidden border border-border mb-5" style={{ background: selectedTheme.colors[0] }}>
              <div
                className="relative min-h-[360px] p-8 flex flex-col"
                style={{
                  background: `linear-gradient(135deg, ${selectedTheme.colors[0]} 0%, ${selectedTheme.colors[1]} 100%)`,
                }}
              >
                {/* Brand */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p style={{ color: selectedTheme.colors[2], fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Tesla Footwear</p>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.65rem', letterSpacing: '0.08em' }}>Coleção {selectedObj.label}</p>
                  </div>
                  <div className="px-2.5 py-1 rounded-full" style={{ background: selectedTheme.colors[2] + '20', border: `1px solid ${selectedTheme.colors[2]}40` }}>
                    <span style={{ color: selectedTheme.colors[2], fontSize: '0.65rem', fontWeight: 700 }}>{selectedObj.icon} {selectedObj.label}</span>
                  </div>
                </div>

                {/* Headline */}
                <div className="flex-1 flex flex-col justify-center">
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', fontWeight: 500, marginBottom: 8 }}>INVERNO 2026</p>
                  <h2 style={{ color: 'white', fontSize: 'clamp(1.2rem, 3vw, 1.8rem)', fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: 12 }}>
                    {prompt.split(' ').slice(0, 8).join(' ')}
                  </h2>
                  <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.82rem', lineHeight: 1.6, maxWidth: '60%' }}>
                    {prompt}
                  </p>
                </div>

                {/* Products row */}
                <div className="flex gap-3 mt-6">
                  {selectedList.slice(0, 3).map(p => (
                    <div key={p.id} className="flex-1 min-w-0">
                      <div className="rounded-xl overflow-hidden mb-2" style={{ height: 90, background: 'rgba(255,255,255,0.1)' }}>
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover opacity-80" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      </div>
                      <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.68rem', fontWeight: 600, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{p.name}</p>
                      <p style={{ color: selectedTheme.colors[2], fontSize: '0.72rem', fontWeight: 700, fontFamily: 'monospace' }}>{formatCurrency(p.price)}</p>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-5 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.62rem' }}>tesla.com.br · (11) 9999-0000</p>
                  <div style={{ width: 60, height: 4, borderRadius: 2, background: selectedTheme.colors[2] + '60' }} />
                </div>
              </div>
            </div>

            {/* Export options */}
            <div>
              <p className="text-muted-foreground mb-3" style={{ fontSize: '0.78rem', fontWeight: 500 }}>Exportar para:</p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: MessageCircle, label: 'WhatsApp', sub: '1080 × 1080' },
                  { icon: Instagram, label: 'Instagram', sub: 'Story + Feed' },
                  { icon: Printer, label: 'Impressão', sub: 'A4 / PDF' },
                ].map(exp => {
                  const Icon = exp.icon;
                  return (
                    <button key={exp.label} className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 transition-colors">
                      <Icon className="w-5 h-5 text-muted-foreground" />
                      <div className="text-center">
                        <p className="text-foreground" style={{ fontSize: '0.8rem', fontWeight: 600 }}>{exp.label}</p>
                        <p className="text-muted-foreground" style={{ fontSize: '0.68rem' }}>{exp.sub}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setStep(s => Math.max(1, s - 1))}
          disabled={step === 1}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors disabled:opacity-40"
          style={{ fontSize: '0.85rem', fontWeight: 500 }}
        >
          <ChevronLeft className="w-4 h-4" /> Voltar
        </button>

        {step < 4 ? (
          <button
            onClick={() => setStep(s => s + 1)}
            disabled={step === 1 && selectedProducts.size === 0}
            className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-40"
            style={{ fontSize: '0.85rem', fontWeight: 600 }}
          >
            Continuar <ChevronRight className="w-4 h-4" />
          </button>
        ) : step === 4 ? (
          <button
            onClick={handleGenerate}
            disabled={generating || !prompt}
            className="flex items-center gap-1.5 px-6 py-2 rounded-lg text-white hover:opacity-90 transition-all disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, oklch(0.55 0.22 285), oklch(0.6 0.22 262))', fontWeight: 700, fontSize: '0.9rem' }}
          >
            {generating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Gerar com IA
              </>
            )}
          </button>
        ) : (
          <button
            className="flex items-center gap-1.5 px-5 py-2 rounded-lg border border-border text-foreground hover:bg-secondary/60 transition-colors"
            style={{ fontSize: '0.85rem', fontWeight: 500 }}
          >
            <Share2 className="w-4 h-4" /> Compartilhar
          </button>
        )}
      </div>
    </div>
  );
}
