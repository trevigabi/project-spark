import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Cell,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "../data/mockData";
import type { Granularity, GoalData, GoalMini, StatusSeg } from "../data/mockData";

const GRANULARITY_LABELS: Record<Granularity, string> = { semana: 'Semana', mes: 'Mês', ano: 'Ano' };

export function SectionTitle({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div className="flex items-baseline gap-2 mt-2">
      <p className="text-muted-foreground" style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        {children}
      </p>
      {hint && <span className="text-muted-foreground/70" style={{ fontSize: '0.68rem' }}>{hint}</span>}
    </div>
  );
}

export function StatusStack({ segments }: { segments: StatusSeg[] }) {
  const total = segments.reduce((a, s) => a + s.qty, 0) || 1;
  return (
    <div>
      <div className="flex h-8 rounded-lg overflow-hidden gap-0.5">
        {segments.map(s => {
          const pct = (s.qty / total) * 100;
          return (
            <div
              key={s.label}
              title={`${s.label}: ${s.qty} (${pct.toFixed(0)}%)`}
              className="flex items-center justify-center text-white"
              style={{ flex: s.qty || 0.001, background: s.color, fontSize: '0.7rem', fontWeight: 600 }}
            >
              {pct >= 8 ? s.qty : ''}
            </div>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3">
        {segments.map(s => (
          <span key={s.label} className="flex items-center gap-1.5 text-muted-foreground" style={{ fontSize: '0.72rem' }}>
            <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: s.color }} />
            {s.label} · {s.qty}
            {s.action && (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-400/15 text-amber-500" style={{ fontSize: '0.6rem', fontWeight: 700 }}>ação</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

export function RankBars({ rows, formatValue }: { rows: { label: string; value: number }[]; formatValue?: (v: number) => string }) {
  const max = Math.max(...rows.map(r => r.value), 1);
  const fmt = formatValue ?? ((v: number) => v.toLocaleString('pt-BR'));
  return (
    <div className="space-y-2.5">
      {rows.map(r => (
        <div key={r.label} className="grid items-center gap-2.5" style={{ gridTemplateColumns: '120px 1fr auto' }}>
          <span className="text-muted-foreground truncate" style={{ fontSize: '0.78rem' }}>{r.label}</span>
          <div className="h-3.5 rounded-md bg-secondary overflow-hidden">
            <div className="h-full rounded-md bg-primary" style={{ width: `${(r.value / max) * 100}%` }} />
          </div>
          <span className="text-foreground mono flex-shrink-0" style={{ fontSize: '0.78rem', fontWeight: 600 }}>{fmt(r.value)}</span>
        </div>
      ))}
    </div>
  );
}

export interface RecommendationItem { title: string; message: string; tag?: string; danger?: boolean; }
export function RecommendationList({ items }: { items: RecommendationItem[] }) {
  return (
    <div className="space-y-2">
      {items.map((it, i) => (
        <div key={i} className={`flex items-start gap-2.5 p-3 rounded-lg border ${it.danger ? 'border-red-400/20 bg-red-400/5' : 'border-border/60'}`}>
          <span className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: it.danger ? 'oklch(0.55 0.22 25)' : 'oklch(0.6 0.22 262)' }} />
          <div className="flex-1 min-w-0">
            <p className="text-foreground" style={{ fontSize: '0.82rem', fontWeight: 600 }}>{it.title}</p>
            <p className="text-muted-foreground mt-0.5" style={{ fontSize: '0.75rem' }}>{it.message}</p>
          </div>
          {it.tag && (
            <span className={`px-2 py-0.5 rounded-full flex-shrink-0 ${it.danger ? 'bg-red-400/10 text-red-400' : 'bg-amber-400/10 text-amber-500'}`} style={{ fontSize: '0.65rem', fontWeight: 700 }}>
              {it.tag}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

function goalPct(v: GoalMini) {
  return Math.round((v.achieved / v.target) * 100);
}

function GoalMiniPanel({ v }: { v: GoalMini }) {
  const pct = goalPct(v);
  const falta = Math.max(0, v.target - v.achieved);
  return (
    <div className="flex flex-col p-4 border border-border rounded-xl bg-secondary/30 h-full">
      <p className="text-muted-foreground" style={{ fontSize: '0.66rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{v.title}</p>
      <p className="text-foreground mono mt-0.5" style={{ fontSize: '1.3rem', fontWeight: 700, letterSpacing: '-0.02em' }}>{formatCurrency(v.target)}</p>
      <p className="text-muted-foreground mt-2.5" style={{ fontSize: '0.66rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Vendido</p>
      <div className="inline-flex items-center gap-2 mt-0.5 px-2.5 py-1 rounded-lg border border-border bg-card w-fit">
        <span className="text-foreground mono" style={{ fontSize: '0.92rem', fontWeight: 700 }}>{formatCurrency(v.achieved)}</span>
        <span className="px-1.5 py-0.5 rounded-full bg-secondary text-muted-foreground" style={{ fontSize: '0.62rem', fontWeight: 700 }}>{pct}%</span>
      </div>
      {v.delta && <p className="text-emerald-400 mt-2" style={{ fontSize: '0.74rem', fontWeight: 600 }}>{v.delta}</p>}
      {v.counts && (
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2.5">
          {v.counts.map((c, i) => (
            <span key={i} className="text-muted-foreground" style={{ fontSize: '0.72rem' }}>
              <span className="text-foreground" style={{ fontWeight: 700 }}>{c.value}</span> {c.label}
            </span>
          ))}
        </div>
      )}
      <p className="text-red-400 mt-auto pt-2.5" style={{ fontSize: '0.74rem', fontWeight: 600 }}>Falta {formatCurrency(falta)}</p>
    </div>
  );
}

const GoalTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-xl">
      <p className="text-foreground" style={{ fontSize: '0.8rem', fontWeight: 600 }}>{d.label} · {d.pct}% da meta</p>
    </div>
  );
};

export function GoalPanel({ title, data, granularity, onGranularityChange }: {
  title: string; data: GoalData; granularity: Granularity; onGranularityChange: (g: Granularity) => void;
}) {
  const d = data[granularity];
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-start justify-between gap-3 flex-wrap mb-1">
        <div>
          <h3 className="text-foreground" style={{ fontWeight: 600, fontSize: '0.9rem' }}>{title}</h3>
          <p className="text-muted-foreground mt-0.5" style={{ fontSize: '0.75rem' }}>{d.hint}</p>
        </div>
        <div className="inline-flex rounded-lg bg-secondary p-0.5">
          {(Object.keys(GRANULARITY_LABELS) as Granularity[]).map(g => (
            <button
              key={g}
              onClick={() => onGranularityChange(g)}
              className={`px-3 py-1.5 rounded-md transition-colors ${granularity === g ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              style={{ fontSize: '0.75rem', fontWeight: 500 }}
            >
              {GRANULARITY_LABELS[g]}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,220px)_minmax(0,260px)_1fr] gap-4 mt-4">
        <GoalMiniPanel v={d.sub} />
        <GoalMiniPanel v={d.main} />
        <div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={d.bars} margin={{ top: 20, right: 4, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis hide domain={[0, (max: number) => Math.max(120, max) * 1.1]} />
              <ReferenceLine y={100} stroke="oklch(0.65 0.18 162)" strokeDasharray="4 3" />
              <Tooltip content={<GoalTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
              <Bar dataKey="pct" radius={[6, 6, 0, 0]}>
                {d.bars.map((b, i) => (
                  <Cell key={i} fill={b.current ? 'oklch(0.72 0.15 48)' : b.pct >= 100 ? 'oklch(0.65 0.18 162)' : 'oklch(0.55 0.22 25)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 mt-1">
            <span className="flex items-center gap-1.5 text-muted-foreground" style={{ fontSize: '0.7rem' }}>
              <span className="w-2.5 h-2.5 rounded-sm" style={{ background: 'oklch(0.65 0.18 162)' }} /> Meta batida
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground" style={{ fontSize: '0.7rem' }}>
              <span className="w-2.5 h-2.5 rounded-sm" style={{ background: 'oklch(0.55 0.22 25)' }} /> Abaixo da meta
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground" style={{ fontSize: '0.7rem' }}>
              <span className="w-2.5 h-2.5 rounded-sm" style={{ background: 'oklch(0.72 0.15 48)' }} /> Em andamento
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
