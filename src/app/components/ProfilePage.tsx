import {
  Building2, MapPin, FileText, CreditCard, UserCheck, Bell, Lock,
  Users, Target, TrendingUp, Award, Store, Settings, Database,
  Activity, Package2, Tag, ShieldCheck, Mail, Phone, CheckCircle2, XCircle,
} from "lucide-react";

type Profile = 'admin' | 'rep' | 'lojista';

interface ProfilePageProps {
  profile: Profile;
}

// ---------- helpers ----------
function Section({ icon: Icon, title, description, children }: { icon: React.ComponentType<{ className?: string }>; title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-foreground" style={{ fontSize: '0.92rem', fontWeight: 600 }}>{title}</h3>
          {description && <p className="text-muted-foreground mt-0.5" style={{ fontSize: '0.75rem' }}>{description}</p>}
        </div>
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Field({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="grid grid-cols-3 gap-3 items-start py-1.5 border-b border-border/60 last:border-0">
      <span className="text-muted-foreground col-span-1" style={{ fontSize: '0.75rem' }}>{label}</span>
      <span className={`text-foreground col-span-2 ${mono ? 'font-mono' : ''}`} style={{ fontSize: '0.82rem', fontWeight: 500 }}>{value}</span>
    </div>
  );
}

function Toggle({ label, description, defaultChecked = false }: { label: string; description?: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-start justify-between gap-3 py-2 cursor-pointer">
      <div className="flex-1 min-w-0">
        <div className="text-foreground" style={{ fontSize: '0.82rem', fontWeight: 500 }}>{label}</div>
        {description && <div className="text-muted-foreground mt-0.5" style={{ fontSize: '0.72rem' }}>{description}</div>}
      </div>
      <input type="checkbox" defaultChecked={defaultChecked} className="mt-1 w-9 h-5 appearance-none rounded-full bg-secondary checked:bg-primary relative cursor-pointer transition-colors before:content-[''] before:absolute before:top-0.5 before:left-0.5 before:w-4 before:h-4 before:rounded-full before:bg-background before:transition-transform checked:before:translate-x-4" />
    </label>
  );
}

function StatusPill({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.7rem] font-medium ${ok ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}>
      {ok ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
      {label}
    </span>
  );
}

// ---------- Lojista ----------
function LojistaProfile() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Section icon={Building2} title="Dados da empresa">
        <Field label="Razão social" value="Calçados Bella Moda LTDA" />
        <Field label="Nome fantasia" value="Bella Moda" />
        <Field label="CNPJ" value="12.345.678/0001-90" mono />
        <Field label="Inscrição estadual" value="123.456.789.012" mono />
      </Section>

      <Section icon={MapPin} title="Endereço de entrega">
        <Field label="Logradouro" value="Av. Paulista, 1500 — Sala 802" />
        <Field label="Bairro" value="Bela Vista" />
        <Field label="Cidade / UF" value="São Paulo / SP" />
        <Field label="CEP" value="01310-100" mono />
      </Section>

      <Section icon={FileText} title="Tabela comercial vigente" description="Definida pela indústria para sua conta">
        <Field label="Tabela" value={<span className="px-2 py-0.5 rounded-md bg-primary/15 text-primary">Tabela B — Verão 26</span>} />
        <Field label="Condição de pagamento" value="30/60/90 dias" />
        <Field label="Pedido mínimo" value="R$ 3.000,00" />
        <Field label="Frete" value="CIF acima de R$ 5.000,00" />
      </Section>

      <Section icon={CreditCard} title="Situação financeira" description="Sincronizado com o ERP">
        <Field label="Limite de crédito" value="R$ 25.000,00" />
        <Field label="Utilizado" value="R$ 8.420,00" />
        <Field label="Disponível" value={<span className="text-emerald-400">R$ 16.580,00</span>} />
        <Field label="Status" value={<StatusPill ok label="Adimplente" />} />
      </Section>

      <Section icon={UserCheck} title="Representante responsável">
        <Field label="Nome" value="Marina Costa" />
        <Field label="Região" value="Sudeste — SP Capital" />
        <Field label="E-mail" value={<span className="inline-flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-muted-foreground" />marina.costa@tesla.com.br</span>} />
        <Field label="Telefone" value={<span className="inline-flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-muted-foreground" />(11) 98765-4321</span>} />
      </Section>

      <Section icon={Bell} title="Preferências de notificação">
        <Toggle label="Novidades e lançamentos" description="Avise quando novas coleções estiverem disponíveis" defaultChecked />
        <Toggle label="Confirmação de pedido" description="Receba um e-mail a cada pedido confirmado" defaultChecked />
        <Toggle label="Status de faturamento" description="Atualizações sobre boletos e notas fiscais" defaultChecked />
        <Toggle label="Campanhas e ofertas" description="Promoções pontuais da indústria" />
      </Section>

      <Section icon={Lock} title="Senha e acesso">
        <Field label="E-mail de acesso" value="compras@bellamoda.com.br" />
        <Field label="Última alteração de senha" value="há 3 meses" />
        <button className="mt-2 px-3 py-1.5 rounded-md border border-border text-foreground hover:bg-secondary/60 transition-colors" style={{ fontSize: '0.78rem', fontWeight: 500 }}>
          Alterar senha
        </button>
      </Section>
    </div>
  );
}

// ---------- Representante ----------
function RepProfile() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Section icon={Users} title="Dados pessoais">
        <Field label="Nome" value="Marina Costa" />
        <Field label="CPF" value="123.456.789-00" mono />
        <Field label="E-mail" value="marina.costa@tesla.com.br" />
        <Field label="Telefone" value="(11) 98765-4321" />
        <Field label="Região de atuação" value="Sudeste — SP Capital e Grande SP" />
      </Section>

      <Section icon={Target} title="Metas do período" description="Ciclo Verão 26 · jan–abr">
        <Field label="Meta sell-in" value="R$ 480.000,00" />
        <Field label="Realizado" value={<span className="text-emerald-400">R$ 312.450,00 (65%)</span>} />
        <Field label="Faltam" value="R$ 167.550,00" />
        <div className="mt-2 h-2 rounded-full bg-secondary overflow-hidden">
          <div className="h-full bg-emerald-500" style={{ width: '65%' }} />
        </div>
      </Section>

      <Section icon={Store} title="Carteira de lojas" description="32 lojas vinculadas">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 rounded-lg bg-secondary/40 border border-border">
            <div className="text-emerald-400" style={{ fontSize: '1.1rem', fontWeight: 700 }}>24</div>
            <div className="text-muted-foreground" style={{ fontSize: '0.68rem' }}>Ativas</div>
          </div>
          <div className="p-2 rounded-lg bg-secondary/40 border border-border">
            <div className="text-amber-400" style={{ fontSize: '1.1rem', fontWeight: 700 }}>5</div>
            <div className="text-muted-foreground" style={{ fontSize: '0.68rem' }}>Inativas</div>
          </div>
          <div className="p-2 rounded-lg bg-secondary/40 border border-border">
            <div className="text-red-400" style={{ fontSize: '1.1rem', fontWeight: 700 }}>3</div>
            <div className="text-muted-foreground" style={{ fontSize: '0.68rem' }}>Bloqueadas</div>
          </div>
        </div>
        <Field label="Top cliente" value="Bella Moda — R$ 42.180,00" />
        <Field label="Cliente sem pedido há +60d" value="7 lojas" />
      </Section>

      <Section icon={TrendingUp} title="Indicadores e comissão">
        <Field label="Comissão acumulada (ciclo)" value="R$ 9.373,50" />
        <Field label="Taxa média" value="3,0% sobre sell-in" />
        <Field label="Ticket médio" value="R$ 4.820,00" />
        <Field label="Mix de produtos" value="68% feminino · 32% masculino" />
      </Section>

      <Section icon={Bell} title="Preferências de notificação">
        <Toggle label="Novos pedidos da carteira" description="Quando uma loja sua finalizar pedido" defaultChecked />
        <Toggle label="Alertas de meta" description="Avisos semanais sobre avanço de meta" defaultChecked />
        <Toggle label="Clientes inativos" description="Quando uma loja ficar 30d sem pedido" defaultChecked />
        <Toggle label="Novidades de catálogo" description="Lançamentos e reposições" />
      </Section>

      <Section icon={Lock} title="Senha e acesso">
        <Field label="Usuário" value="marina.costa" />
        <Field label="Última alteração de senha" value="há 1 mês" />
        <Field label="Autenticação em 2 fatores" value={<StatusPill ok label="Ativa" />} />
        <button className="mt-2 px-3 py-1.5 rounded-md border border-border text-foreground hover:bg-secondary/60 transition-colors" style={{ fontSize: '0.78rem', fontWeight: 500 }}>
          Alterar senha
        </button>
      </Section>
    </div>
  );
}

// ---------- Indústria ----------
function AdminProfile() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Section icon={Building2} title="Dados da conta">
        <Field label="Indústria" value="Tesla Footwear" />
        <Field label="CNPJ" value="98.765.432/0001-10" mono />
        <Field label="Plano" value={<span className="px-2 py-0.5 rounded-md bg-primary/15 text-primary">Enterprise</span>} />
        <Field label="Nível de acesso" value={<span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />Administrador master</span>} />
      </Section>

      <Section icon={Package2} title="Configurações de catálogo">
        <Field label="Linhas ativas" value="Feminino · Masculino · Infantil" />
        <Field label="SKUs publicados" value="1.284" />
        <Field label="Coleção corrente" value="Verão 26" />
        <Field label="Tabelas vigentes" value={<span className="inline-flex items-center gap-1.5"><Tag className="w-3.5 h-3.5 text-muted-foreground" />A · B · C</span>} />
      </Section>

      <Section icon={Users} title="Usuários cadastrados">
        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 rounded-lg bg-secondary/40 border border-border">
            <div className="text-foreground" style={{ fontSize: '1.2rem', fontWeight: 700 }}>18</div>
            <div className="text-muted-foreground" style={{ fontSize: '0.72rem' }}>Representantes</div>
          </div>
          <div className="p-3 rounded-lg bg-secondary/40 border border-border">
            <div className="text-foreground" style={{ fontSize: '1.2rem', fontWeight: 700 }}>342</div>
            <div className="text-muted-foreground" style={{ fontSize: '0.72rem' }}>Lojistas</div>
          </div>
        </div>
        <Field label="Convites pendentes" value="4" />
        <Field label="Último cadastro" value="hoje, 09:14" />
      </Section>

      <Section icon={Database} title="Integrações ativas">
        <Field label="ERP (Senior)" value={<StatusPill ok label="Sincronizado" />} />
        <Field label="API Sell-out" value={<StatusPill ok label="Online" />} />
        <Field label="Gateway pagamento" value={<StatusPill ok label="Ativo" />} />
        <Field label="Hub de NF-e" value={<StatusPill ok={false} label="Atenção" />} />
        <Field label="Última sincronização" value="há 6 minutos" />
      </Section>

      <Section icon={Activity} title="Logs de atividade" description="Últimas ações no painel">
        <ul className="space-y-2">
          {[
            { who: 'marina.costa', what: 'criou pedido #4821', when: '5 min atrás' },
            { who: 'admin@tesla', what: 'atualizou Tabela B', when: '2 h atrás' },
            { who: 'paulo.ramos', what: 'cadastrou novo lojista', when: 'hoje, 08:42' },
            { who: 'sistema', what: 'sincronização ERP concluída', when: 'hoje, 06:00' },
          ].map((l, i) => (
            <li key={i} className="flex items-center justify-between gap-3 py-1.5 border-b border-border/60 last:border-0">
              <div className="min-w-0">
                <span className="text-foreground" style={{ fontSize: '0.8rem', fontWeight: 500 }}>{l.who}</span>
                <span className="text-muted-foreground ml-2" style={{ fontSize: '0.78rem' }}>{l.what}</span>
              </div>
              <span className="text-muted-foreground flex-shrink-0" style={{ fontSize: '0.72rem' }}>{l.when}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section icon={Settings} title="Segurança e acesso">
        <Field label="E-mail" value="admin@tesla.com.br" />
        <Field label="Última alteração de senha" value="há 14 dias" />
        <Field label="Autenticação em 2 fatores" value={<StatusPill ok label="Obrigatória" />} />
        <Field label="Sessões ativas" value="2 dispositivos" />
        <button className="mt-2 px-3 py-1.5 rounded-md border border-border text-foreground hover:bg-secondary/60 transition-colors" style={{ fontSize: '0.78rem', fontWeight: 500 }}>
          Alterar senha
        </button>
      </Section>
    </div>
  );
}

export function ProfilePage({ profile }: ProfilePageProps) {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {profile === 'lojista' && <LojistaProfile />}
      {profile === 'rep' && <RepProfile />}
      {profile === 'admin' && <AdminProfile />}
    </div>
  );
}
