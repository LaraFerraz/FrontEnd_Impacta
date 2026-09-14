import { StatusParticipacao, Participacoes } from '../models';
import { createSimpleLookupService } from '../utils/simpleLookupFactory';

export const statusParticipacaoService = createSimpleLookupService(
  StatusParticipacao,
  'Status de participação',
  (id) => ({
    count: () => Participacoes.count({ where: { status_participacao_id: id } }),
    message: 'Não é possível deletar um status de participação associado a participações'
  })
);
