import { Router } from 'express';
import * as tipoUsuarioController from '../controllers/tipoUsuarioController';
import { autenticar } from '../middleware/authMiddleware';

const router = Router();

router.get('/', tipoUsuarioController.list);
router.get('/:id', tipoUsuarioController.getById);
router.post('/', autenticar, tipoUsuarioController.create);
router.put('/:id', autenticar, tipoUsuarioController.update);
router.delete('/:id', autenticar, tipoUsuarioController.remove);

export default router;
