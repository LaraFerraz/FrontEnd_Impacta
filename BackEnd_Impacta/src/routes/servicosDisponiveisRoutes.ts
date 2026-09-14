import { Router } from 'express';
import * as servicoController from '../controllers/servicoController';
import { autenticar } from '../middleware/authMiddleware';

const router = Router();

router.get('/', servicoController.list);
router.get('/campanha/status/:campanha_ativa', servicoController.listPorStatusCampanha);
router.get('/:id', servicoController.getById);
router.post('/', autenticar, servicoController.create);
router.put('/:id', autenticar, servicoController.update);
router.delete('/:id', autenticar, servicoController.remove);
router.post('/projeto/:projeto_id/sincronizar-status', autenticar, servicoController.sincronizarStatus);

export default router;
