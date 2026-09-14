import { Router } from 'express';
import * as infoCampanhaController from '../controllers/infoCampanhaController';
import { autenticar } from '../middleware/authMiddleware';

const router = Router();

router.get('/', infoCampanhaController.list);
router.get('/:id', infoCampanhaController.getById);
router.post('/', autenticar, infoCampanhaController.create);
router.put('/:id', autenticar, infoCampanhaController.update);
router.delete('/:id', autenticar, infoCampanhaController.remove);

export default router;
