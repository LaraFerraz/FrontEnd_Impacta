import { StatusServico, ServicosDisponiveis } from '../models';
import { createSimpleLookupService } from '../utils/simpleLookupFactory';

export const statusServicoService = createSimpleLookupService(StatusServico, 'Status de serviço', (id) => ({
  count: () => ServicosDisponiveis.count({ where: { status_servico_id: id } }),
  message: 'Não é possível deletar um status de serviço associado a serviços'
}));
