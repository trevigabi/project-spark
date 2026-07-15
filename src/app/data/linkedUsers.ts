export interface LinkedUser {
  id: string;
  name: string;
  email: string;
  profile: string;
  status: 'ativo' | 'inativo';
  lastLogin: string;
  ownerType: 'representante' | 'lojista';
  /** Nome do representante ou razão social do lojista ao qual este usuário está vinculado. */
  ownerName: string;
}

export const linkedUsers: LinkedUser[] = [
  // Vinculados ao representante Marcos Andrade
  { id: 'LU001', name: 'Marcos Andrade', email: 'marcos@tesla.com.br', profile: 'Representante', status: 'ativo', lastLogin: '2026-07-14', ownerType: 'representante', ownerName: 'Marcos Andrade' },
  { id: 'LU002', name: 'Juliana Prado', email: 'juliana.prado@tesla.com.br', profile: 'Preposto', status: 'ativo', lastLogin: '2026-07-10', ownerType: 'representante', ownerName: 'Marcos Andrade' },
  { id: 'LU003', name: 'Diego Farias', email: 'diego.farias@tesla.com.br', profile: 'Preposto', status: 'inativo', lastLogin: '2026-06-02', ownerType: 'representante', ownerName: 'Marcos Andrade' },

  // Vinculados a outros representantes (visíveis para a indústria)
  { id: 'LU004', name: 'Fernanda Lima', email: 'fernanda@tesla.com.br', profile: 'Representante', status: 'ativo', lastLogin: '2026-07-13', ownerType: 'representante', ownerName: 'Fernanda Lima' },
  { id: 'LU005', name: 'Carlos Mendes', email: 'carlos@tesla.com.br', profile: 'Representante', status: 'ativo', lastLogin: '2026-07-11', ownerType: 'representante', ownerName: 'Carlos Mendes' },

  // Vinculados ao lojista Calçadão Paulista LTDA
  { id: 'LU006', name: 'Calçadão Paulista LTDA', email: 'compras@calcadaopaulista.com.br', profile: 'Lojista', status: 'ativo', lastLogin: '2026-07-14', ownerType: 'lojista', ownerName: 'Calçadão Paulista LTDA' },
  { id: 'LU007', name: 'Renata Souza', email: 'renata.souza@calcadaopaulista.com.br', profile: 'Comprador', status: 'ativo', lastLogin: '2026-07-12', ownerType: 'lojista', ownerName: 'Calçadão Paulista LTDA' },
  { id: 'LU008', name: 'Bruno Alves', email: 'bruno.alves@calcadaopaulista.com.br', profile: 'Comprador', status: 'ativo', lastLogin: '2026-07-09', ownerType: 'lojista', ownerName: 'Calçadão Paulista LTDA' },

  // Vinculados a outros lojistas (visíveis para a indústria)
  { id: 'LU009', name: 'Sapataria Mineira', email: 'compras@sapatariamineira.com.br', profile: 'Lojista', status: 'ativo', lastLogin: '2026-07-11', ownerType: 'lojista', ownerName: 'Sapataria Mineira' },
  { id: 'LU010', name: 'Fashion Feet SP', email: 'compras@fashionfeetsp.com.br', profile: 'Lojista', status: 'ativo', lastLogin: '2026-07-08', ownerType: 'lojista', ownerName: 'Fashion Feet SP' },
];
