import { useState } from "react";
import { Users, Store, Info } from "lucide-react";
import { visoes, defaultPermissions, type VisaoKey, type PermissionsState } from "../data/permissions";
import { PermissionMatrixTable } from "./PermissionMatrixTable";

type Profile = 'rep' | 'lojista';

interface AccessPermissionsPageProps {
  profile: Profile;
}

const scopeCopy: Record<Profile, { visao: VisaoKey; title: string; subtitle: string; note: string; icon: React.ComponentType<{ className?: string }> }> = {
  rep: {
    visao: 'representante',
    title: 'Permissões da minha equipe',
    subtitle: 'Controle o que o preposto vinculado à sua conta pode acessar',
    note: 'Essas permissões valem apenas para os usuários vinculados à sua conta de representante (ex.: preposto). A indústria mantém o controle geral de acessos.',
    icon: Users,
  },
  lojista: {
    visao: 'lojista',
    title: 'Permissões da minha loja',
    subtitle: 'Controle o que o comprador vinculado à sua conta pode acessar',
    note: 'Essas permissões valem apenas para os usuários vinculados à sua conta de lojista (ex.: comprador). A indústria mantém o controle geral de acessos.',
    icon: Store,
  },
};

export function AccessPermissionsPage({ profile }: AccessPermissionsPageProps) {
  const scope = scopeCopy[profile];
  const [permissionsState, setPermissionsState] = useState<PermissionsState>(defaultPermissions);

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
        <p className="text-foreground" style={{ fontSize: '0.78rem', lineHeight: 1.55 }}>{scope.note}</p>
      </div>

      <p className="text-muted-foreground" style={{ fontSize: '0.72rem' }}>{visaoInfo.desc}</p>

      <PermissionMatrixTable
        matrix={permissionsState[scope.visao]}
        onToggle={togglePermission}
        onReset={() => setPermissionsState(prev => ({ ...prev, [scope.visao]: defaultPermissions[scope.visao] }))}
      />
    </div>
  );
}
