import { Router } from 'express';
import { autenticar } from '../middleware/authMiddleware';
import {
  statusCampanhaController,
  statusParticipacaoController,
  statusServicoController
} from '../controllers/statusController';

const buildLookupRouter = (controller: typeof statusCampanhaController): Router => {
  const router = Router();
  router.get('/', controller.list);
  router.get('/:id', controller.getById);
  router.post('/', autenticar, controller.create);
  router.put('/:id', autenticar, controller.update);
  router.delete('/:id', autenticar, controller.remove);
  return router;
};

export const statusCampanhaRoutes = buildLookupRouter(statusCampanhaController);
export const statusParticipacaoRoutes = buildLookupRouter(statusParticipacaoController);
export const statusServicoRoutes = buildLookupRouter(statusServicoController);
