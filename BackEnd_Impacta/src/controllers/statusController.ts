import { statusCampanhaService } from '../services/statusCampanhaService';
import { statusParticipacaoService } from '../services/statusParticipacaoService';
import { statusServicoService } from '../services/statusServicoService';
import { createSimpleLookupController } from '../utils/simpleLookupController';

export const statusCampanhaController = createSimpleLookupController(statusCampanhaService, 'Status de campanha');
export const statusParticipacaoController = createSimpleLookupController(
  statusParticipacaoService,
  'Status de participação'
);
export const statusServicoController = createSimpleLookupController(statusServicoService, 'Status de serviço');
