import { useState } from "react";
import { Users, Store, Info, UserPlus, Trash2 } from "lucide-react";
import { visoes, defaultPermissions, type VisaoKey, type PermissionsState } from "../data/permissions";
import { linkedUsers as initialLinkedUsers, type LinkedUser } from "../data/linkedUsers";
import { clients, formatDate } from "../data/mockData";
import { PermissionMatrixTable } from "./PermissionMatrixTable";

type Profile = 'rep' | 'lojista';

interface AccessPermissionsPageProps {
  profile: Profile;
}

const scopeCopy: Record<Profile, {
  visao: VisaoKey;
  ownerType: LinkedUser['ownerType'];
  ownerName: string;
  /** Perfil que representa o próprio dono da conta (rep ou lojista), usado para sugerir o perfil padrão de novos convites. */
  ownerProfile: string;
  title: string;
  subtitle: string;
  usersHint: string;
  icon: React.ComponentType<{ className?: string }>;
}> = {
  rep: {
    visao: 'representante',
    ownerType: 'representante',
    ownerName: 'Marcos Andrade',
    ownerProfile: 'Representante',
    title: 'Usuários e permissões da minha equipe',
    subtitle: 'Gerencie os prepostos vinculados à sua conta e o que cada um pode acessar',
    usersHint: 'Usuários vinculados à sua conta de representante (ex.: prepostos que vendem em seu nome).',
    icon: Users,
  },
  lojista: {
    visao: 'lojista',
    ownerType: 'lojista',
    ownerName: clients[0].name,
    ownerProfile: 'Lojista',
    title: 'Usuários e permissões da minha loja',
    subtitle: 'Gerencie os compradores vinculados à sua conta e o que cada um pode acessar',
    usersHint: 'Usuários vinculados à sua conta de lojista (ex.: compradores que fazem pedidos pela loja).',
    icon: Store,
  },
};

function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

export function AccessPermissionsPage({ profile }: AccessPermissionsPageProps) {
  const scope = scopeCopy[profile];
  const [permissionsState, setPermissionsState] = useState<PermissionsState>(defaultPermissions);
  const [users, setUsers] = useState<LinkedUser[]>(() =>
    initialLinkedUsers.filter(u => u.ownerType === scope.ownerType && u.ownerName === scope.ownerName)
  );
  const [showInvite, setShowInvite] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');

  const availableProfiles = Object.keys(permissionsState[scope.visao]);
  const subProfile = availableProfiles.find(p => p !== scope.ownerProfile) ?? availableProfiles[availableProfiles.length - 1];

  const togglePermission = (perfil: string, modulo: string) => {
    setPermissionsState(prev => ({
      ...prev,
      [scope.visao]: {
        ...prev[scope.visao],
        [perfil]: {
          ...prev[scope.visao][perfil],
          [modulo]: !prev[scope.visao][perfil][modulo],
        },
      },
    }));
  };

  const changeUserProfile = (id: string, newProfile: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, profile: newProfile } : u));
  };

  const removeUser = (id: string) => setUsers(prev => prev.filter(u => u.id !== id));

  const inviteUser = () => {
    if (!inviteName.trim() || !inviteEmail.trim()) return;
    const newUser: LinkedUser = {
      id: `LU-NEW-${Date.now()}`,
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      profile: subProfile,
      status: 'ativo',
      lastLogin: '—',
      ownerType: scope.ownerType,
      ownerName: scope.ownerName,
    };
    setUsers(prev => [newUser, ...prev]);
    setShowInvite(false);
    setInviteName('');
    setInviteEmail('');
  };

  const Icon = scope.icon;
  const visaoInfo = visoes.find(v => v.id === scope.visao)!;

  return (
    <div className="p-6 max-w-[1400px] mx-auto w-full space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-foreground" style={{ fontSize: '1.05rem', fontWeight: 700, letterSpacing: '-0.01em' }}>{scope.title}</h2>
          <p className="text-muted-foreground" style={{ fontSize: '0.78rem' }}>{scope.subtitle}</p>
        </div>
      </div>

      <div className="flex items-start gap-2.5 rounded-xl border border-primary/20 bg-primary/5 p-3.5">
        <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
        <p className="text-foreground" style={{ fontSize: '0.78rem', lineHeight: 1.55 }}>
          Estes usuários são registrados pela indústria e vinculados à sua conta. Aqui você escolhe o perfil de acesso de cada um — o que cada perfil pode fazer é definido na tabela abaixo.
        </p>
      </div>

      {/* Usuários vinculados */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-5 border-b border-border flex items-center justify-between gap-3">
          <div>
            <h3 className="text-foreground" style={{ fontWeight: 600, fontSize: '0.9rem' }}>Usuários vinculados</h3>
            <p className="text-muted-foreground mt-0.5" style={{ fontSize: '0.75rem' }}>{scope.usersHint}</p>
          </div>
          <button
            onClick={() => setShowInvite(v => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex-shrink-0"
            style={{ fontSize: '0.8rem', fontWeight: 600 }}
          >
            <UserPlus className="w-3.5 h-3.5" /> Convidar usuário
          </button>
        </div>

        {showInvite && (
          <div className="p-4 bg-secondary/20 border-b border-primary/20 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-muted-foreground mb-1" style={{ fontSize: '0.72rem' }}>Nome completo</label>
                <input
                  value={inviteName}
                  onChange={e => setInviteName(e.target.value)}
                  placeholder="Nome do usuário"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-foreground placeholder-muted-foreground outline-none focus:border-primary"
                  style={{ fontSize: '0.82rem' }}
                />
              </div>
              <div>
                <label className="block text-muted-foreground mb-1" style={{ fontSize: '0.72rem' }}>E-mail</label>
                <input
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  placeholder="email@exemplo.com.br"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-foreground placeholder-muted-foreground outline-none focus:border-primary"
                  style={{ fontSize: '0.82rem' }}
                />
              </div>
            </div>
            <p className="text-muted-foreground" style={{ fontSize: '0.72rem' }}>
              Será convidado com o perfil <span className="text-foreground font-medium">{subProfile}</span>. Você pode trocar o perfil depois de criado.
            </p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowInvite(false)} className="px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors" style={{ fontSize: '0.8rem' }}>Cancelar</button>
              <button onClick={inviteUser} className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors" style={{ fontSize: '0.8rem', fontWeight: 600 }}>Convidar</button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/20">
                {['Usuário', 'Perfil de acesso', 'Status', 'Último acesso', ''].map(c => (
                  <th key={c} className="text-left px-4 py-2.5 text-muted-foreground" style={{ fontSize: '0.7rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b border-border/40 hover:bg-secondary/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary" style={{ fontSize: '0.62rem', fontWeight: 700 }}>{initials(u.name)}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-foreground truncate" style={{ fontSize: '0.82rem', fontWeight: 500 }}>{u.name}</p>
                        <p className="text-muted-foreground truncate" style={{ fontSize: '0.72rem' }}>{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={u.profile}
                      onChange={e => changeUserProfile(u.id, e.target.value)}
                      className="px-2.5 py-1.5 rounded-md border border-border bg-surface text-foreground outline-none focus:border-primary"
                      style={{ fontSize: '0.78rem', fontWeight: 500 }}
                    >
                      {availableProfiles.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full ${u.status === 'ativo' ? 'bg-emerald-400/10 text-emerald-400' : 'bg-muted text-muted-foreground'}`} style={{ fontSize: '0.65rem', fontWeight: 600 }}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground mono" style={{ fontSize: '0.75rem' }}>
                    {u.lastLogin === '—' ? '—' : formatDate(u.lastLogin)}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => removeUser(u.id)} className="p-1.5 rounded text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-colors" title="Remover vínculo">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground" style={{ fontSize: '0.82rem' }}>
                    Nenhum usuário vinculado ainda. Convide o primeiro acima.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* O que cada perfil pode acessar */}
      <div>
        <h3 className="text-foreground mb-1" style={{ fontWeight: 600, fontSize: '0.95rem' }}>O que cada perfil pode acessar</h3>
        <p className="text-muted-foreground mb-3" style={{ fontSize: '0.75rem' }}>{visaoInfo.desc}. Alterar aqui afeta todos os usuários com o perfil correspondente.</p>
        <PermissionMatrixTable
          matrix={permissionsState[scope.visao]}
          onToggle={togglePermission}
          onReset={() => setPermissionsState(prev => ({ ...prev, [scope.visao]: defaultPermissions[scope.visao] }))}
        />
      </div>
    </div>
  );
}
