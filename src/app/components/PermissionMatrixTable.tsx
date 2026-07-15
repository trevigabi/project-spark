import { Check } from "lucide-react";
import { profileDescriptions } from "../data/permissions";

interface PermissionMatrixTableProps {
  matrix: Record<string, Record<string, boolean>>;
  onToggle: (perfil: string, modulo: string) => void;
  onReset: () => void;
}

export function PermissionMatrixTable({ matrix, onToggle, onReset }: PermissionMatrixTableProps) {
  const perfis = Object.keys(matrix);
  const modulos = Object.keys(matrix[perfis[0]]);

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="p-5 border-b border-border">
        <div className="flex items-center gap-3">
          {perfis.map(perfil => (
            <span key={perfil} className="px-2.5 py-1 rounded-full bg-primary/10 text-primary" style={{ fontSize: '0.72rem', fontWeight: 600 }}>{perfil}</span>
          ))}
        </div>
        <div className="mt-2 space-y-0.5">
          {perfis.map(perfil => (
            <p key={perfil} className="text-muted-foreground" style={{ fontSize: '0.72rem' }}>
              <span className="text-foreground font-medium">{perfil}:</span> {profileDescriptions[perfil]}
            </p>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left px-5 py-3 text-muted-foreground" style={{ fontSize: '0.72rem', fontWeight: 500 }}>Módulo</th>
              {perfis.map(p => (
                <th key={p} className="text-center px-4 py-3 text-foreground" style={{ fontSize: '0.75rem', fontWeight: 600 }}>{p}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {modulos.map(modulo => (
              <tr key={modulo} className="border-b border-border/40 hover:bg-secondary/20 transition-colors">
                <td className="px-5 py-3 text-foreground" style={{ fontSize: '0.82rem' }}>{modulo}</td>
                {perfis.map(perfil => {
                  const allowed = matrix[perfil][modulo];
                  return (
                    <td key={perfil} className="px-4 py-3 text-center">
                      <button
                        onClick={() => onToggle(perfil, modulo)}
                        className="mx-auto flex items-center justify-center w-6 h-6 rounded transition-colors hover:scale-110"
                        title={allowed ? 'Clique para revogar' : 'Clique para conceder'}
                      >
                        {allowed ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <div className="w-4 h-px bg-border" />
                        )}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-5 py-3 border-t border-border/40 flex items-center justify-between">
        <p className="text-muted-foreground" style={{ fontSize: '0.72rem' }}>Clique em qualquer célula para alternar a permissão</p>
        <button onClick={onReset} className="text-muted-foreground hover:text-foreground transition-colors" style={{ fontSize: '0.72rem' }}>
          Restaurar padrões
        </button>
      </div>
    </div>
  );
}
