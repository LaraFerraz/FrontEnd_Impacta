import { Usuario, Projeto, Favoritos, Participacoes } from '../models';

export interface DashboardStats {
  usuarios: number;
  projetos: number;
  favoritos: number;
  participacoes: number;
}

export const getStats = async (): Promise<DashboardStats> => {
  const [usuarios, projetos, favoritos, participacoes] = await Promise.all([
    Usuario.count(),
    Projeto.count(),
    Favoritos.count(),
    Participacoes.count()
  ]);

  return { usuarios, projetos, favoritos, participacoes };
};
