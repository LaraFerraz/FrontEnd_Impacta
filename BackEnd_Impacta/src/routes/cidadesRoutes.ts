import { Router } from 'express';
import * as cidadeController from '../controllers/cidadeController';
import { autenticar } from '../middleware/authMiddleware';

const router = Router();

router.get('/', cidadeController.list);
router.get('/estado/:estadoId', cidadeController.listPorEstado);
router.get('/:id', cidadeController.getById);
router.post('/', autenticar, cidadeController.create);
router.put('/:id', autenticar, cidadeController.update);
router.delete('/:id', autenticar, cidadeController.remove);

export default router;
