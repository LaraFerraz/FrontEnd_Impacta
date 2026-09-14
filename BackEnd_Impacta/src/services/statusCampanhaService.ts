import { StatusCampanha, Projeto } from '../models';
import { createSimpleLookupService } from '../utils/simpleLookupFactory';

export const statusCampanhaService = createSimpleLookupService(StatusCampanha, 'Status de campanha', (id) => ({
  count: () => Projeto.count({ where: { status_id: id } }),
  message: 'Não é possível deletar um status de campanha associado a projetos'
}));
