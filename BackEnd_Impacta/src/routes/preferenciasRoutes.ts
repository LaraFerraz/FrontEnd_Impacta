import { Router } from 'express';
import * as preferenciaController from '../controllers/preferenciaController';
import { autenticar } from '../middleware/authMiddleware';

const router = Router();

router.use(autenticar);

router.get('/usuario/:usuario_id', preferenciaController.listPorUsuario);
router.get('/:id', preferenciaController.getById);
router.post('/', preferenciaController.create);
router.delete('/:id', preferenciaController.remove);

export default router;
